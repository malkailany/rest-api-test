const ApiError = require('../helpers/apiError')
const CacheService = require('../services/cache.service')
const cache = new CacheService(60 * 60 * 1) // Create a new cache service instance for 1 hour
const { uuidv4 } = require('uuid')

const retrieveWallet = walletId => {
  const wallet = cache.get(`wallet-id-${walletId}`) //fetch wallet from cache
  if (!wallet) throw new ApiError(404, `Wallet '${walletId}' does not exist`) //send error api
  return wallet
}

const getWalletById = async (req, res, next) => {
  const { walletId } = req.params
  try {
    const wallet = retrieveWallet(walletId)
    res.status(200).json(wallet)
  } catch (error) {
    next(error)
  }
}

const createNewWallet = async (req, res, next) => {
  const { balance, name } = req.body
  const walletId = 'laborum voluptate laboris Lorem'
  try {
    if (!balance && !name)
      //if name and balance does not exist, reply with an error about information
      throw new ApiError(
        400,
        'Wallet cannot be created, your missing information'
      )
    if (balance < 10)
      //if balance is less than 10
      throw new ApiError(400, 'Balance must be greater than 9.99')
    if (typeof balance != 'number') {
      //if balance is not a number
      throw new ApiError(400, 'Balance must be a number')
    }
    if (name.length < 3 || name.length > 16)
      // if wallet name is not inbetween the character limit
      throw new ApiError(
        400,
        'Wallet name must be inbetween 3 and 16 characters '
      )
    //check if name already exists..?

    const wallet = {
      id: walletId,
      balance,
      name,
      createdDate: new Date()
    }
    cache.get(`wallet-id-${wallet.id}`, { wallet: wallet, transactions: [] })
    res.status(201).json(wallet)
  } catch (error) {
    next(error)
  }
}

const getTransaction = async (req, res, next) => {
  const { walletId } = req.params
  try {
    const wallet = retrieveWallet(walletId)
    res.json(wallet.transactions)
  } catch (error) {
    next(error)
  }
}

const createTransaction = async (req, res, next) => {
  const { walletId } = req.params
  const { amount, description } = req.body
  const createdDate = new Date()
  try {
    const { wallet, transactions } = retrieveWallet(walletId)
    const newBalance = wallet.balance + amount
    if (!amount && !description)
      throw new ApiError(
        400,
        'Transaction must require both amount and description'
      )
    if (typeof amount != 'number') {
      //if balance is not a number
      throw new ApiError(400, 'Amount must be a number')
    }
    if (amount == 0)
      throw new ApiError(
        400,
        'Amount must be greater than 0 to deposit or less than 0 to withdraw '
      )
    if (newBalance < 0)
      throw new ApiError(400, 'Cannot withdraw more than balance')

    cache.get(
      `wallet-id-${walletId}`,
      {
        wallet: { ...wallet, balance: newBalance },
        transactions: [
          ...transactions,
          {
            id: uuidv4(),
            walletId,
            amount,
            balance: newBalance,
            createdDate,
            description
          }
        ]
      },
      true
    )
    res.json({
      id: uuidv4(),
      walletId,
      amount,
      balance: newBalance,
      createdDate,
      description
    })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  getWalletById,
  createNewWallet,
  getTransaction,
  createTransaction
}
