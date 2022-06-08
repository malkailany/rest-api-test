const express = require('express')
const walletRoute = require('./wallet.route')

// const userRoute = require('./user.route');
// const docsRoute = require('./docs.route');
// const config = require('../../config/config');

const router = express.Router()

const defaultRoutes = [
  {
    path: '/wallet',
    route: walletRoute
  }
]
defaultRoutes.forEach(route => {
  router.use(route.path, route.route)
})

module.exports = router
