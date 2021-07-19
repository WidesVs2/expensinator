/**
 * @desc This class is used to store routinely used functions from within routes
 * @author WidesVs2
 * @version 1.0.0
 *
 * @class Func
 */
class Func {
  constructor(counter) {
    this._counter = counter
  }
  /**
   * @desc Common code snippet for server side errors from within routes
   *
   * @param {*} err
   * @param {*} res
   * @memberof Func
   */
  serveErr(err, res) {
    console.log(err)
    res.status(500).json({
      msg: "Server Error",
      err,
    })
  }
  /**
   * @desc Increment counter variable
   *
   * @return {*}
   * @memberof Func
   * @deprecated NO LONGER IN USE
   */
  incrementCount() {
    this._counter++
    return this._counter
  }
  /**
   * @desc Decrement counter variable
   *
   * @return {*}
   * @memberof Func
   * @deprecated NO LONGER IN USE
   */
  decrementCount() {
    this._counter--
    return this._counter
  }
}

module.exports = Func = new Func(Math.floor(Math.random() * 10000))
