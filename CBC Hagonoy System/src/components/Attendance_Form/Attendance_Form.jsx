import "./Attendance_Form.css";
import { cbc_logo, placeholder_attendance } from "../../assets/Assets";
import PropTypes from "prop-types";

export default function Attendance_Form({ attendance }) {
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
        <div className="form_container">
          <h2 className="attendance_title">{attendance.title}</h2>
          <p className="attendance_date">Date: {attendance.date}</p>
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
