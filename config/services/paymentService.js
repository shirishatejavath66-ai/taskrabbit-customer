const db = require('../db');

const createPayment = async (
  booking_id,
  customer_id,
  amount,
  payment_method
) => {

  const sql = `
    INSERT INTO payments
    (
      booking_id,
      customer_id,
      amount,
      payment_method
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.execute(
    sql,
    [
      booking_id,
      customer_id,
      amount,
      payment_method
    ]
  );

  return result;
};

module.exports = {
  createPayment
};