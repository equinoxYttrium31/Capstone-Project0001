import { cbc_logo, setting_ic_dark, notif_ic_dark } from "../../assets/Images";
import "./header.css";

function header() {
  return (
    <div className="header_main_container">
      <div className="leftside_cont">
        <img src={cbc_logo} alt="CBC Logo" className="logo_header" />
        <h1 className="Header_Title_Text">Administrator</h1>
      </div>
      <div className="rightside_cont">
        <div className="icon_container">
          <img
            src={notif_ic_dark}
            alt="notifications"
            className="header_icon"
          />
          <img src={setting_ic_dark} alt="settings" className="header_icon" />
        </div>
      </div>
    </div>
  );
}

export default header;
