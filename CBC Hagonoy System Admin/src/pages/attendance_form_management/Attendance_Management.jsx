import axios from "axios"; // Import Axios
import { useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { close_ic } from "../../assets/Images";
import "./Attendance_Management.css";

export default function Attendance_Management() {
  const [commonTitle, setCommonTitle] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [attendanceID, setAttendanceID] = useState(null); // Store the attendanceID
  const navigate = useNavigate(); // For navigation

  const finalTitle = commonTitle === "Other" ? title : commonTitle;

  const handleCreateAttendance = async () => {
    if (!finalTitle || !date) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      // Send the attendance details to the backend API
      const response = await axios.post(
        "https://capstone-project0001-2.onrender.com/attendance-deets",
        {
          title: finalTitle,
          date,
        }
      );

      // Extract the attendanceID from the response
      const { attendanceID } = response.data.data;

      // Set the attendanceID and generate the QR code with the ID
      setAttendanceID(attendanceID);
      setQrCodeData(
        `https://client-2oru.onrender.com/attendance-details/${attendanceID}`
      );

      // Show a success message upon successful storage
      alert(`Attendance Created: \nEvent: ${finalTitle}\nDate: ${date}`);
      console.log("Attendance Created Successfully:", response.data);
    } catch (error) {
      alert("Error creating attendance.");
      console.error("Error creating attendance", error);
    }
  };

  const handleGenerateQR = () => {
    if (!finalTitle || !date) {
      alert("Please fill in all the required fields.");
      return;
    }

    // If attendanceID exists, generate QR
    if (attendanceID) {
      // Generate a QR code that redirects to /user-interface page
      setQrCodeData(
        `https://client-2oru.onrender.com/user-interface?attendanceID=${attendanceID}`
      );
    } else {
      alert("Please create attendance first.");
    }
  };

  return (
    <div className="Attendance__mainContainer">
      <div className="Attendance__headerContainer">
        <p className="church_name_announcement">
          CHRISTIAN BIBLE CHURCH OF HAGONOY
        </p>
        <h2 className="page_title_announcement">Attendance Management</h2>
      </div>

      <div className="__attendance_creation_container">
        <div className="__attendance_creation_header">
          <h3 className="__attendance_creation_header_title">
            Create Attendance
          </h3>

          <div className="__attendance_creation_form">
            {/* Title */}
            <label className="__event_title_lbl">Event Title:</label>
            <select
              name="events"
              value={commonTitle}
              onChange={(e) => setCommonTitle(e.target.value)}
              className="events_list"
            >
              <option value="">Select an Event</option>
              <option value="Sunday Service">Sunday Service</option>
              <option value="Prayer Meeting">Prayer Meeting</option>
              <option value="Family Devotion">Family Devotion</option>
              <option value="Personal Devotion">Personal Devotion</option>
              <option value="Cellgroup">Cellgroup</option>
              <option value="Other">Other</option>
            </select>
            {commonTitle === "Other" && (
              <div className="__other_event">
                <label className="__event_title_lbl">Other:</label>
                <input
                  type="text"
                  className="__custom_event_inp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            )}

            {/* Date */}
            <label htmlFor="" className="__set_date_lbl">
              Date:
            </label>
            <input
              type="date"
              className="__set_date_inp"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {/* Create Attendance */}
            <button
              className="__create_attendance"
              onClick={handleCreateAttendance}
            >
              Create Attendance
            </button>

            {/* Generate QR for Attendance */}
            <button className="__generate_qr_code" onClick={handleGenerateQR}>
              Generate QR
            </button>

            {/* Modal for QR Code */}
            {qrCodeData && (
              <div className="__qr_code_display_container">
                <div className="__header_qr_modal">
                  <h2 className="__header_title">Attendance QR</h2>
                  <img
                    src={close_ic}
                    alt="close button"
                    className="close_btn"
                  />
                </div>
                <h3>Generated QR Code:</h3>
                <QRCode value={qrCodeData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
