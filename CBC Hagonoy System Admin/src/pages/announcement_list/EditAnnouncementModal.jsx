import { useState, useRef, useEffect } from "react";
import "./Edit_Announcement.css";
import { updates_placeholder } from "../../assets/Images";
import { close_ic } from "../../assets/Images";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-hot-toast";

function EditAnnouncementModal({ announcement, onClose, onSave }) {
  const [value, setValue] = useState(announcement.content || "");
  const [imageBase64, setImageBase64] = useState(
    announcement.announcementPic || null
  );
  const [title, setTitle] = useState(announcement.title || "");
  const [audience, setAudience] = useState(announcement.audience || "");
  const [publishDateFrom, setPublishDateFrom] = useState(
    announcement.publishDate || ""
  );
  const [publishDateTo, setPublishDateTo] = useState(
    announcement.endDate || ""
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    setValue(announcement.content);
    setImageBase64(announcement.announcementPic);
    setTitle(announcement.title);
    setAudience(announcement.audience);
    setPublishDateFrom(announcement.publishDate);
    setPublishDateTo(announcement.endDate);
  }, [announcement]);

  const handleSave = async () => {
    if (new Date(publishDateFrom) > new Date(publishDateTo)) {
      toast.error("Publish date range is invalid.");
      return;
    }

    const updatedAnnouncement = {
      ...announcement,
      title,
      content: value,
      announcementPic: imageBase64,
      audience,
      publishDate: publishDateFrom,
      endDate: publishDateTo,
    };

    try {
      const response = await axios.put(
        `https://capstone-project0001-2.onrender.com/update-announcement/${announcement._id}`,
        updatedAnnouncement
      );

      if (response.status === 200) {
        toast.success("Announcement updated successfully!");
        onSave(updatedAnnouncement);
      } else {
        toast.error("Failed to update the announcement.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "script",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "background",
    "indent",
    "direction",
  ];

  return (
    <div className="edit_announcement_modal">
      <div className="modal_content_edit">
        <div className="edit_modal_header">
          <h2 className="edit_modal_title">Edit Announcement</h2>
          <img
            src={close_ic}
            alt="close button"
            onClick={onClose}
            className="close_btn"
          />
        </div>

        <div className="placeholder_container">
          <img
            src={updates_placeholder}
            alt="Update Underway"
            className="placeholder"
          />
          <h1 className="update_header">
            This part is still under development.
          </h1>
          <p className="update_subtext">
            This may take a while comeback later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EditAnnouncementModal;
