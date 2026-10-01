import { useState } from "react";
import axios from "axios";
import { useToast } from "./Toast.jsx";
import { FaLock, FaUser, FaCar, FaKey } from "react-icons/fa";

const SLOTS = [
  { id: "P1", top: "6%", left: "6%", color: "#c9a961", delay: "0s" },
  { id: "P2", top: "6%", left: "46%", color: "#34d399", delay: "1.6s" },
  { id: "P3", top: "6%", left: "86%", color: "#c9a961", delay: "3.2s" },
  { id: "P4", top: "44%", left: "4%", color: null, delay: "0s" },
  { id: "P5", top: "44%", left: "90%", color: "#34d399", delay: "2.4s" },
  { id: "P6", top: "80%", left: "8%", color: "#e5b8b8", delay: "0.8s" },
  { id: "P7", top: "80%", left: "46%", color: "#c9a961", delay: "3.8s" },
  { id: "P8", top: "80%", left: "86%", color: "#34d399", delay: "1.2s" },
];

function SlotCar({ color }) {
  return (
    <svg className="slotCarSvg" viewBox="0 0 40 72" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 2 C10 2 6 10 6 20 L6 52 C6 62 10 68 20 70 C30 68 34 62 34 52 L34 20 C34 10 30 2 20 2 Z"
        fill={color}
      />
      <rect x="10" y="16" width="20" height="14" rx="4" fill="rgba(0,0,0,.35)" />
      <rect x="8" y="46" width="24" height="10" rx="3" fill="rgba(255,255,255,.08)" />
      <rect x="4" y="58" width="10" height="4" rx="2" fill="#0b0d12" />
      <rect x="26" y="58" width="10" height="4" rx="2" fill="#0b0d12" />
    </svg>
  );
}

function Login({ onLogin }) {
  const { showToast } = useToast();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      showToast("Enter both username and password.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("sp_auth", "true");
        localStorage.setItem("sp_user", res.data.username);
        showToast(`Welcome back, ${res.data.username}.`, "success");
        onLogin();
      }
    } catch (err) {
      showToast("Couldn't sign in — check your username and password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!username || !newPassword || !confirmPassword) {
      showToast("Fill in all fields to reset your password.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/forgot-password", {
        username,
        newPassword,
      });
      if (res.data.success) {
        showToast("Password updated. You can sign in now.", "success");
        setMode("login");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Couldn't reset password.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    e.currentTarget.style.setProperty("--mx", `${x}%`);
    e.currentTarget.style.setProperty("--my", `${y}%`);
  };

  return (
    <div className="loginScreen" onMouseMove={handleMouseMove}>
      <div className="loginSpotlight" />

      <div className="lotBackdrop">
        {SLOTS.map((s) => (
          <div key={s.id} className="parkingSlot" style={{ top: s.top, left: s.left }}>
            {s.color ? (
              <span className="slotCarCycle" style={{ animationDelay: s.delay }}>
                <SlotCar color={s.color} />
              </span>
            ) : (
              <span className="slotLabel">OPEN</span>
            )}
          </div>
        ))}
      </div>

      <svg className="drivingCar drivingCarLow" viewBox="0 0 140 45" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 34 C5 34 10 20 25 16 L45 8 C55 5 70 5 82 8 L105 14 C118 17 128 22 132 30 L132 34 Z"
          fill="#c9a961"
          opacity="0.65"
        />
        <rect x="30" y="10" width="40" height="10" rx="4" fill="#0b0d12" opacity="0.5" />
        <rect x="118" y="20" width="14" height="4" rx="2" fill="#0b0d12" opacity="0.7" />
        <circle cx="30" cy="38" r="7" fill="#0b0d12" />
        <circle cx="105" cy="38" r="7" fill="#0b0d12" />
        <circle cx="134" cy="24" r="3.2" fill="#fff7e0" className="headlightGlow" />
      </svg>

      <svg className="drivingCar drivingCarHigh" viewBox="0 0 140 45" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 34 C5 34 10 20 25 16 L45 8 C55 5 70 5 82 8 L105 14 C118 17 128 22 132 30 L132 34 Z"
          fill="#34d399"
          opacity="0.55"
        />
        <rect x="30" y="10" width="40" height="10" rx="4" fill="#0b0d12" opacity="0.5" />
        <rect x="118" y="20" width="14" height="4" rx="2" fill="#0b0d12" opacity="0.7" />
        <circle cx="30" cy="38" r="7" fill="#0b0d12" />
        <circle cx="105" cy="38" r="7" fill="#0b0d12" />
        <circle cx="6" cy="24" r="3.2" fill="#fff7e0" className="headlightGlow" />
      </svg>

      <div className="loginCard">
        <FaCar size={32} style={{ color: "var(--gold)", marginBottom: "14px" }} />
        <p className="eyebrow">Access Control</p>
        <h1>AI Smart Parking</h1>

        {mode === "login" ? (
          <>
            <p className="loginSub">Sign in to manage vehicle authentication</p>

            <div className="inputBox">
              <FaUser />
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div className="inputBox">
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <button className="registerBtn" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button className="linkBtn" onClick={() => setMode("reset")}>
              Couldn't sign in? Reset password
            </button>
          </>
        ) : (
          <>
            <p className="loginSub">Reset your password</p>

            <div className="inputBox">
              <FaUser />
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="inputBox">
              <FaKey />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="inputBox">
              <FaKey />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className="registerBtn" onClick={handleReset} disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>

            <button className="linkBtn" onClick={() => setMode("login")}>
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
