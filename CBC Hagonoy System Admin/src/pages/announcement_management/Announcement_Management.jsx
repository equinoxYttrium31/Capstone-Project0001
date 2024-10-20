import { useState, useRef } from "react";
import "./Announcement_Management.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios"; // Import Axios
import { toast } from "react-hot-toast";

function Announcement_Management() {
  const [value, setValue] = useState(""); // For ReactQuill content
  const [imageBase64, setImageBase64] = useState(null); // Base64 image data
  const [title, setTitle] = useState(""); // Title input
  const [audience, setAudience] = useState(""); // Audience selection
  const [publishDateFrom, setPublishDateFrom] = useState(""); // Publish start date
  const [publishDateTo, setPublishDateTo] = useState(""); // Publish end date
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure dates are valid
    if (new Date(publishDateFrom) > new Date(publishDateTo)) {
      toast.error("Publish date range is invalid.");
      return;
    }

    const announcementData = {
      title,
      content: value, // Styled content from ReactQuill
      announcementPic: imageBase64, // Base64 image
      audience,
      publishDate: publishDateFrom,
      endDate: publishDateTo,
    };

    // Log the announcement data being sent to the database
    console.log("Sending Announcement Data to Database:", announcementData);

    try {
      const response = await axios.post(
        "https://capstone-project0001-2.onrender.com/add-announcement",
        announcementData
      );

      if (response.status === 201) {
        // Check if the response is successful
        toast.success("Announcement posted successfully!"); // Use toast for success notification
        resetForm(); // Reset the form after successful submission
      } else {
        toast.error("Failed to post the announcement.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const resetForm = () => {
    setTitle("");
    setValue("");
    setImageBase64(null);
    setAudience("");
    setPublishDateFrom("");
    setPublishDateTo("");
    setImageBase64("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Convert to base64
        setImageBase64(base64String); // Set base64 string
        console.log("Converted Image Base64:", base64String); // Optional: Log to check
      };
      reader.readAsDataURL(file); // Read file as Data URL
    }
  };

  const handleChange = (content) => {
    setValue(content);
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
    <div className="announcement_main_container">
      <div className="announcement_header">
        <p className="church_name_announcement">
          CHRISTIAN BIBLE CHURCH OF HAGONOY
        </p>
        <h2 className="page_title_announcement">Announcement Management</h2>
      </div>
      <div className="create_announcement_title_cont">
        <h3 className="create_announcement_title">Create an announcement</h3>
      </div>
      <div className="add_title_cont">
        <label htmlFor="add_title" className="add_title_text">
          Announcement Title :
        </label>
        <input
          type="text"
          name="add_title"
          id="add_title"
          className="add_title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="rich_text_input_container">
        <label
          htmlFor="announcement_content"
          className="announcement_content_label"
        >
          Message :
        </label>
        <ReactQuill
          className="announcement_content"
          id="announcement_content"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          theme="snow"
          required
        />
      </div>
      <div className="audience_content_container">
        <label htmlFor="" className="audience_label">
          Audience:
        </label>
        <div className="radio-buttons">
          <label className="radio-square">
            <input
              type="radio"
              name="audience"
              value="all_cellgroups"
              checked={audience === "all_cellgroups"}
              onChange={(e) => setAudience(e.target.value)}
              required
            />
            <span className="checkmark"></span>
            All Cellgroups
          </label>
          <label className="radio-square">
            <input
              type="radio"
              name="audience"
              value="network_leaders"
              checked={audience === "network_leaders"}
              onChange={(e) => setAudience(e.target.value)}
              required
            />
            <span className="checkmark"></span>
            Network Leaders
          </label>
        </div>
      </div>
      <div className="date_publish_container">
        <label htmlFor="" className="date_publish_label">
          Date to publish:
        </label>
        <div className="input_container_date">
          <input
            type="date"
            name="publish_from"
            value={publishDateFrom}
            onChange={(e) => setPublishDateFrom(e.target.value)}
            className="publishing_date"
            required
          />
          <p className="to_label"> to </p>
          <input
            type="date"
            name="publish_to"
            value={publishDateTo}
            onChange={(e) => setPublishDateTo(e.target.value)}
            className="publishing_date"
            required
          />
        </div>
      </div>
      <div className="imageUploadContainer">
        <label className="attach_image_label">Attach Image:</label>
        <input
          ref={fileInputRef}
          type="file"
          className="Image_Upload_Announcement"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
      <div className="button_container_announcement">
        <button className="announcement_post" onClick={handleSubmit}>
          Post
        </button>
      </div>
    </div>
  );
}

export default Announcement_Management;
