const mongoose = require("mongoose")

const TranSchema = mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },
  desc: {
    type: String,
    default: "Misc.",
  },
  is_Debit: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  uuid: {
    type: String,
    required: true,
  },
})

module.exports = Tran = mongoose.model("transactions", TranSchema)
