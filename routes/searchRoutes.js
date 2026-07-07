const express = require('express');
const router = express.Router();

const searchController =
require('../controllers/searchController');

// Search Services
router.get(
    '/services',
    searchController.searchServices
);
// Filter By Category

router.get(

'/category/:categoryId',

searchController.filterByCategory

);
//Filter by Subcategory
router.get(

'/subcategory/:subcategoryId',

searchController.filterBySubcategory

);
//Filter by price
router.get(

'/price',

searchController.filterByPrice

);
//Get Active Services.
router.get(

'/active',

searchController.getActiveServices

);
module.exports = router;