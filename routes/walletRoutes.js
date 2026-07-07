const express = require('express');
const router = express.Router();

const walletController = require('../controllers/walletController');

// Create Wallet
router.post('/create', walletController.createWallet);

//Transaction History
router.get(
    '/transactions/:customerId',
    walletController.getTransactionHistory
);

// Get Wallet Balance
router.get('/:customerId', walletController.getWallet);

//Add Money
router.post('/add-money', walletController.addMoney);

// Deduct Money
router.post(
  '/deduct-money',
  walletController.deductMoney
);


module.exports = router;