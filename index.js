const express = require('express')
const routes = require('./src/api/v1/routes')
const ApiError = require('./src/api/v1/helpers/apiError') 
const { errorConverter, errorHandler } = require('./src/api/v1/middlewares/error');

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use('/v1', routes)
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'))
})
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is online on port ${PORT}`)
})
