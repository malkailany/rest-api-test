const express = require('express')
const walletController = require('../controllers/wallet.controller')
const router = express.Router()

router.route('/').post(walletController.createNewWallet)

router.route('/:walletId').get(walletController.getWalletById)

router
  .route('/:walletId/transactions')
  .get(walletController.getTransaction)
  .post(walletController.createTransaction)

module.exports = router
