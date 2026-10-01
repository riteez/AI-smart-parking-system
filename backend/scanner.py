import cv2
from pyzbar.pyzbar import decode
import requests

# Open camera
camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# Check camera
if not camera.isOpened():
    print("Camera not found!")
    exit()

while True:

    success, frame = camera.read()

    if not success:
        print("Cannot read camera")
        break

    # Detect barcode
    for barcode in decode(frame):

        code = barcode.data.decode("utf-8")

        print("Barcode:", code)

        try:
            response = requests.get(f"http://127.0.0.1:5000/scan/{code}")
            print(response.json())
        except Exception as e:
            print("Server Error:", e)

        # Draw rectangle
        x, y, w, h = barcode.rect

        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        cv2.putText(
            frame,
            code,
            (x, y - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )

    cv2.imshow("AI Barcode Scanner", frame)

    # Press ESC to exit
    if cv2.waitKey(1) & 0xFF == 27:
        break

camera.release()
cv2.destroyAllWindows()
