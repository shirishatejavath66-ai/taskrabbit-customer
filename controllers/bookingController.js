const db = require('../config/db');

// ================= CREATE BOOKING =================

exports.createBooking = async (req, res) => {

  try {

    const {
      customerId,
      providerId,
      serviceId,
      bookingDate,
      bookingTime,
      address
    } = req.body;

    await db.query(
      `INSERT INTO bookings
      (
        customer_id,
        provider_id,
        service_id,
        booking_date,
        booking_time,
        address
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        providerId,
        serviceId,
        bookingDate,
        bookingTime,
        address
      ]
    );

    res.json({
      success: true,
      message: 'Booking created successfully'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= GET CUSTOMER BOOKINGS =================

exports.getCustomerBookings = async (req, res) => {

  try {

    const { customerId } = req.params;

    const [rows] = await db.query(
      `SELECT *
       FROM bookings
       WHERE customer_id = ?`,
      [customerId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= GET PROVIDER BOOKINGS =================

exports.getProviderBookings = async (req, res) => {

  try {

    const { providerId } = req.params;

    const [rows] = await db.query(
      `SELECT *
       FROM bookings
       WHERE provider_id = ?`,
      [providerId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= ACCEPT BOOKING =================

exports.acceptBooking = async (req, res) => {

  try {

    const { bookingId } = req.params;

    await db.query(
      `UPDATE bookings
       SET status = 'accepted'
       WHERE booking_id = ?`,
      [bookingId]
    );

    res.json({
      success: true,
      message: 'Booking accepted successfully'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= REJECT BOOKING =================
exports.rejectBooking = async (req, res) => {

  try {

    const { bookingId } = req.params;

    await db.query(
      `UPDATE bookings
       SET status = 'rejected'
       WHERE booking_id = ?`,
      [bookingId]
    );

    res.json({
      success: true,
      message: 'Booking rejected successfully'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= COMPLETE BOOKING =================

exports.completeBooking = async (req, res) => {

  try {

    const { bookingId } = req.params;

    await db.query(
      `UPDATE bookings
       SET status = 'completed'
       WHERE booking_id = ?`,
      [bookingId]
    );

    res.json({
      success: true,
      message: 'Booking completed successfully'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= GET BOOKING BY ID =================

exports.getBookingById = async (req, res) => {

  try {

    const { bookingId } = req.params;

    const [rows] = await db.query(
      `SELECT *
       FROM bookings
       WHERE booking_id = ?`,
      [bookingId]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });

    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
}
};

// ================= CANCEL BOOKING =================
exports.cancelBooking = async (req, res) => {

  try {

    const { bookingId } = req.params;

    await db.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE booking_id = ?`,
      [bookingId]
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ================= RESCHEDULE BOOKING =================

exports.rescheduleBooking = async (req, res) => {

  try {

    const { bookingId } = req.params;

    const {
      bookingDate,
      bookingTime
    } = req.body;

    await db.query(
      `UPDATE bookings
       SET booking_date = ?,
           booking_time = ?
       WHERE booking_id = ?`,
      [
        bookingDate,
        bookingTime,
        bookingId
      ]
    );

    res.json({
      success: true,
      message: 'Booking rescheduled successfully'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

//Booking History//
exports.getCustomerBookingHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    const [bookings] = await db.query(
      `SELECT *
       FROM bookings
       WHERE customer_id = ?
       AND status = 'completed'
       ORDER BY booking_date DESC`,
      [customerId]
    );

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

//Upcoming Bookings
exports.getUpcomingBookings = async (req, res) => {
  try {
    const { customerId } = req.params;

    const [bookings] = await db.query(
      `SELECT *
       FROM bookings
       WHERE customer_id = ?
       AND status IN ('pending','accepted')
       ORDER BY booking_date ASC`,
      [customerId]
    );

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
//Booking Status
exports.getBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const [booking] = await db.query(
      `SELECT booking_id, status
       FROM bookings
       WHERE booking_id = ?`,
      [bookingId]
    );

    if (booking.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      booking: booking[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};