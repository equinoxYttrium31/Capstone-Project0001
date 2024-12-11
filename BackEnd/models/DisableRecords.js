const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressDisableSchema = new mongoose.Schema({
  baseAddress: { type: String, required: true, default: null },
  barangay: { type: String, required: true, default: null },
  city: { type: String, required: true, default: null },
  province: { type: String, required: true, default: null },
});

const DisableUser = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  birthDate: Date,
  profilePic: { type: String, default: null },
  address: addressDisableSchema,
  CellNum: { type: String, default: null },
  TelNum: {
    type: String,
    default: null,
  },
  userID: { type: String, default: null, unique: true },
  CellLead: { type: String, default: null },
  NetLead: { type: String, default: null },
  gender: { type: String, default: null },
  dateDisabled: { type: String, default: null },
  reasonDisabled: { type: String, default: "Pastor Disabled this Account!" },
});

const DisableUserModel = mongoose.model(
  "DisableUser",
  DisableUser,
  "DisableUser"
);

module.exports = DisableUserModel;
