import { useEffect, useState } from "react";
import axios from "axios";
import { FaCar } from "react-icons/fa";

function PresentVehicles() {
  const [vehicles, setVehicles] = useState([]);

  const loadPresent = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/present-vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPresent();
    const interval = setInterval(loadPresent, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rightCard fullWidth" style={{ marginTop: "24px" }}>
      <h2 className="tableTitle"><FaCar /> Currently Parked</h2>
      {vehicles.length === 0 ? (
        <p className="qrEmpty">No vehicles currently inside the lot.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Entry Time</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.owner_name}</td>
                <td>{v.vehicle_number}</td>
                <td>{v.vehicle_type}</td>
                <td>{v.entry_time ? new Date(v.entry_time).toLocaleTimeString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PresentVehicles;
