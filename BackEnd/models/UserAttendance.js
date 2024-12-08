// UserAttendance Model
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Sub-schema for weekly attendance
const WeekAttendanceSchema = new Schema(
  {
    weekNumber: { type: Number, required: true },
    cellGroup: { type: Boolean, default: false },
    personalDevotion: { type: Boolean, default: false },
    familyDevotion: { type: Boolean, default: false },
    prayerMeeting: { type: Boolean, default: false },
    worshipService: { type: Boolean, default: false },
  },
  { _id: false }
);

// Main schema for tracking monthly attendance
const UserAttendanceSchema = new Schema(
  {
    userID: { type: String, required: true },
    month: {
      type: String, // e.g., "September"
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    weeklyAttendance: [WeekAttendanceSchema], // Array of weekly attendance
  },
  { timestamps: true }
);

// Method to update weekly attendance for a user
UserAttendanceSchema.methods.updateWeeklyAttendance = async function (
  weekNumber,
  attendanceData
) {
  const weekIndex = this.weeklyAttendance.findIndex(
    (week) => week.weekNumber === weekNumber
  );

  if (weekIndex !== -1) {
    // Update existing week
    this.weeklyAttendance[weekIndex] = { weekNumber, ...attendanceData };
  } else {
    // Add new week attendance if it doesn't exist
    this.weeklyAttendance.push({ weekNumber, ...attendanceData });
  }

  await this.save();
};

// Method to get the attendance for a specific week
UserAttendanceSchema.methods.getWeeklyAttendance = function (weekNumber) {
  return (
    this.weeklyAttendance.find((week) => week.weekNumber === weekNumber) || null
  );
};

// Method to get attendance summary for the month
UserAttendanceSchema.methods.getMonthlySummary = function () {
  const summary = {
    cellGroup: 0,
    personalDevotion: 0,
    familyDevotion: 0,
    prayerMeeting: 0,
    worshipService: 0,
  };

  this.weeklyAttendance.forEach((week) => {
    Object.keys(summary).forEach((activity) => {
      if (week[activity]) {
        summary[activity] += 1;
      }
    });
  });

  return summary;
};

const UserAttendanceModel = mongoose.model(
  "UserAttendance",
  UserAttendanceSchema,
  "UserAttendance"
); // Fixed the typo

module.exports = UserAttendanceModel;
