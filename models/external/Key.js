const mongoose = require("mongoose")

const KeySchema = mongoose.Schema({
  hash: {
    type: String,
    default: "",
  },
  uuid: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Key = mongoose.model("keys", KeySchema)
