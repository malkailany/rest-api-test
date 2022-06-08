const ApiError = require('../helpers/ApiError')

//temp

const config = { env: 'production' }
const errorConverter = (err, req, res, next) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500
    const message = error.message || 'An Internal Error has occured'
    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err
  //   if (config.env === 'production' && !err.isOperational) {
  //     statusCode = 500
  //     message = 'Internal Server error!'
  //   }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  }

  if (config.env === 'development') {
    // logger.error(err)
  }
  res.status(statusCode).send(response)
}

module.exports = {
  errorConverter,
  errorHandler
}
