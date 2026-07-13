const db = require('../../config/db');

// Get All Categories
const getCategories = async () => {

    const [rows] = await db.query(`
        SELECT *
        FROM categories
    `);

    return rows;

};
// Get Popular Services
const getPopularServices = async () => {

    const [rows] = await db.query(`
        SELECT *
        FROM services
        WHERE is_active = 1
        LIMIT 5
    `);

    return rows;

};
// Get Upcoming Bookings
const getUpcomingBookings = async (customerId) => {

    const [rows] = await db.query(
        `SELECT
            b.booking_id,
            s.service_name,
            b.booking_date,
            b.booking_time,
            b.status
        FROM bookings b
        INNER JOIN services s
        ON b.service_id = s.service_id
        WHERE b.customer_id = ?
        AND b.booking_date >= CURDATE()
        ORDER BY b.booking_date ASC`,
        [customerId]
    );

    return rows;
};
// Get Recent Bookings
const getRecentBookings = async (customerId) => {

    const [rows] = await db.query(
        `SELECT
            b.booking_id,
            s.service_name,
            b.booking_date,
            b.booking_time,
            b.status
        FROM bookings b
        INNER JOIN services s
        ON b.service_id = s.service_id
        WHERE b.customer_id = ?
        ORDER BY b.created_at DESC
        LIMIT 5`,
        [customerId]
    );

    return rows;
};
// Dashboard Summary
const getDashboardSummary = async (customerId) => {

    const [[customer]] = await db.query(
        `SELECT name
         FROM customers
         WHERE customer_id = ?`,
        [customerId]
    );

    const [[total]] = await db.query(
        `SELECT COUNT(*) AS total_bookings
         FROM bookings
         WHERE customer_id = ?`,
        [customerId]
    );

    const [[completed]] = await db.query(
        `SELECT COUNT(*) AS completed_bookings
         FROM bookings
         WHERE customer_id = ?
         AND status = 'completed'`,
        [customerId]
    );

    const [[pending]] = await db.query(
        `SELECT COUNT(*) AS pending_bookings
         FROM bookings
         WHERE customer_id = ?
         AND status = 'pending'`,
        [customerId]
    );

    return {
        customer_name: customer.name,
        total_bookings: total.total_bookings,
        completed_bookings: completed.completed_bookings,
        pending_bookings: pending.pending_bookings
    };

};
//Get Active tasks
const getActiveTasks = async (customerId) => {

    const [rows] = await db.query(
        `SELECT
            b.booking_id,
            s.service_name,
            b.booking_date,
            b.booking_time,
            b.status
        FROM bookings b
        INNER JOIN services s
        ON b.service_id = s.service_id
        WHERE b.customer_id = ?
        AND b.status IN ('accepted', 'pending')
        ORDER BY b.booking_date ASC`,
        [customerId]
    );

    return rows;
};

module.exports = {
    getCategories,
    getPopularServices,
    getUpcomingBookings,
    getRecentBookings,
    getDashboardSummary,
    getActiveTasks
};