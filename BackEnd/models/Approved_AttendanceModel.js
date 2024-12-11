const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Attendance Schema
const ApprovedAttendanceSchema = new Schema({
  user: {
    userID: { type: String, required: true }, // String-based userID
    name: { type: String, required: true },
  },
  attendanceRecords: [
    {
      weekStart: { type: Date, required: true }, // The starting Sunday of the week
      records: [
        {
          date: { type: Date, required: true },
          dayOfWeek: { type: String, required: true },
          event: { type: String, required: true },
          image: { type: String, required: true }, // Store image URLs or base64 data
        },
      ],
    },
  ],
  month: { type: String, required: true },
  year: { type: String, required: true },
});

ApprovedAttendanceSchema.pre("save", async function (next) {
  if (this.isModified("attendanceRecords")) {
    this.attendanceRecords.forEach((recordGroup) => {
      recordGroup.records.forEach((record) => {
        const date = new Date(record.date);
        const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
        // Only update if dayOfWeek is not already set (to prevent unnecessary writes)
        if (!record.dayOfWeek) {
          record.dayOfWeek = dayOfWeek;
        }
      });
    });
  }
  next();
});

const ApprovedAttendance = mongoose.model(
  "ApprovedAttendance", // Collection name
  ApprovedAttendanceSchema, // Schema object
  "ApprovedAttendance" // Optional explicit collection name
);

module.exports = ApprovedAttendance;
