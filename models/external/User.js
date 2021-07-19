const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  hash: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = User = mongoose.model("users", UserSchema)
