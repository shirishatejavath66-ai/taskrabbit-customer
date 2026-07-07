const express = require('express');
const router = express.Router();

const reviewController =
require('../controllers/reviewController');
//Create Review
router.post(
  '/create',
  reviewController.createReview
);
//Get provider reviews
router.get(
    '/provider/:providerId',
    reviewController.getProviderReviews
);
//Get Avg rating
router.get(
    '/provider/:providerId/rating',
    reviewController.getAverageRating
);

module.exports = router;