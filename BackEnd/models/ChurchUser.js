const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new mongoose.Schema({
  baseAddress: { type: String, required: true, default: null },
  barangay: { type: String, required: true, default: null },
  city: { type: String, required: true, default: null },
  province: { type: String, required: true, default: null },
});

const ChurchUser = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    birthDate: Date,
    profilePic: { type: String, default: null },
    address: addressSchema,
    CellNum: { type: String, default: null },
    TelNum: {
      type: String,
      default: null,
    },
    CellLead: { type: String, default: null },
    NetLead: { type: String, default: null },
    gender: { type: String, default: null },
    memberType: { type: String, default: "Member" },
    isBaptized: { type: String, default: null },
  },
  { timestamps: true }
);

const ChurchUserModel = mongoose.model("ChurchUser", ChurchUser, "ChurchUser");

module.exports = ChurchUserModel;
