const express = require('express');
const router = express.Router();

const addressController = require('../controllers/addressController');

// Add Address
router.post(
    '/add',
    addressController.addAddress
);

// Get Customer Addresses
router.get(
    '/customer/:customerId',
    addressController.getCustomerAddresses
);
// Update Address
router.put(
    '/:addressId',
    addressController.updateAddress
);
// Delete Address
router.delete(
    '/:addressId',
    addressController.deleteAddress
);
module.exports = router;