const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  password: String,
  statut: String,
  location: String,
  birth: String,
  token: String,
  salt: String,
  hash: String,
});

module.exports = User;
