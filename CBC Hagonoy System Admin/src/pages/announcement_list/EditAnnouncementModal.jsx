import "./Edit_Announcement.css";
import { updates_placeholder } from "../../assets/Images";

function EditAnnouncementModal() {
  return (
    <div className="edit_announcement_modal">
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

export default EditAnnouncementModal;
