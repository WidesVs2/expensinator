/**
 * @desc Authentication function checks req cookie for JSON Web Token,
 *       then verifies correct token, if checks fail, retuns 401-Unauthorized
 * @author WidesVs2
 * @version 1.0.0
 */

const jwt = require("jsonwebtoken")
/**
 *
 *
 * @param {*} req request object from client, used to check token attached to cookie
 * @param {*} res response object sent back by server
 * @param {*} next function call advances code to next stage of process
 * @return {*} returns 401 on failed authentication checks, otherwise proceeds to next()
 */
function auth(req, res, next) {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: "Unauthorized!" })

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified.user
    req.admin = false

    if (req.user === process.env.ADMIN_ACCOUNT_ID) req.admin = true

    next()
  } catch (err) {
    console.error(err)
    res.status(401).json({ message: "Unauthorized!" })
  }
}

module.exports = auth
