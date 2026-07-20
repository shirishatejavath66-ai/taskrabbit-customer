const db = require('../config/db');

// Add Address
const addAddress = async (
    customer_id,
    address_line,
    city,
    state,
    pincode
) => {

    const [result] = await db.query(

        `INSERT INTO addresses
        (
            customer_id,
            address_line,
            city,
            state,
            pincode
        )
        VALUES (?, ?, ?, ?, ?)`,

        [
            customer_id,
            address_line,
            city,
            state,
            pincode
        ]

    );

    return result;

};
// Get customer address

const getCustomerAddresses = async (customerId) => {

    const [rows] = await db.query(
        `SELECT *
         FROM addresses
         WHERE customer_id = ?`,
        [customerId]
    );

    return rows;
};
// ================= UPDATE ADDRESS =================

const updateAddress = async (
    addressId,
    address_line,
    city,
    state,
    pincode
) => {

    const [result] = await db.query(

        `UPDATE addresses
         SET address_line = ?,
             city = ?,
             state = ?,
             pincode = ?
         WHERE address_id = ?`,

        [
            address_line,
            city,
            state,
            pincode,
            addressId
        ]

    );

    return result;

};
// ================= DELETE ADDRESS =================

const deleteAddress = async (addressId) => {

    const [result] = await db.query(

        `DELETE FROM addresses
         WHERE address_id = ?`,

        [addressId]

    );

    return result;

};

module.exports = {
    addAddress,
    getCustomerAddresses,
    updateAddress,
    deleteAddress
};