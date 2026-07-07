const db = require('../config/db');

const createReview = async (
  booking_id,
  customer_id,
  provider_id,
  rating,
  review
) => {

  const sql = `
    INSERT INTO reviews
    (
      booking_id,
      customer_id,
      provider_id,
      rating,
      review
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(
    sql,
    [
      booking_id,
      customer_id,
      provider_id,
      rating,
      review
    ]
  );

  return result;
};

//Get Reviews by provider.
const getProviderReviews = async (
    providerId
) => {

    const sql = `
        SELECT *
        FROM reviews
        WHERE provider_id = ?
        ORDER BY created_at DESC
    `;

    const [rows] = await db.execute(
        sql,
        [providerId]
    );

    return rows;
};
//Get Avg rating
const getAverageRating = async (
    providerId
) => {

    const sql = `
        SELECT AVG(rating)
        AS averageRating
        FROM reviews
        WHERE provider_id = ?
    `;

    const [rows] = await db.execute(
        sql,
        [providerId]
    );

    return rows[0];
};

module.exports = {
    createReview,
    getProviderReviews,
    getAverageRating
};