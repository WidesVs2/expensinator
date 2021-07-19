/**
 * @desc Management of Keys for password reset, not currently in use
 * @author WidesVs2
 * @version 0.9.0
 * @deprecated -NOT CURRENTLY IN USE-
 */
const router = require("express").Router()
const bcrypt = require("bcryptjs")

const Func = require("../../middleware/routeFunctions")
const Key = require("../../models/external/Key")
const User = require("../../models/external/User")
const transporter = require("../../middleware/mailer")

router.post("/", async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.status(400).json({ message: "User Not Found!" })

    const keyStr = user._id
    const uuid = keyStr
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(keyStr, salt)

    const newKey = { hash, uuid }
    const savedKey = await Key.create(newKey)

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "ATTN: Password Reset Request",
      html: `At ${Date.now().toLocaleString()}, a request was made to reset your password. If this was you, please follow the link below to reset your password.<br><a href='http://localhost:3000/resetPassword/${hash}'>Click Here</a><br>If this request was not you, please reply to this email and we will help you further secure your account.`,
    }

    const mailInfo = await transporter.sendMail(mailOptions)
    console.log(mailInfo)

    res.status(203).json({ message: "Check Email for Further Instructions!" })
  } catch (err) {
    Func.serveErr(err, res)
  }
})

module.exports = router
