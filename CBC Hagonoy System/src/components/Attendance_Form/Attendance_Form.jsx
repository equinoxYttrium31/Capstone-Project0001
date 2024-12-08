import "./Attendance_Form.css";
import { cbc_logo, placeholder_attendance } from "../../assets/Assets";
import PropTypes from "prop-types";

export default function Attendance_Form({ attendance }) {
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

  return (
    <div className="Form_Container">
      <div className="header_container">
        <img src={cbc_logo} alt="CBCH Logo" className="logo" />
        <div className="header_texts">
          <h4 className="church_name">Christian Bible Church Hagonoy</h4>
          <h1>Attendance Form</h1>
        </div>
      </div>
      {attendance ? (
        <div className="form_container valid">
          <h4 className="attendance_title">Event: {attendance.title}</h4>
          <p className="attendance_date">Date: {formatDate(attendance.date)}</p>
          <br />
          <p className="instructions_text">Fill all the fields.</p>
          <div className="name_container_attendance">
            <label className="label_Lname">Last Name: </label>
            <input type="text" className="inp_Lname" />
            <label className="label_Fname">First Name: </label>
            <input type="text" className="inp_Fname" />
          </div>

          <label className="label_image">Submit a photo of the activity:</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            className="imageInput"
          />
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
};

// Default Props
Attendance_Form.defaultProps = {
  attendance: null, // Default if no attendance prop is passed
};
