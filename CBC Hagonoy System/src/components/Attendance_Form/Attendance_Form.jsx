import "./Attendance_Form.css";
import { cbc_logo, placeholder_attendance } from "../../assets/Assets";
import { useState } from "react";

export default function Attendance_Form() {
  const [formTrue, setFormTrue] = useState(false);

  return (
    <div className="Form_Container">
      <div className="header_container">
        <img src={cbc_logo} alt="CBCH Logo" className="logo" />
        <div className="header_texts">
          <h4 className="church_name">Christian Bible Church Hagonoy</h4>
          <h1>Attendance Form</h1>
        </div>
      </div>
      {formTrue ? (
        <></>
      ) : (
        <>
          <div className="form_container">
            <img src={placeholder_attendance} alt="" className="placer_img" />
            <h2 className="placer_text">Attendance is not yet posted.</h2>
            <p className="placer_subtext">Please Comeback Again Later.</p>
          </div>
        </>
      )}
    </div>
  );
}
