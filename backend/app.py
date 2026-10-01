from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from db import get_connection
from datetime import datetime

app = Flask(__name__)
CORS(app)

TOTAL_SLOTS = 50

@app.route("/")
def home():
    return "AI Smart Parking Backend Running"

@app.route("/register-vehicle", methods=["POST"])
def register_vehicle():
    data = request.json
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
    INSERT INTO vehicles
    (owner_name, vehicle_number, phone, vehicle_type, barcode_id, status)
    VALUES (%s,%s,%s,%s,%s,'OUT')
    """,(
        data["ownerName"],
        data["vehicleNumber"],
        data["phone"],
        data["vehicleType"],
        data["barcodeId"]
    ))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message":"Vehicle Registered Successfully"})

@app.route("/vehicles")
def vehicles():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM vehicles ORDER BY id DESC")
    data = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(data)

@app.route("/present-vehicles")
def present_vehicles():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM vehicles WHERE status='IN' ORDER BY entry_time DESC")
    data = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(data)

@app.route("/scan/<barcode>")
def scan(barcode):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM vehicles WHERE barcode_id=%s", (barcode,))
    vehicle = cursor.fetchone()

    if not vehicle:
        cursor.close()
        connection.close()
        return jsonify({"status": "Unauthorized"})

    if vehicle["status"] == "IN":
        cursor.execute(
            "UPDATE vehicles SET status='OUT', exit_time=%s WHERE barcode_id=%s",
            (datetime.now(), barcode)
        )
        action = "exit"
        vehicle["status"] = "OUT"
    else:
        cursor.execute(
            "UPDATE vehicles SET status='IN', entry_time=%s, exit_time=NULL WHERE barcode_id=%s",
            (datetime.now(), barcode)
        )
        action = "entry"
        vehicle["status"] = "IN"

    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({
        "status": "Authorized",
        "action": action,
        "vehicle": vehicle
    })

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user and check_password_hash(user["password_hash"], password):
        return jsonify({"success": True, "username": user["username"]})

    return jsonify({"success": False, "message": "Invalid username or password"}), 401

@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    username = data.get("username")
    new_password = data.get("newPassword")

    if not username or not new_password:
        return jsonify({"success": False, "message": "Username and new password are required"}), 400

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        connection.close()
        return jsonify({"success": False, "message": "No account found with that username"}), 404

    hashed = generate_password_hash(new_password)
    cursor.execute("UPDATE users SET password_hash=%s WHERE username=%s", (hashed, username))
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({"success": True, "message": "Password updated successfully"})

@app.route("/parking-status")
def parking_status():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM vehicles WHERE status='IN'")
    occupied = cursor.fetchone()[0]
    cursor.close()
    connection.close()

    available = max(TOTAL_SLOTS - occupied, 0)

    return jsonify({
        "total": TOTAL_SLOTS,
        "occupied": occupied,
        "available": available
    })

if __name__=="__main__":
    app.run(debug=True, port=5000)
