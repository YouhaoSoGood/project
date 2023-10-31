const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    minLength: 10,
  },
  unit: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  state: {
    type: Number,
    required: true,
  },
});

const Repair = mongoose.model("repair", repairSchema);

module.exports = Repair;
