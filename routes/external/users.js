/**
 * @desc Defines all routes used for user management
 * @author WidesVs2
 * @version 1.0.0
 */
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Func = require("../../middleware/routeFunctions")
const User = require("../../models/external/User")
const Key = require("../../models/external/Key")
const auth = require("../../middleware/auth")
//const transporter = require("../../middleware/mailer")

const emailStr =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ //matches to valid emails
const pwdStrings = {
  weak: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/, // 7-15 chars, one digit, one special
  moderate: /^[A-Za-z]\w{7,14}$/, // 7-16 characters, only chars, digits, underscore, ^letter
  strong: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/, // 6-20 chars, one upper, one lower, one digit
  great: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/, // 8-15 chars, one digit, one special, one lower, one upper
}
const usernameStr = /^[A-Za-z]\w{7,14}$/ // 7-16 characters, only chars, digits, underscore, ^letter

/**
 * @desc When recieving a GET request for route, authentication checked, if passed then search
 *       Database for all users.
 * @route GET /api/v1/users
 * @param {function} auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns {object} users MongoDB collection of all users
 * @access Private -ADMIN ONLY-
 *
 */
router.get("/", auth, async (req, res) => {
  if (!req.admin) res.status(401).json({ message: "UNAUTHORIZED!" })
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a GET request for route, req.cookie.token verified, returns true or false
 * to client
 * @route GET /api/v1/users/loggedIn
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns {bool} bool True if token verified, otherwise false
 * @access Public
 *
 */
router.get("/loggedIn", async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) return res.status(200).json({ bool: false })

    jwt.verify(token, process.env.JWT_SECRET)
    const payload = jwt.decode(token)

    res.status(200).json({ bool: true, payload })
  } catch (err) {
    res.status(200).json({ bool: false })
  }
})

/**
 * @desc When recieving a GET request for route, responds with new cookie set to expire immediately
 * @route GET /api/v1/users/logout
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns null Returns no data, replaces loggedIn cookie
 * @access Public
 *
 */
router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send()
})

/**
 * @desc When recieving a GET request for route, authentication checked, if passed then search
 *       Database for the current user.
 * @route GET /api/v1/users/single
 * @param {function} auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns {object} user MongoDB object as json string
 * @access Private -USER-
 *
 */
router.get("/single", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user })
    if (!user) return res.status(404).json({ message: "User Not Found!" })
    res.status(200).json({ user, admin: req.admin })
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a POST request for route, req data validated, new MongoDB object created, then
 *       user logged in by setting cookie with JWT
 * @route POST /api/v1/users/register
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns {object} user MongoDB object as json string
 * @access Public
 *
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password)
      return res.status(400).json({ message: "Please Fill in All Fields!" })

    if (!usernameStr.test(username))
      return res.status(400).json({ message: "Please Enter a Valid Username!" })

    if (!emailStr.test(email))
      return res.status(400).json({ message: "Please Enter a Valid Email!" })

    if (!pwdStrings.great.test(password))
      return res.status(400).json({ message: "Please Enter a Valid Password!" })

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: "Email Already in Use!" })

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Save New user
    const newUser = { email, username, hash }
    const savedUser = await User.create(newUser)

    // Send emails
    /*const mailData = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for Signing Up!",
      text: "Thanks for creating an account on my App! I hope you find this App satisfactory. If you need any help using the App, check out the <a href='http://localhost:3000/help'>Help Page.</a> If you need further help, or are interested in web development services, feel free to emial me back! Have a great day! -WidesVs2",
    }
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err)
      }
      const secondMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.SECONDARY_EMAIL,
        subject: "New User Created!",
        html: `Someone just signed up for an account on WidesVs2 Expense Tracker. Go to the admin page to view more! Also, you're looking good, Future Mike!`,
      }
      transporter.sendMail(secondMailOptions, (err, info) => {
        if (err) console.error(err)
      })
    })*/

    // Log User In
    // // Sign JWT Token
    const token = jwt.sign({ user: savedUser._id }, process.env.JWT_SECRET)

    // // Set Http-only Cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send()
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a POST request for route, req data validated, MongoDB database checked for
 *       matching information, if true, logs user in by setting JWT cookie
 * @route POST /api/v1/users/login
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns {object} user MongoDB object as json string
 * @access Public
 *
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password)
      return res.status(400).json({ message: "Please Fill in all Fields!" })

    const existingUser = await User.findOne({ email })
    if (!existingUser)
      return res.status(401).json({ message: "Wrong Login Information!" })

    const passwordCorrect = await bcrypt.compare(password, existingUser.hash)
    if (!passwordCorrect)
      return res.status(401).json({ message: "Wrong Login Information!" })

    // Log User In
    // // Sign JWT Token
    const token = jwt.sign({ user: existingUser._id }, process.env.JWT_SECRET)

    // // Set Http-only Cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send()
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a PUT request for route, request data validated, data verified against
 *       MongoDB database, if verified password changed
 * @route PUT /api/v1/users/resetPassword
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns {object} user MongoDB object as json string
 * @access Public
 * @deprecated -NOT CURRENTLY IN USE-
 *
 */
router.put("/resetPassword", async (req, res) => {
  try {
    const { email, key, password } = req.body

    // Validate
    if (!email || !key || !password)
      res.status(400).json({ message: "Empty Fields!" })

    if (!pwdStrings.great.test(password))
      return res.status(400).json({ message: "Please Enter a Valid Password!" })

    // Check Matching Key
    const prevKey = await Key.findOne({ hash: key })
    if (!prevKey) return res.status(401).json({ message: "Unauthorized!" })

    // Update Password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const updatedUser = User.findOneAndUpdate({ email }, { hash })

    res.status(204).json({ message: "User Password updated!" })
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a DELETE request for route, authentication checked, if passed then search
 *       Database for user and delete record
 * @route DELETE /api/v1/users/delete/:id
 * @param {function} auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns {object} user MongoDB object as json string
 * @access Private -USER-
 * @deprecated -NOT IN USE-
 *
 */
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id })
    res.status(203).json({ deletedUser, message: "User Deleted!" })
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a DELETE request for route, authentication checked, if passed then search
 *       Database for user and delete record
 * @route DELETE /api/v1/users/:id
 * @param {function} auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @returns {object} user MongoDB object as json string
 * @access Private -ADMIN ONLY-
 *
 */
router.delete("/:id", auth, async (req, res) => {
  if (req.admin === false) res.status(401).json({ message: "UNAUTHORIZED!" })
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id })
    res.status(203).json({ deletedUser, message: "User Deleted!" })
  } catch (err) {
    Func.serveErr(err, res)
  }
})

module.exports = router
