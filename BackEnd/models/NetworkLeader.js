const mongoose = require("mongoose");
const { Schema } = mongoose;

const NetworkSchema = new Schema({
  networkLeader: {
    type: String,
    required: true,
  },
  networkID: {
    type: String,
    unique: true,
    required: true,
  },
  cellgroupIDList: [
    {
      type: String,
      required: true,
      default: null,
    },
  ],
});

const NetworkModel = mongoose.model(
  "NetworkSchema",
  NetworkSchema,
  "NetworkSchema"
);
module.exports = NetworkModel;
