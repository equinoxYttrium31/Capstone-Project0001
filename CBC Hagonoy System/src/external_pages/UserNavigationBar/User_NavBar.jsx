import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./User_NavBar.css";
import Users_Profile from "../User_Profile/Users_Profiles";
import Setting_Page from "../SettingFolder/Setting_Page";
import {
  cbc_logo,
  account_icon_light,
  setting_ic_light,
  notif_ic_light,
  acc_ic_selected,
  setting_ic_selected,
} from "../../assets/Assets";
import axios from "axios"; // Assuming Axios is used for fetching user data

import BiblePage from "../../components/NavBar_Components/Bible/BiblePage";
import AboutUs from "../../components/NavBar_Components/About Us/AboutUs";
import Beliefs from "../../components/NavBar_Components/Beliefs/Beliefs";
import Ministries from "../../components/NavBar_Components/Ministries/ministries";

function User_NavBar() {
  const location = useLocation();

  // State to control whether the user profile is visible
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // State to control which modal content is visible
  const [modalContent, setModalContent] = useState(null);

  // State to store user data
  const [user, setUser] = useState(null);

  // Fetch user data (similar to what you're doing in Personal_Acc)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/profile",
          {
            withCredentials: true,
          }
        );
        setUser(response.data); // Store the fetched user data
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Helper function to check if the current path is active
  const isActive = (path) => (location.pathname === path ? "active" : "");

  // Function to handle opening modal with specific content
  const handleModalOpen = (content) => {
    setModalContent(content);
  };

  // Function to close the modal
  const handleModalClose = () => {
    setModalContent(null);
  };

  // Function to toggle the user profile
  const toggleProfile = () => {
    setShowProfile(!showProfile); // Toggle the profile visibility
  };

  const toggleSetting = () => {
    setShowSettings(!showSettings);
  };

  // Only render the navbar if the user is logged in (i.e., user data exists)
  if (!user) {
    return null; // Return nothing if the user is not logged in
  }

  return (
    <div className="nav_bar_cont">
      <div className="main_cont_nav">
        <div className="left_side_nav">
          <img
            src={cbc_logo}
            alt="cbc_logo"
            className="user_nav_logo"
            onClick={handleModalClose}
          />
        </div>
        <div className="right_side_nav">
          <div className="user_nav_links">
            <ul className="user_nav_links_contents">
              {/* OnClick opens the respective component in the modal */}
              <li
                className={isActive("/about")}
                onClick={() => handleModalOpen(<AboutUs />)}
              >
                About Us
              </li>
              <li
                className={isActive("/beliefs")}
                onClick={() => handleModalOpen(<Beliefs />)}
              >
                Beliefs
              </li>
              <li
                className={isActive("/ministries")}
                onClick={() => handleModalOpen(<Ministries isModal={true} />)}
              >
                Ministerial
              </li>
              <li
                className={isActive("/bible")}
                onClick={() => handleModalOpen(<BiblePage />)}
              >
                Bible
              </li>
            </ul>
          </div>
          <div className="user_nav_icons">
            <img
              src={notif_ic_light}
              alt="notification_bell"
              className="user_nav_notification_bell"
            />
            <img
              src={showProfile ? acc_ic_selected : account_icon_light}
              alt="user_profile_picture"
              className="user_nav_profile"
              onClick={toggleProfile}
            />
            <img
              src={showSettings ? setting_ic_selected : setting_ic_light}
              alt="settings_icon"
              className="user_nav_settings"
              onClick={toggleSetting}
            />
          </div>
        </div>
      </div>

      {/* Conditionally render the user profile */}
      {showProfile && <Users_Profile />}

      {showSettings && <Setting_Page />}

      {/* Conditionally render the modal */}
      {modalContent && (
        <div className="modal">
          <div className="modal-content">
            {modalContent} {/* Render the modal content here */}
          </div>
        </div>
      )}
    </div>
  );
}

export default User_NavBar;
