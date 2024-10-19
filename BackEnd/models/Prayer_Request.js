const mongoose = require("mongoose");
const { Schema } = mongoose;

const PrayerSchema = new Schema({
  prayer: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const PrayerRequestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  prayers: [PrayerSchema], // Array of prayer objects
});

const PrayerRequestModel = mongoose.model(
  "PrayerRequest",
  PrayerRequestSchema,
  "PrayerRequest"
);

module.exports = PrayerRequestModel;
