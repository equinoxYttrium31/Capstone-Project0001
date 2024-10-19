const mongoose = require("mongoose");
const { Schema } = mongoose;

const PrayerRequestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  prayer: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

const PrayerRequestModel = mongoose.model(
  "PrayerRequest",
  PrayerRequestSchema,
  "PrayerRequest"
);

module.exports = PrayerRequestModel;
