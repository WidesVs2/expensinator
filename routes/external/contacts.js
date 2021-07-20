/**
 * @desc Defines all routes used for contact management
 * @author WidesVs2
 * @version 1.0.0
 */
const express = require("express")
const router = express.Router()

const Func = require("../../middleware/routeFunctions")
const Contact = require("../../models/external/Contact")
const auth = require("../../middleware/auth")
// const transporter = require("../../middleware/mailer")

/**
 * @desc When recieving a GET request for route, authentication checked, if passed then search
 *       Database for all contacts.
 * @route GET /api/v1/contacts
 * @param function Auth function used to verify user making request allowed access to data.
 * @param object Request Object baked into express
 * @param object Response Object baked into Express
 * @access Private -ADMIN ONLY-
 *
 */
router.get("/", auth, async (req, res) => {
  if (req.admin === false) res.status(401).json({ message: "UNAUTHORIZED!" })
  try {
    const contacts = await Contact.find()
    res.status(200).json(contacts)
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a POST request for route, creates a new contact object in MongoDB
 *       then sends two emails, one to user, one to admin
 * @route POST /api/v1/contacts
 * @param object Request Object baked into express
 * @param object Response Object baked into Express
 * @access Public
 *
 */
router.post("/", async (req, res) => {
  const { name, message, email, phone } = req.body
  if (!name || !message || !email || !phone) {
    return res.status(400).json({ message: "Empty Fields!" })
  }
  /*const mailData = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thanks for contacting me!",
    text: "Thank you for reaching out to me! I'll be looking over your message and will get back to you soon!",
  }
  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      Func.serveErr(err, res)
    }
    const secondMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SECONDARY_EMAIL,
      subject: "New Contact Created!",
      html: `You've recieved a new contact <br> from: ${name} <br> email: ${email} <br> phone: ${phone} <br> message: ${message} <br> Email sent to customer: <br> ${JSON.stringify(
        info
      )} <br /> Please reach out to them soon!`,
    }
    transporter.sendMail(secondMailOptions, (err, info) => {
      if (err) Func.serveErr(err, res)
    })
  })*/
  const newContact = {
    name,
    message,
    email,
    phone,
  }
  try {
    await Contact.create(newContact, (err, result) => {
      !err
        ? res.status(203).json({ message: "Contact Created!" })
        : Func.serveErr(err, res)
    })
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a DELETE request for route, checks for Contact object matching
 *       req.params.id, then deletes that Contact Object
 * @route DELETE /api/v1/contacts/:id
 * @param function Auth function used to verify user making request allowed access to data.
 * @param object Request Object baked into express
 * @param object Response Object baked into Express
 * @access Private -ADMIN ONLY-
 *
 */
router.delete("/:id", auth, async (req, res) => {
  if (req.admin === false) res.status(401).json({ message: "UNAUTHORIZED!" })
  try {
    const result = await Contact.findOneAndDelete({ _id: req.params.id })
    res.status(203).json({ result, message: "Contact Deleted!" })
  } catch (err) {
    Func.serveErr(err)
  }
})

module.exports = router
