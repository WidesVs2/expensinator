/**
 * @desc Route management for transactions
 * @author WidesVs2
 * @version 1.0.0
 */
const router = require("express").Router()

const Func = require("../../middleware/routeFunctions")
const auth = require("../../middleware/auth")
const Tran = require("../../models/internal/Transaction")

/**
 * @desc When recieving a GET request for route, authentication checked, if passed then search
 *       Database for all transaction made by current user.
 * @route GET /api/v1/transactions
 * @param {function} Auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @access Private -USER-
 *
 */
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Tran.find({ uuid: req.user })
    !transactions
      ? res.status(404).json({ message: "No Transactions Found!" })
      : res.status(200).json(transactions)
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a GET request for route, authentication checked, if passed then search
 *       Database for all transactions.
 * @route GET /api/v1/transactions/admin
 * @param {function} Auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @access Private -ADMIN ONLY-
 *
 */
router.get("/admin", auth, async (req, res) => {
  if (req.admin === false) res.status(401).json({ message: "UNAUTHORIZED!" })
  try {
    const transactions = await Tran.find()
    res.status(200).json(transactions)
  } catch (err) {
    Func.serveErr(err)
  }
})

/**
 * @desc When recieving a GET request for route, authentication checked, if passed then search
 *       Database for a specific transaction.
 * @route GET /api/v1/transactions/:id
 * @param {function} Auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @access Private -USER-
 * @deprecated -NOT IN USE-
 *
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const transaction = await Tran.find({ _id: req.params.id })
    !transaction
      ? res.status(404).json({ message: "Transaction not Found!" })
      : res.status(200).json(transaction)
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a POST request for route, authentication checked, if passed then create
 *       a new transaction record
 * @route POST /api/v1/transactions
 * @param {function} Auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @access Private -USER-
 *
 */
router.post("/", auth, async (req, res) => {
  try {
    const uuid = req.user
    const { amount, desc, is_Debit } = req.body
    if (!amount || !desc)
      res.status(400).json({ message: "Please Fill All Fields!" })
    const newTran = { amount, desc, is_Debit, uuid }
    const result = await Tran.create(newTran)
    res.status(203).json({ result, message: "Transaction Created!" })
  } catch (err) {
    Func.serveErr(err, res)
  }
})

/**
 * @desc When recieving a DELETE request for route, authentication checked, if passed then
 *       delete specific transaction based on ID
 * @route DELETE /api/v1/transactions/:id
 * @param {function} Auth function used to verify user making request allowed access to data.
 * @param {object} Request Object baked into express
 * @param {object} Response Object baked into Express
 * @access Private -USER-
 *
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Tran.findOneAndDelete({ _id: req.params.id })
    res.status(203).json({ result, message: "Transaction Deleted!" })
  } catch (err) {
    Func.serveErr(err, res)
  }
})

module.exports = router
