const db = require('../config/db');

// CREATE WALLET
exports.createWallet = async (req, res) => {

    try {

        const { customerId } = req.body;

        const [existingWallet] = await db.query(
            'SELECT * FROM wallets WHERE customer_id = ?',
            [customerId]
        );

        if (existingWallet.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Wallet already exists'
            });
        }

        const [result] = await db.query(
            'INSERT INTO wallets (customer_id, balance) VALUES (?, ?)',
            [customerId, 0]
        );

        res.status(201).json({
            success: true,
            message: 'Wallet created successfully',
            walletId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }

};


// GET WALLET
exports.getWallet = async (req, res) => {

    try {

        const { customerId } = req.params;

        const [wallet] = await db.query(
            'SELECT * FROM wallets WHERE customer_id = ?',
            [customerId]
        );

        if (wallet.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        res.status(200).json({
            success: true,
            data: wallet[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }

};
// ADD MONEY
exports.addMoney = async (req, res) => {

    try {

        const { customerId, amount } = req.body;

        const [wallet] = await db.query(
            'SELECT * FROM wallets WHERE customer_id = ?',
            [customerId]
        );

        if (wallet.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        const walletId = wallet[0].wallet_id;

        await db.query(
            'UPDATE wallets SET balance = balance + ? WHERE customer_id = ?',
            [amount, customerId]
        );

        await db.query(
            `INSERT INTO wallet_transactions
             (wallet_id, amount, transaction_type, description)
             VALUES (?, ?, ?, ?)`,
            [
                walletId,
                amount,
                'CREDIT',
                'Money Added'
            ]
        );

        res.status(200).json({
            success: true,
            message: 'Money added successfully'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }

};
// TRANSACTION HISTORY
exports.getTransactionHistory = async (req, res) => {

    try {

        const { customerId } = req.params;

        const [wallet] = await db.query(
            'SELECT wallet_id FROM wallets WHERE customer_id = ?',
            [customerId]
        );

        if (wallet.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        const walletId = wallet[0].wallet_id;

        const [transactions] = await db.query(
            `SELECT *
             FROM wallet_transactions
             WHERE wallet_id = ?
             ORDER BY created_at DESC`,
            [walletId]
        );

        res.status(200).json({
            success: true,
            data: transactions
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }

};

exports.deductMoney = async (req, res) => {

  try {

    const { customerId, amount } = req.body;

    // Get Wallet
    const [walletRows] = await db.query(
      'SELECT * FROM wallets WHERE customer_id = ?',
      [customerId]
    );

    if (walletRows.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });

    }

    const wallet = walletRows[0];

    // Check Balance
    if (wallet.balance < amount) {

      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });

    }

    const newBalance =
      wallet.balance - amount;

    // Update Wallet Balance
    await db.query(
      'UPDATE wallets SET balance = ? WHERE customer_id = ?',
      [newBalance, customerId]
    );

    // Add Transaction
    await db.query(
      `INSERT INTO wallet_transactions
      (wallet_id, amount, transaction_type)
      VALUES (?, ?, ?)`,
      [
        wallet.wallet_id,
        amount,
        'debit'
      ]
    );

    res.json({
      success: true,
      message: 'Money deducted successfully',
      balance: newBalance
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};