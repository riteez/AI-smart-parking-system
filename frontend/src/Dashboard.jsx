import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { useToast } from "./Toast.jsx";
import { FaUsers, FaUser, FaCar, FaPhone, FaTruck, FaQrcode } from "react-icons/fa";
import Scanner from "./Scanner.jsx";

function Dashboard({ onVehicleRegistered }) {
  const { showToast } = useToast();
  const [ownerName, setOwnerName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [currentBarcode, setCurrentBarcode] = useState("");

  const registerVehicle = async () => {
    if (!ownerName || !vehicleNumber || !phone) {
      showToast("Fill in every field before registering.", "error");
      return;
    }
    const newBarcode = "SP" + Date.now();

    try {
      await axios.post("http://127.0.0.1:5000/register-vehicle", {
        ownerName,
        vehicleNumber,
        phone,
        vehicleType,
        barcodeId: newBarcode,
      });

      showToast(`${ownerName}'s vehicle was registered.`, "success");
      setCurrentBarcode(newBarcode);
      setOwnerName("");
      setVehicleNumber("");
      setPhone("");

      onVehicleRegistered();
    } catch (err) {
      console.error(err);
      showToast(
        "Registration failed: " + (err.response?.data?.message || err.message),
        "error"
      );
    }
  };

  return (
    <div className="content">
      <div className="leftCard">
        <h2><FaUsers /> Vehicle Registration</h2>
        <p className="eyebrow">Enter owner and vehicle details</p>

        <div className="inputBox">
          <FaUser />
          <input placeholder="Owner Name" value={ownerName} onChange={(e)=>setOwnerName(e.target.value)} />
        </div>
        <div className="inputBox">
          <FaCar />
          <input placeholder="Vehicle Number" value={vehicleNumber} onChange={(e)=>setVehicleNumber(e.target.value)} />
        </div>
        <div className="inputBox">
          <FaPhone />
          <input placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </div>
        <div className="inputBox">
          <FaTruck />
          <select value={vehicleType} onChange={(e)=>setVehicleType(e.target.value)}>
            <option>Car</option>
            <option>Bike</option>
            <option>Bus</option>
            <option>Truck</option>
          </select>
        </div>

        <button className="registerBtn" onClick={registerVehicle}>Register Vehicle</button>

        <div className="qrCard">
          <h2><FaQrcode /> Access Badge</h2>
          {currentBarcode ? (
            <>
              <QRCodeCanvas value={currentBarcode} size={180} includeMargin={true} />
              <h3>{currentBarcode}</h3>
              <p>Give this badge to the vehicle owner</p>
            </>
          ) : (
            <p className="qrEmpty">No badge generated yet — register a vehicle to issue one.</p>
          )}
        </div>
      </div>

      <div className="rightCard">
        <h2 className="tableTitle">Live QR Scanner</h2>
        <Scanner />
      </div>
    </div>
  );
}

export default Dashboard;