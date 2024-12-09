import { useState } from "react";
import "./Attendance_Form.css";
import { cbc_logo, placeholder_attendance } from "../../assets/Assets";
import PropTypes from "prop-types";

export default function Attendance_Form({ attendance, user }) {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    imageBase64: "", // Store Base64 image
  });

  const formatDate = (dateString) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          imageBase64: reader.result,
        }));
      };
      reader.readAsDataURL(file); // Convert image to Base64
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.lastName || !formData.firstName || !formData.imageBase64) {
      alert("Please fill in all the fields.");
      return;
    }

    const submissionData = {
      userID: user.userID,
      name: `${formData.firstName} ${formData.lastName}`,
      date: attendance.date,
      event: attendance.title,
      imageBase64: formData.imageBase64,
    };

    try {
      const response = await fetch(
        "https://client-2oru.onrender.com/submitAttendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit attendance.");
      }

      alert("Attendance submitted successfully!");
      setFormData({ lastName: "", firstName: "", imageBase64: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="Form_Container">
      <div className="header_container">
        <img src={cbc_logo} alt="CBCH Logo" className="logo" />
        <div className="header_texts">
          <h4 className="church_name">Christian Bible Church Hagonoy</h4>
          <h1 className="header_title">Attendance Form</h1>
        </div>
      </div>
      {attendance ? (
        <div className="form_container valid">
          <h4 className="attendance_title">Event: {attendance.title}</h4>
          <p className="attendance_date">Date: {formatDate(attendance.date)}</p>
          <br />
          <p className="instructions_text">Fill all the fields.</p>
          <div className="name_container_attendance">
            <div className="container_names">
              <label className="label_Lname">Last Name: </label>
              <input
                type="text"
                name="lastName"
                className="inp_Lname"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="container_names">
              <label className="label_Fname">First Name: </label>
              <input
                type="text"
                name="firstName"
                className="inp_Fname"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="image_inp_holder">
            <label className="label_image">
              Submit a photo of the activity:
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              className="imageInp"
              onChange={handleChange}
            />
          </div>

          <button className="submit_attendance" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      ) : (
        <div className="form_container">
          <img src={placeholder_attendance} alt="" className="placer_img" />
          <h2 className="placer_text">Attendance is not yet posted.</h2>
          <p className="placer_subtext">Please Comeback Again Later.</p>
        </div>
      )}
    </div>
  );
}

// Props Validation
Attendance_Form.propTypes = {
  attendance: PropTypes.shape({
    attendanceID: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

// Default Props
Attendance_Form.defaultProps = {
  attendance: null, // Default if no attendance prop is passed
};
