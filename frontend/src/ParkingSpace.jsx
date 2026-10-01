import { useEffect, useState } from "react";
import axios from "axios";
import { FaParking } from "react-icons/fa";
import PresentVehicles from "./PresentVehicles.jsx";

function ParkingSpace() {
  const [status, setStatus] = useState({ total: 0, occupied: 0, available: 0 });

  const loadStatus = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/parking-status");
      setStatus(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const percentFull = status.total ? Math.round((status.occupied / status.total) * 100) : 0;

  return (
    <>
      <div className="rightCard fullWidth">
        <h2 className="tableTitle"><FaParking /> Parking Space</h2>

        <div className="parkingStats">
          <div className="statusCard">
            <h2>{status.total}</h2>
            <p>Total Slots</p>
          </div>
          <div className="statusCard">
            <h2>{status.occupied}</h2>
            <p>Occupied</p>
          </div>
          <div className="statusCard">
            <h2>{status.available}</h2>
            <p>Available</p>
          </div>
        </div>

        <div className="capacityBarOuter">
          <div className="capacityBarInner" style={{ width: `${percentFull}%` }} />
        </div>
        <p className="eyebrow" style={{ marginTop: "10px" }}>{percentFull}% Full</p>
      </div>

      <PresentVehicles />
    </>
  );
}

export default ParkingSpace;
