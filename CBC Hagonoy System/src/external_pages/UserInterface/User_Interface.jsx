import { useState, useEffect } from "react";
import axios from "axios";
import User_Chart from "../User_Chart/user_chart";

import Login_Signup from "../../components/login_signup/Login_Signup";

import Personal_Acc from "../Personal_Acc/Personal_Acc";
import User_NavBar from "../UserNavigationBar/User_NavBar";
import Cellgroup_File from "../Cellgroup_Record_Files/Cellgroup_File";
import Network_Record from "../Network_Record_Files/Network_Record";

import {
  cbc_logo,
  cellgroup_ic,
  menus,
  network_ic,
  personal_ic,
} from "../../assets/Assets";

import "./User_Interface.css";

function User_Interface() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [profileRefresh, setProfileRefresh] = useState(false);
  const [activeContent, setActiveContent] = useState("Personal");
  const [overlayType, setOverlayType] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/profile",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    setLoading(true);
    fetchUserData();
  }, [profileRefresh]);

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleContentClick = (content) => {
    setActiveContent(content);
  };

  const handleAttendanceSubmit = (shouldRefresh) => {
    if (shouldRefresh) {
      setRefresh(true);
      setTimeout(() => setRefresh(false), 100);
    }
  };

  const handleClose = () => setError(null); // Close login overlay
  const handleLoginSuccess = () => {
    setError(null); // Clear error on successful login
    setProfileRefresh((prev) => !prev); // Trigger a refresh of user data
  };

  if (loading)
    return (
      <div className="loader_container">
        <div className="loader"></div>
      </div>
    );

  if (error)
    return (
      <div>
        <h2>Please log in to continue.</h2>
        <Login_Signup
          type={overlayType}
          onClose={handleClose}
          toggleOverlayType={() =>
            setOverlayType((prev) => (prev === "login" ? "signup" : "login"))
          }
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );

  const memberType = userData?.memberType;
  const userId = userData?.userID;

  const renderContent = () => {
    if (activeContent === "Personal") {
      return (
        <div className="dynamic_container_personal active">
          <Personal_Acc
            onSubmit={handleAttendanceSubmit}
            profileRefresh={profileRefresh}
          />
          <User_Chart userId={userId} refresh={refresh} />
        </div>
      );
    } else if (
      activeContent === "Cellgroup" &&
      (memberType === "Cellgroup Leader" || memberType === "Network Leader")
    ) {
      return (
        <div className={`container_cellgroup active`}>
          <Cellgroup_File />
        </div>
      );
    } else if (activeContent === "Network" && memberType === "Network Leader") {
      return (
        <div className={`container_network_record active`}>
          <Network_Record />
        </div>
      );
    } else {
      return (
        <div>
          Access Denied: You do not have permission to view this content.
        </div>
      );
    }
  };

  return (
    <div className="user_interface_cont">
      <div className="nav_bar_user">
        <User_NavBar
          setProfileRefresh={setProfileRefresh}
          profileRefresh={profileRefresh}
        />
      </div>
      <div className="main_user_cont">
        <div
          className={`user_dashboard_cont ${
            isSidebarVisible ? "" : "minimized"
          }`}
        >
          <div className="upper_dashboard">
            <p className="dashboard_main_text">DASHBOARD</p>
            <img
              src={menus}
              alt="Menu"
              className="hamburger_menu"
              onClick={handleSidebarToggle}
            />
          </div>

          <div
            className={`icon_container ${
              activeContent === "Personal" ? "active" : ""
            }`}
            onClick={() => handleContentClick("Personal")}
          >
            <img
              src={personal_ic}
              alt="Personal Icon"
              className="icon_personal_user"
            />
            <p className="icon_label personal">Personal Account</p>
          </div>
          {(memberType === "Cellgroup Leader" ||
            memberType === "Network Leader") && (
            <div
              className={`icon_container ${
                activeContent === "Cellgroup" ? "active" : ""
              }`}
              onClick={() => handleContentClick("Cellgroup")}
            >
              <img
                src={cellgroup_ic}
                alt="Cellgroup Icon"
                className="icon_cellgroup_user"
              />
              <p className="icon_label cellgroup">Cellgroup Record</p>
            </div>
          )}
          {memberType === "Network Leader" && (
            <div
              className={`icon_container ${
                activeContent === "Network" ? "active" : ""
              }`}
              onClick={() => handleContentClick("Network")}
            >
              <img
                src={network_ic}
                alt="Network Icon"
                className="icon_network_user"
              />
              <p className="icon_label network">Network Monitoring</p>
            </div>
          )}

          <div className="content_list_dashboard">
            <p
              className={`content_item ${
                activeContent === "Personal" ? "active" : ""
              }`}
              onClick={() => handleContentClick("Personal")}
            >
              Personal Record
            </p>

            {(memberType === "Cellgroup Leader" ||
              memberType === "Network Leader") && (
              <p
                className={`content_item ${
                  activeContent === "Cellgroup" ? "active" : ""
                }`}
                onClick={() => handleContentClick("Cellgroup")}
              >
                Cellgroup Record
              </p>
            )}

            {memberType === "Network Leader" && (
              <p
                className={`content_item ${
                  activeContent === "Network" ? "active" : ""
                }`}
                onClick={() => handleContentClick("Network")}
              >
                Network Monitoring
              </p>
            )}
          </div>

          <div className="credits_group">
            <p className="credits_text">&copy; 2024 All Rights Reserved.</p>
          </div>
        </div>
        <div
          className={`content_display_area ${
            isSidebarVisible ? "" : "expanded"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default User_Interface;
