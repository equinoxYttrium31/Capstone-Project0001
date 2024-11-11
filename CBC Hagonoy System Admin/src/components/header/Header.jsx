import { cbc_logo, setting_ic_dark, notif_ic_dark } from "../../assets/Images";
import { notif_ic_selected } from "../../../../CBC Hagonoy System/src/assets/Assets";
import "./header.css";
import { useState } from "react";

function Header({ toggleNotification }) {
  // Corrected prop name
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    toggleNotification(); // Call the toggle function from App
  };

  return (
    <div className="header_main_container">
      <div className="leftside_cont">
        <img src={cbc_logo} alt="CBC Logo" className="logo_header" />
        <h1 className="Header_Title_Text">Administrator</h1>
      </div>
      <div className="rightside_cont">
        <div className="icon_container">
          <img
            src={showNotifications ? notif_ic_selected : notif_ic_dark}
            alt="notifications"
            className="header_icon"
            onClick={handleNotificationClick}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
