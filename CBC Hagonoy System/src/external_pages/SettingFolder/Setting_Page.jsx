import { useState } from "react";
import axios from "axios"; // Assuming you are using Axios for API calls
import "./Setting_Page.css";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { logout_ic } from "../../assets/Assets";
import { useNavigate } from "react-router-dom";

const Setting_Page = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState("PaS");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Make a request to the backend to log out
      await axios.post(
        "https://capstone-project0001-2.onrender.com/logout",
        {},
        { withCredentials: true }
      );

      // Clear local JWT token if you're storing it locally
      document.cookie = "token=; Max-Age=0"; // Clear cookie

      document.body.style.overflow = "auto";
      // Optionally clear other session data if necessary
      // localStorage.removeItem('someKey');

      // Navigate to the login page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error(
        "Error during logout: " + error.response?.data?.error ||
          "An unexpected error occurred."
      );
    }
  };

  const handleSettingContentClick = (content) => {
    setIsActive(content);
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Basic password validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/api/change-password", {
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        alert("Password changed successfully!");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("An error occurred while changing the password.");
    }
  };

  return (
    <div className="settings_container">
      <div className="setting_content_container">
        <div className="header_container_settings">
          <h2 className="setting_header">Settings</h2>
        </div>
        <div className="settings_selection_container">
          <ul className="setting_Selection">
            <li
              className={`setting_Selection_list ${
                isActive === "PaS" ? "isActive" : ""
              }`}
              onClick={() => handleSettingContentClick("PaS")}
            >
              Password and Account
            </li>
          </ul>
          <ul className="setting_Selection">
            <li
              className={`setting_Selection_list ${
                isActive === "Appearance" ? "isActive" : ""
              }`}
              onClick={() => handleSettingContentClick("Appearance")}
            >
              Appearance
            </li>
          </ul>
        </div>
      </div>

      {/* Password and Security Settings */}
      {isActive === "PaS" && (
        <div className="account_setting_modal">
          <div className="PaS_Setting_cont">
            <h2 className="AccountSettings">Password and Account</h2>
            <p className="PaS_Context">
              Your password is crucial for protecting your account. Ensure it is
              strong and unique.
            </p>
          </div>
          <div className="logout_button_container">
            <h3 className="Logout_Header">End Your Session</h3>
            <div className="button_container_settings">
              {/* Logout Button */}
              <button onClick={handleLogout} className="btn-logout_settings">
                <img
                  src={logout_ic}
                  alt="logout_ic"
                  className="button_ic_logout"
                />
                Log Out
              </button>
            </div>
          </div>
          <div className="change_passwordContainer">
            <h3 className="ChangePassword_Header">Change Password</h3>
            <form className="Change_Pass_Form" onSubmit={handleChangePassword}>
              <div className="big-container-Password">
                <div>
                  <input
                    name="OldPass"
                    className="OldPass"
                    placeholder="Old Password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    className="NewPass"
                    placeholder="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    className="ConfPass"
                    placeholder="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="button_change_cont">
                <button type="submit" className="btn_change_Pass">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Setting_Page.propTypes = {
  onLogout: PropTypes.func.isRequired, // Ensure onLogout is required and is a function
};

export default Setting_Page;
