const mongoose = require("mongoose")

const ContactSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "555-555-555",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Contact = mongoose.model("contacts", ContactSchema)
