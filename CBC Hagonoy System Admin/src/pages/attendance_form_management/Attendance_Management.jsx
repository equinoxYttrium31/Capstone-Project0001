import axios from "axios"; // Import Axios
import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { close_ic } from "../../assets/Images";
import { toast } from "react-hot-toast";
import "./Attendance_Management.css";

export default function Attendance_Management() {
  const [commonTitle, setCommonTitle] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [attendanceID, setAttendanceID] = useState(null); // Store the attendanceID
  const qrCodeRef = useRef(null); // Reference for the QR Code container

  const finalTitle = commonTitle === "Other" ? title : commonTitle;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          "https://client-2oru.onrender.com/fetch-attendance"
        );
        console.log("Response Status:", response.status); // Check status
        console.log("Response Headers:", response.headers); // Inspect headers
        console.log("Response Data:", response.data); // Log the data

        if (Array.isArray(response.data)) {
          setAttendanceRecords(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setAttendanceRecords([]); // Default to empty array
        }
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setAttendanceRecords([]); // Set empty array on error
      }
    };

    fetchAttendance();
  }, []);

  const handleCreateAttendance = async () => {
    if (!finalTitle || !date) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://capstone-project0001-2.onrender.com/attendance-deets",
        {
          title: finalTitle,
          date,
        }
      );

      const { attendanceID } = response.data.data;
      setAttendanceID(attendanceID);

      toast.success(
        `Attendance Created: \nEvent: ${finalTitle}\nDate: ${date}`
      );
      console.log("Attendance Created Successfully:", response.data);
    } catch (error) {
      toast.error("Error creating attendance.");
      console.error("Error creating attendance", error);
    }
  };

  const handleGenerateQR = () => {
    if (!finalTitle || !date) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    if (attendanceID) {
      setQrCodeData(
        `https://client-2oru.onrender.com/user-interface?attendanceID=${attendanceID}`
      );
    } else {
      toast.error("Please create attendance first.");
    }
  };

  const handleExportQRCode = async () => {
    if (!qrCodeRef.current) return;

    // Get the SVG element from the QRCode component
    const svgElement = qrCodeRef.current.querySelector("svg");
    if (!svgElement) return;

    // Convert SVG to Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Set canvas size to match the SVG dimensions
      const canvasWidth = img.width;
      const canvasHeight = img.height + 40; // Extra space for the date
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill the canvas with a white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw the QR code on top of the white background
      ctx.drawImage(img, 0, 0);

      // Add the date below the QR code
      const exportDate = new Date().toLocaleDateString();
      ctx.font = "16px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(exportDate, canvasWidth / 2, canvasHeight - 10);

      // Create an image URL and trigger download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `AttendanceQR_${exportDate.replace(/\//g, "-")}.png`;
      link.click();

      URL.revokeObjectURL(url); // Cleanup the object URL
    };

    img.src = url;
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

            <label htmlFor="" className="__set_date_lbl">
              Date:
            </label>
            <input
              type="date"
              className="__set_date_inp"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              className="__create_attendance"
              onClick={handleCreateAttendance}
            >
              Create Attendance
            </button>

            <button className="__generate_qr_code" onClick={handleGenerateQR}>
              Generate QR
            </button>
          </div>
        </div>
      </div>

      <div className="attendance_submitted_container">
        <div className="header_container">
          <h3 className="header_title">Attendance Submitted</h3>
          <table className="attendance_submitted_list">
            <thead className="submitted_header">
              <th>Name</th>
              <th>Date</th>
              <th>Event</th>
              <th>Picture</th>
              <th>Status</th>
            </thead>
            <tbody className="submitted_body">
              {attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.name}</td>
                  <td>{record.date}</td>
                  <td>{record.event}</td>
                  <td>
                    <img src={record.picture} alt="User" />
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {qrCodeData && (
        <div className="__qr_code_display_container">
          <div className="__qr_holder_container">
            <div className="__header_qr_modal">
              <h2 className="__header_title">Attendance QR</h2>
              <img
                src={close_ic}
                alt="close button"
                className="close_btn"
                onClick={() => setQrCodeData("")}
              />
            </div>
            <div className="__qr_code_content">
              <h3>Generated QR Code:</h3>
              <div ref={qrCodeRef}>
                <QRCode value={qrCodeData} />
              </div>
              <button className="__export_qr_code" onClick={handleExportQRCode}>
                Export QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
