const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    try {

        // GET AUTH HEADER

        const authHeader = req.headers.authorization;

        console.log("AUTH HEADER:", authHeader);

        // CHECK HEADER

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Token missing"
            });

        }

        // EXTRACT TOKEN

        const token = authHeader.split(' ')[1];

        console.log("TOKEN:", token);

        // VERIFY TOKEN

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        // STORE USER DATA

        req.user = decoded;

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