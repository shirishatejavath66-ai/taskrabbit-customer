const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {

    try {

        // ================= GET TOKEN =================

// First, try to read the token from the cookie.
// If it's not there, fall back to the Authorization header.

const authHeader = req.headers.authorization;

const token =
    req.cookies.accessToken ||
    (authHeader && authHeader.split(" ")[1]);


// ================= CHECK TOKEN =================

if (!token) {

    return res.status(401).json({
        success: false,
        message: "Token missing"
    });

}

        // ================= VERIFY JWT =================
        // Verify the JWT received from the client.
        // If the token is invalid or expired, jwt.verify()
        // throws an error and the request is rejected.

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        // ================= HYDRATE USER =================
        // Fetch the latest customer details from the database
        // using the customer ID present in the JWT.

        const [rows] = await db.query(
            'SELECT * FROM customers WHERE customer_id = ?',
            [decoded.id]
        );

        // ================= CHECK CUSTOMER EXISTS =================
        // If the customer no longer exists in the database,
        // reject the request.

        if (rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Customer not found"
            });

        }

        const customer = rows[0];

        // ================= DEVELOPMENT LOG =================
        // Used only for testing Hydrate User.
        // Remove before production if not required.

        console.log("HYDRATED USER:", customer);

        // ================= TOKEN VERSION VALIDATION =================
        // Compare the token version stored in the JWT
        // with the latest token version in the database.
        // If they don't match, the token is no longer valid.

        if (decoded.tokenVersion !== customer.token_version) {

            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });

        }

        // ================= STORE LATEST USER =================
// Assign the latest customer object to req.user
// and include the role from the JWT.

        req.user = {
    ...customer,
    role: decoded.role
};
        // ================= CONTINUE REQUEST =================

        next();

    } catch (error) {

        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }

};

module.exports = verifyToken;