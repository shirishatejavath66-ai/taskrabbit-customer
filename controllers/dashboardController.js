const dashboardService =
require('../config/services/dashboardService');

// Get Categories
exports.getCategories = async (req, res) => {

    try {

        const categories =
        await dashboardService.getCategories();

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// Get Popular Services
exports.getPopularServices = async (req, res) => {

    try {

        const services =
        await dashboardService.getPopularServices();

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// Get Upcoming Bookings
exports.getUpcomingBookings = async (req, res) => {

    try {

        const { customerId } = req.params;

        const bookings =
        await dashboardService.getUpcomingBookings(customerId);

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Recent Bookings
exports.getRecentBookings = async (req, res) => {

    try {

        const { customerId } = req.params;

        const bookings =
        await dashboardService.getRecentBookings(customerId);

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// Dashboard Summary
exports.getDashboardSummary = async (req, res) => {

    try {

        const { customerId } = req.params;

        const summary =
        await dashboardService.getDashboardSummary(customerId);

        res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// Get Active Tasks
exports.getActiveTasks = async (req, res) => {

    try {

        const { customerId } = req.params;

        const tasks = await dashboardService.getActiveTasks(customerId);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};