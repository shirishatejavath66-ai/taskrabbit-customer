const express = require('express');
console.log('Booking Routes Loaded');
const router = express.Router();

const bookingController =
require('../controllers/bookingController');

// Create Booking
router.post(
  '/create',
  bookingController.createBooking
);

// Get Customer Bookings
router.get(
  '/customer/:customerId',
  bookingController.getCustomerBookings
);

// Provider Id
router.get(
  '/provider/:providerId',
  bookingController.getProviderBookings
);

//bookingId/accept
router.put(
  '/:bookingId/accept',
  bookingController.acceptBooking
);
//bookingId/reject
router.put(
  '/:bookingId/reject',
  bookingController.rejectBooking
);
//bookingId/Complete
router.put(
  '/:bookingId/complete',
  bookingController.completeBooking
);
// Get Booking By Id
router.get(
  '/:bookingId',
  bookingController.getBookingById
);
// Cancel Booking
router.put(
  '/:bookingId/cancel',
  bookingController.cancelBooking
);

// Reschedule Booking
router.put(
  '/:bookingId/reschedule',
  bookingController.rescheduleBooking
);
//Customer Booking History
router.get(
  '/customer/:customerId/history',
  bookingController.getCustomerBookingHistory
);
//Upcoming bookings
router.get(
  '/customer/:customerId/upcoming',
  bookingController.getUpcomingBookings
);
//Booking Status
router.get(
  '/:bookingId/status',
  bookingController.getBookingStatus                                                                      
);
module.exports = router;