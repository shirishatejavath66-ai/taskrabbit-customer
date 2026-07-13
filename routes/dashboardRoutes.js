const express = require('express');
const router = express.Router();

const dashboardController =
require('../controllers/dashboardController');

// Get Categories
router.get(
    '/categories',
    dashboardController.getCategories
);
// Get Popular Services
router.get(
    '/popular-services',
    dashboardController.getPopularServices
);
//Get upcoming bookings
router.get(
    '/upcoming-bookings/:customerId',
    dashboardController.getUpcomingBookings
);
//Get Recent bookings
router.get(
    '/recent-bookings/:customerId',
    dashboardController.getRecentBookings
);
//Get Dashboard Summery
router.get(
    '/summary/:customerId',
    dashboardController.getDashboardSummary
);
//Get Active bookings
router.get(
    '/active-tasks/:customerId',
    dashboardController.getActiveTasks
);
module.exports = router;