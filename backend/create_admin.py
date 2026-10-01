from werkzeug.security import generate_password_hash
from db import get_connection

username = input("Enter admin username: ")
password = input("Enter admin password: ")

hashed = generate_password_hash(password)

connection = get_connection()
cursor = connection.cursor()

cursor.execute(
    "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
    (username, hashed)
)

connection.commit()
cursor.close()
connection.close()

print("Admin user created successfully.")
