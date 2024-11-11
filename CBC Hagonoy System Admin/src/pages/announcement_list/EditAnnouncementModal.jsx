import { useState, useRef, useEffect } from "react";
import "./Edit_Announcement.css";
import { close_ic } from "../../assets/Images";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-hot-toast";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function EditAnnouncementModal({ announcement, onClose, onSave }) {
  const [value, setValue] = useState(announcement.content || "");
  const [imageBase64, setImageBase64] = useState(
    announcement.announcementPic || null
  );
  const [title, setTitle] = useState(announcement.title || "");
  const [audience, setAudience] = useState(announcement.audience || "");
  const [publishDateFrom, setPublishDateFrom] = useState(
    formatDate(announcement.publishDate) || ""
  );
  const [publishDateTo, setPublishDateTo] = useState(
    formatDate(announcement.endDate) || ""
  );
  const [fileName, setFileName] = useState("No file chosen");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setValue(announcement.content);
    setImageBase64(announcement.announcementPic);
    setTitle(announcement.title);
    setAudience(announcement.audience);
    setPublishDateFrom(formatDate(announcement.publishDate));
    setPublishDateTo(formatDate(announcement.endDate));
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
        setFileName(file.name);
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

        <div className="edit_mainbody_cont">
          <div className="edit_input_row">
            <label htmlFor="title">Title:</label>
            <input
              className="title_input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="edit_input_row">
            <label htmlFor="message_input">Message:</label>
            <ReactQuill
              className="message_input"
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </div>

          <div className="edit_input_row">
            <label>Audience:</label>
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  name="audience"
                  value="all_cellgroups"
                  checked={audience === "all_cellgroups"}
                  onChange={(e) => setAudience(e.target.value)}
                />
                All Cellgroups
              </label>
              <label>
                <input
                  type="radio"
                  name="audience"
                  value="network_leaders"
                  checked={audience === "network_leaders"}
                  onChange={(e) => setAudience(e.target.value)}
                />
                Network Leaders
              </label>
            </div>
          </div>

          <div className="edit_input_row">
            <label>Date to Publish:</label>
            <input
              type="date"
              value={publishDateFrom || ""}
              onChange={(e) => setPublishDateFrom(e.target.value)}
            />{" "}
            to{" "}
            <input
              type="date"
              value={publishDateTo || ""}
              onChange={(e) => setPublishDateTo(e.target.value)}
            />
          </div>

          <div className="edit_input_row">
            <label
              className="file-upload-button"
              onClick={() => fileInputRef.current.click()}
            >
              Choose File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <span className="file-upload-filename">{fileName}</span>
          </div>
        </div>
        <div className="button_container_dave">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

EditAnnouncementModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  announcement: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditAnnouncementModal;
