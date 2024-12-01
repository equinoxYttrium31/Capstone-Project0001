const mongoose = require("mongoose");
const { Schema } = mongoose;

const ArchivedPrayerSchema = new Schema({
  prayer: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    required: true,
  },
  isRead: {
    type: Boolean,
    required: true,
  },
});

const ArchivedPrayerRequestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  prayers: [ArchivedPrayerSchema], // Array of archived prayer objects
  archiveMonth: {
    type: Number,
    required: true, // 1-12 representing the month of archiving
  },
  archiveYear: {
    type: Number,
    required: true, // Year of archiving
  },
  archivedAt: {
    type: Date,
    default: Date.now, // When the prayers were archived
  },
});

const ArchivedPrayerRequestModel = mongoose.model(
  "ArchivedPrayerRequest",
  ArchivedPrayerRequestSchema,
  "ArchivedPrayerRequest" // Explicitly specify collection name
);

module.exports = ArchivedPrayerRequestModel;
