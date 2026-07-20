const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ================= REGISTER CUSTOMER =================
exports.registerCustomer = async (req, res) => {

  console.log("REGISTER CONTROLLER RUNNING");

  try {

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const [existing] = await db.query(
      'SELECT customer_id FROM customers WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Customer already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      `INSERT INTO customers (name, email, phone, password, otp, otp_expiry)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, hashedPassword, otp, otpExpiry]
    );

    console.log("REGISTER OTP:", otp);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// ================= LOGIN CUSTOMER =================
exports.loginCustomer = async (req, res) => {

  try {

    const { email, password } = req.body;

    const [results] = await db.query(
      'SELECT * FROM customers WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const customer = results[0];

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }


    // ================= GENERATE ACCESS TOKEN =================

const accessToken = jwt.sign(
{
    id: customer.customer_id,
    email: customer.email,

    role: "customer",

    tokenVersion: customer.token_version
},

  process.env.JWT_SECRET,
  { expiresIn: '15m' }   // Access Token
);

// ================= GENERATE REFRESH TOKEN =================

const refreshToken = jwt.sign(
{
    id: customer.customer_id,

    role: "customer",

    tokenVersion: customer.token_version
},

  process.env.JWT_SECRET,
  { expiresIn: '30d' }   // Refresh Token
);
// ================= SAVE REFRESH TOKEN =================

await db.query(
  'UPDATE customers SET refresh_token = ? WHERE customer_id = ?',
  [refreshToken, customer.customer_id]
);
    res
  .status(200)
  .cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  })
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  })
  .json({
    success: true,
    message: "Login successful"
  });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
//===================== Refresh Token ===================
exports.refreshToken = async (req, res) => {

    try {

        // Step 1: Read Refresh Token from Cookie
        const refreshToken = req.cookies.refreshToken;

        // Step 2: Check if Refresh Token exists
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
        }
        // Step 3: Verify JWT
        const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET
);
// Step 4: Get customer from database
    const [customers] = await db.query(
        `SELECT * FROM customers WHERE customer_id = ?`,
        [decoded.id]
    );

   
    if (customers.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Customer not found"
        });
    }

    const customer = customers[0];
    if (customer.refresh_token !== refreshToken) {
    return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
    });
}


// Compare Refresh Token
if (customer.refresh_token !== refreshToken) {
    return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
    });
}
// Compare Token Version
if (decoded.tokenVersion !== customer.token_version) {
    return res.status(401).json({
        success: false,
        message: "Token has been invalidated. Please login again."
    });
}


//Generate new access token
const newAccessToken = jwt.sign(
    {
        id: customer.customer_id,
        email: customer.email,
        role: "customer",
        tokenVersion: customer.token_version
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "15m"
    }
);
//Cookie option
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
};

res.cookie("accessToken", newAccessToken, cookieOptions);
//success response
return res.status(200).json({
    success: true,
    message: "Access token refreshed successfully"
});


        // Next step will come here...

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};


// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const [users] = await db.query(
      'SELECT * FROM customers WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customer = users[0];

    if (customer.otp != otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > customer.otp_expiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    await db.query(
      'UPDATE customers SET is_verified = 1 WHERE email = ?',
      [email]
    );

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ================= RESEND OTP =================
exports.resendOtp = async (req, res) => {

  try {

    const { email } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      'UPDATE customers SET otp = ?, otp_expiry = ? WHERE email = ?',
      [otp, otpExpiry, email]
    );

    console.log("NEW OTP:", otp);

    res.json({
      success: true,
      message: 'OTP resent successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const [users] = await db.query(
      'SELECT customer_id FROM customers WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      'UPDATE customers SET otp = ?, otp_expiry = ? WHERE email = ?',
      [otp, otpExpiry, email]
    );

    console.log("FORGOT PASSWORD OTP:", otp);

    res.json({
      success: true,
      message: 'OTP sent for password reset'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    const [users] = await db.query(
      'SELECT * FROM customers WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customer = users[0];

    if (customer.otp != otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > customer.otp_expiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE customers SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ================= GET PROFILE =================

exports.getProfile = async (req, res) => {

  try {

    // GET EMAIL FROM TOKEN
    const email = req.user.email;

    // FETCH CUSTOMER DATA
    const [users] = await db.query(
      'SELECT customer_id, name, email, phone FROM customers WHERE email = ?',
      [email]
    );

    // CUSTOMER NOT FOUND
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // SUCCESS RESPONSE
    res.json({
      success: true,
      data: users[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};


// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {

  const { name, phone } = req.body;
  const email = req.user.email;

  await db.query(
    'UPDATE customers SET name = ?, phone = ? WHERE email = ?',
    [name, phone, email]
  );

  res.json({
    success: true,
    message: 'Profile updated successfully'
  });
};

// ================= LOGOUT CUSTOMER =================

exports.logoutCustomer = async (req, res) => {

  try {
// Step 1: Get logged-in customer ID
    const customerId = req.user.id;

    // Step 2: Increment token_version
await db.query(
    `UPDATE customers
     SET token_version = token_version + 1
     WHERE customer_id = ?`,
    [customerId]
);
// Step 3: Clear Refresh Token from database
    await db.query(
      `UPDATE customers
       SET refresh_token = NULL
       WHERE customer_id = ?`,
      [customerId]
    );
    // Clear cookies
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
};

res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions);
// We'll add the cookie clearing code here next
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {

    console.error('LOGOUT ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};

// ================= CHANGE PASSWORD =================

exports.changePassword = async (req, res) => {

  try {

    const { oldPassword, newPassword } = req.body;

    // GET EMAIL FROM TOKEN
    const email = req.user.email;

    // CHECK CUSTOMER EXISTS
    const [users] = await db.query(
      'SELECT * FROM customers WHERE email = ?',
      [email]
    );

    // CUSTOMER NOT FOUND
    if (users.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });

    }

    const customer = users[0];

    // CHECK OLD PASSWORD
    const isMatch = await bcrypt.compare(
      oldPassword,
      customer.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect'
      });

    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // UPDATE PASSWORD
    await db.query(
      'UPDATE customers SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    // SUCCESS RESPONSE
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {

    console.error('CHANGE PASSWORD ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};
// ================= DELETE ACCOUNT =================

exports.deleteAccount = async (req, res) => {

  try {

    // GET EMAIL FROM TOKEN
    const email = req.user.email;

    // CHECK CUSTOMER EXISTS
    const [users] = await db.query(
      'SELECT * FROM customers WHERE email = ?',
      [email]
    );

    // CUSTOMER NOT FOUND
    if (users.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });

    }

    // DELETE CUSTOMER
    await db.query(
      'DELETE FROM customers WHERE email = ?',
      [email]
    );

    // SUCCESS RESPONSE
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {

    console.error('DELETE ACCOUNT ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};