/**
 * @deprecated Currently bugged, removing from app for funtionality
 * @todo Fix mailer service, set up smtp server??
 */
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
})

module.exports = transporter
