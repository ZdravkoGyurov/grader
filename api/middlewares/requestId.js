const uuid = require('uuid')

const requestId = (req, res, next) => {
  req.id = uuid.v4()
  next()
}

module.exports = requestId;