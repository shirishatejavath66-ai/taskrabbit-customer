const reviewService =
require('../services/reviewService');

const createReview = async (req, res) => {

  try {

    const {
      booking_id,
      customer_id,
      provider_id,
      rating,
      review
    } = req.body;

    const result =
      await reviewService.createReview(
        booking_id,
        customer_id,
        provider_id,
        rating,
        review
      );

    res.status(201).json({
      success: true,
      reviewId: result.insertId
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//get reviews by provider.

const getProviderReviews = async (req, res) => {

    try {

        const providerId =
            req.params.providerId;

        const reviews =
            await reviewService.getProviderReviews(
                providerId
            );

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
//Get Avg rating
const getAverageRating = async (req, res) => {

    try {

        const providerId =
            req.params.providerId;

        const rating =
            await reviewService.getAverageRating(
                providerId
            );

        res.status(200).json({
            success: true,
            data: rating
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createReview,
    getProviderReviews,
    getAverageRating
};