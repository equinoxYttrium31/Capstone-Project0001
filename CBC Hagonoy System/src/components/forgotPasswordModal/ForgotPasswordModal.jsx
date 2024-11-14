import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import PropTypes from "prop-types";
import "./ForgotPasswordModal.css";

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestOtp = async (email) => {
    try {
      const response = await fetch(
        "https://capstone-project0001-2.onrender.com/request-otp",
        {
          method: "POST",

          body: JSON.stringify({ email }),
        },
        { withCredentials: true }
      );

      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }

      const data = await response.json();
      console.log("OTP sent:", data);
    } catch (error) {
      console.error("Error requesting OTP:", error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "https://capstone-project0001-2.onrender.com/change-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      if (response.data.success) {
        toast.success("Password changed successfully!");
        onClose();
      } else {
        toast.error("Invalid OTP or error updating password.");
      }
    } catch (error) {
      toast.error("Failed to change password. Try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!otpSent ? (
          <button onClick={handleRequestOtp}>Request OTP</button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Change Password</button>
          </>
        )}
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

ForgotPasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;
