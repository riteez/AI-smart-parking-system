import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useToast } from "./Toast.jsx";

function Scanner() {
  const { showToast } = useToast();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        fetch(`http://127.0.0.1:5000/scan/${decodedText}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "Authorized") {
              if (data.action === "entry") {
                showToast(
                  `Entry recorded — ${data.vehicle.owner_name} (${data.vehicle.vehicle_number})`,
                  "success"
                );
              } else {
                showToast(
                  `Exit recorded — ${data.vehicle.owner_name} (${data.vehicle.vehicle_number})`,
                  "info"
                );
              }
            } else {
              showToast("Unauthorized vehicle", "error");
            }
          })
          .catch(() => {
            showToast("Could not reach the server to verify this code.", "error");
          });
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Live QR Scanner</h2>
      <div id="reader"></div>
    </div>
  );
}

export default Scanner;
