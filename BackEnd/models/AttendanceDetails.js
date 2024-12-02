const mongoose = require("mongoose");
const { Schema } = mongoose;

const AttendanceDetails = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  attendanceID: {
    type: String,
    required: true,
    unique: true,
  },
});

const AttendanceDeets = mongoose.model(
  "Attendance_Details", // Collection name
  AttendanceDetails, // Schema object
  "Attendance_Details" // Optional explicit collection name
);

module.exports = AttendanceDeets;
