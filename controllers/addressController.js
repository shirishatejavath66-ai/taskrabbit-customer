const addressService = require('../services/addressService');

// Add Address
exports.addAddress = async (req, res) => {

    try {

        const {
            customer_id,
            address_line,
            city,
            state,
            pincode
        } = req.body;

        // Validation
        if (!customer_id || !address_line || !city || !state || !pincode) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        const result = await addressService.addAddress(
            customer_id,
            address_line,
            city,
            state,
            pincode
        );

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            addressId: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ================= GET CUSTOMER ADDRESSES =================

exports.getCustomerAddresses = async (req, res) => {

    try {

        const { customerId } = req.params;

        const addresses = await addressService.getCustomerAddresses(customerId);

        res.status(200).json({
            success: true,
            count: addresses.length,
            data: addresses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ================= UPDATE ADDRESS =================

exports.updateAddress = async (req, res) => {

    try {

        const { addressId } = req.params;

        const {
            address_line,
            city,
            state,
            pincode
        } = req.body;

        await addressService.updateAddress(
            addressId,
            address_line,
            city,
            state,
            pincode
        );

        res.status(200).json({
            success: true,
            message: "Address updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ================= DELETE ADDRESS =================

exports.deleteAddress = async (req, res) => {

    try {

        const { addressId } = req.params;

        await addressService.deleteAddress(addressId);

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};