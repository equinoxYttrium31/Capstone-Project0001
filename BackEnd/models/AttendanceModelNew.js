const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Attendance Schema
const AttendanceSchema = new Schema({
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
});

// Pre-save middleware to calculate and group by week
AttendanceSchema.pre("save", async function (next) {
  if (this.isModified("attendanceRecords")) {
    this.attendanceRecords = this.attendanceRecords.map((recordGroup) => {
      recordGroup.records.forEach((record) => {
        const date = new Date(record.date);
        const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
        record.dayOfWeek = dayOfWeek;
      });
      return recordGroup;
    });
  }
  next();
});

const Attendance = mongoose.model(
  "Attendance", // Collection name
  AttendanceSchema, // Schema object
  "Attendance" // Optional explicit collection name
);

module.exports = Attendance;
