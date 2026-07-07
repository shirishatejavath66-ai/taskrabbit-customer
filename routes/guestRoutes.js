const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

// ================= CATEGORIES =================
router.get('/categories', guestController.getCategories);

// ================= SUBCATEGORIES =================
router.get('/subcategories/:categoryId', guestController.getSubcategories);

// ================= SERVICES =================
// Get all services for a given subcategory
router.get('/services/:subcategoryId', guestController.getServices);

// Get details for a single service by ID
router.get('/service/:serviceId', guestController.getServiceById);

// Providers for a given service
router.get('/providers/:serviceId', guestController.getProvidersByService);

module.exports = router;
