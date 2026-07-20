const paymentService = require('../services/paymentService');
console.log('Payment Service:', paymentService);
//Create Payment//
const createPayment = async (req, res) => {
    try {
        const {
            booking_id,
            customer_id,
            amount,
            payment_method
        } = req.body;

        const result = await paymentService.createPayment(
            booking_id,
            customer_id,
            amount,
            payment_method
        );

        res.status(201).json({
            success: true,
            paymentId: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

 //getPaymentByBooking
const getPaymentByBooking = async (req, res) => {

    try {

        const bookingId = req.params.bookingId;

        const payment =
            await paymentService.getPaymentByBooking(
                bookingId
            );

        res.status(200).json({
            success: true,
            data: payment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
//Get customer payment history.

const getCustomerPayments = async (req, res) => {

    try {

        const customerId = req.params.customerId;

        const payments =
            await paymentService.getCustomerPayments(
                customerId
            );

        res.status(200).json({
            success: true,
            data: payments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//update payment status


const updatePaymentStatus = async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        const { status } = req.body;

        const result = await paymentService.updatePaymentStatus(
            paymentId,
            status
        );

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//payment status
const getPaymentStatus = async (req, res) => {

    try {

        const paymentId = req.params.paymentId;

        const payment =
            await paymentService.getPaymentStatus(
                paymentId
            );

        res.status(200).json({
            success: true,
            data: payment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    createPayment,
    getPaymentByBooking,
    getCustomerPayments,
    getPaymentStatus,
    updatePaymentStatus
};

