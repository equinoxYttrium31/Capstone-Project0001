import "./Announcement_List.css";
import { updates_placeholder } from "../../assets/Images";

export default function Announcement_List() {
  return (
    <div className="announcement_list_mainContainer">
      <div className="placeholder_container">
        <img
          src={updates_placeholder}
          alt="Update Underway"
          className="placeholder"
        />
        <h1 className="update_header">This part is still under development.</h1>
        <p className="update_subtext">This may take a while comeback later.</p>
      </div>
    </div>
  );
}
