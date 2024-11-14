import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./User_NavBar.css";
import Users_Profile from "../User_Profile/Users_Profiles";
import Setting_Page from "../SettingFolder/Setting_Page";
import Notifications from "../Notifications/notifications";
import {
  cbc_logo,
  account_icon_light,
  setting_ic_light,
  notif_ic_light,
  notif_ic_selected,
  acc_ic_selected,
  setting_ic_selected,
} from "../../assets/Assets";
import axios from "axios";

import BiblePage from "../../components/NavBar_Components/Bible/BiblePage";
import AboutUs from "../../components/NavBar_Components/About Us/AboutUs";
import Beliefs from "../../components/NavBar_Components/Beliefs/Beliefs";
import Ministries from "../../components/NavBar_Components/Ministries/ministries";

function User_NavBar({ refresh, setRefresh }) {
  const location = useLocation();

  // State variables
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/profile",
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const isActive = (path) => (location.pathname === path ? "active" : "");
  const handleModalOpen = (content) => setModalContent(content);
  const handleModalClose = () => setModalContent(null);
  const toggleProfile = () => setShowProfile(!showProfile);
  const toggleSetting = () => setShowSettings(!showSettings);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle the hamburger menu

  if (!user) {
    return null;
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
          <div
            className={`hamburger_icon ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            {/* Hamburger icon */}
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <div className={`user_nav_links ${isMenuOpen ? "open" : ""}`}>
            <ul className="user_nav_links_contents">
              <li
                className={isActive("/about")}
                onClick={() => {
                  handleModalOpen(<AboutUs />);
                  setIsMenuOpen(false);
                }}
              >
                About Us
              </li>
              <li
                className={isActive("/beliefs")}
                onClick={() => {
                  handleModalOpen(<Beliefs />);
                  setIsMenuOpen(false);
                }}
              >
                Beliefs
              </li>
              <li
                className={isActive("/ministries")}
                onClick={() => {
                  handleModalOpen(<Ministries isModal={true} />);
                  setIsMenuOpen(false);
                }}
              >
                Ministries
              </li>
              <li
                className={isActive("/bible")}
                onClick={() => {
                  handleModalOpen(<BiblePage />);
                  setIsMenuOpen(false);
                }}
              >
                Bible
              </li>
            </ul>
          </div>
          <div className="user_nav_icons">
            <img
              src={showNotifications ? notif_ic_selected : notif_ic_light}
              alt="notification_bell"
              className="user_nav_notification_bell"
              onClick={toggleNotifications}
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

      {showProfile && <Users_Profile setRefresh={setRefresh} />}
      {showSettings && <Setting_Page />}
      {showNotifications && <Notifications />}
      {modalContent && (
        <div className="modal">
          <div className="modal-content">{modalContent}</div>
        </div>
      )}
    </div>
  );
}

export default User_NavBar;
