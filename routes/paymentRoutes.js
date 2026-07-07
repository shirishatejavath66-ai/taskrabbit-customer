const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');

router.post(
    '/create',
    paymentController.createPayment
);

router.get(
    '/booking/:bookingId',
    paymentController.getPaymentByBooking
);

router.get(
    '/customer/:customerId',
    paymentController.getCustomerPayments
);

router.get(
    '/:paymentId/status',
    paymentController.getPaymentStatus
);

router.put(
    '/:paymentId/status',
    paymentController.updatePaymentStatus
);

module.exports = router;