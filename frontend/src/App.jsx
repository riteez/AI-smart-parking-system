import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FaCar, FaTh, FaDatabase, FaParking, FaSignOutAlt } from "react-icons/fa";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import DatabaseView from "./DatabaseView.jsx";
import ParkingSpace from "./ParkingSpace.jsx";

function App() {
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem("sp_auth"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);

  const loadVehicles = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isAuthed) loadVehicles();
  }, [isAuthed]);

  const handleLogout = () => {
    localStorage.removeItem("sp_auth");
    localStorage.removeItem("sp_user");
    setIsAuthed(false);
  };

  if (!isAuthed) {
    return <Login onLogin={() => setIsAuthed(true)} />;
  }

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="logo">
          <FaCar size={35} />
          <div>
            <p className="eyebrow">Access Control</p>
            <h1>AI Smart Parking</h1>
            <p>Vehicle Authentication System</p>
          </div>
        </div>

        <div className="status">
          <div className="statusCard">
            <h2>{vehicles.length}</h2>
            <p>Total Vehicles</p>
          </div>
          <div className="statusCard">
            <h2><span className="pulse" /> Live</h2>
            <p>Scanner Active</p>
          </div>
          <button className="logoutBtn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <nav className="tabBar">
        <button className={activeTab === "dashboard" ? "tabBtn active" : "tabBtn"} onClick={() => setActiveTab("dashboard")}>
          <FaTh /> Dashboard
        </button>
        <button className={activeTab === "database" ? "tabBtn active" : "tabBtn"} onClick={() => setActiveTab("database")}>
          <FaDatabase /> Database
        </button>
        <button className={activeTab === "parking" ? "tabBtn active" : "tabBtn"} onClick={() => setActiveTab("parking")}>
          <FaParking /> Parking Space
        </button>
      </nav>

      {activeTab === "dashboard" && <Dashboard onVehicleRegistered={loadVehicles} />}
      {activeTab === "database" && <DatabaseView vehicles={vehicles} />}
      {activeTab === "parking" && <ParkingSpace />}
    </div>
  );
}

export default App;