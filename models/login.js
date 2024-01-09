const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  photo: {
    type: String,
    required: false,
  },
  googleID: {
    type: String,
    required: false,
  },
});

const Login = mongoose.model("login", loginSchema);

module.exports = Login;
