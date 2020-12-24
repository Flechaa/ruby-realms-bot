module.exports = class RubyRealmsError extends Error {
  constructor(message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = "RubyRealmsError"
  }          
}