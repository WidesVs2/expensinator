if (process.env.NODE_ENV !== "production") require("dotenv").config()

// Bring in initial dependecies
const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const winston = require("./middleware/logger")
const cors = require("cors")

// Include routes
const KeyRoute = require("./routes/external/keys")
const UserRoute = require("./routes/external/users")
const ContactRoute = require("./routes/external/contacts")
const TranRoute = require("./routes/internal/transactions")

// initialize App
const app = express()

// Connect to Database
mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@api.kyyem.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
// //Create DB Connection, log errors if present
mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    !err ? console.log("MongoDB Connected...") : console.log(err)
  }
)

// Initialize logging system
app.use(logger("combined", { stream: winston.stream }))

// Use required parsers
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
)
app.use(express.static(path.join(__dirname, "public")))

// Declare routes
app.use("/api/v1/keys", KeyRoute)
app.use("/api/v1/users", UserRoute)
app.use("/api/v1/contacts", ContactRoute)
app.use("/api/v1/transactions", TranRoute)

// Handle Production
if (process.env.NODE_ENV === "production") {
  // handle SPA
  app.get(/.*/, (req, res) =>
    res.sendFile(path.join(__dirname, "/public/index.html"))
  )
}

// Export App to /bin
module.exports = app
