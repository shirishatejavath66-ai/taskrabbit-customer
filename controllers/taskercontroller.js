const db = require('../config/db');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');



// ================= REGISTER TASKER =================

exports.registerTasker = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      phone,
      skills,
      experience,
      location
    } = req.body;


    // CHECK EXISTING TASKER

    const [existing] = await db.query(
      'SELECT * FROM taskers WHERE email = ?',
      [email]
    );


    if (existing.length > 0) {

      return res.json({
        success: false,
        message: 'Tasker already exists'
      });

    }


    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // GENERATE OTP

    const otp =
      Math.floor(1000 + Math.random() * 9000);

    const otpExpiry =
      new Date(Date.now() + 5 * 60 * 1000);


    // INSERT TASKER

    await db.query(
      `INSERT INTO taskers
      (name, email, password, phone,
       skills, experience, location,
       otp, otp_expiry)

       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        phone,
        skills,
        experience,
        location,
        otp,
        otpExpiry
      ]
    );


    console.log("TASKER OTP:", otp);


    res.json({
      success: true,
      message: 'Tasker registered successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};

// ================= TASKER LOGIN =================

exports.loginTasker = async (req, res) => {

   try {

      // GET DATA

      const { email, password } = req.body;

      console.log(email, password);

      // VALIDATION

      if (!email || !password) {

         return res.status(400).json({
            success: false,
            message: 'Email and password are required'
         });

      }

      // CHECK TASKER EXISTS

      const [results] = await db.query(
         'SELECT * FROM taskers WHERE email = ?',
         [email]
      );

      // TASKER NOT FOUND

      if (results.length === 0) {

         return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
         });

      }

      const tasker = results[0];

      // PASSWORD COMPARISON

      const isMatch = await bcrypt.compare(
         password,
         tasker.password
      );

      if (!isMatch) {

         return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
         });

      }

      // GENERATE JWT TOKEN

      const token = jwt.sign(
         {
            id: tasker.tasker_id,
            email: tasker.email
         },
         process.env.JWT_SECRET,
         {
            expiresIn: '7d'
         }
      );

      // SUCCESS RESPONSE

      res.status(200).json({
         success: true,
         message: 'Tasker login successful',
         token,
         tasker: {
            id: tasker.tasker_id,
            name: tasker.name,
            email: tasker.email
         }
      });

   } catch (error) {

      console.error('TASKER LOGIN ERROR:', error);

      res.status(500).json({
         success: false,
         message: 'Server error'
      });

   }

};

// ================= VERIFY OTP =================

exports.verifyOtp = async (req, res) => {

   try {

      // GET DATA

      const { email, otp } = req.body;

      console.log(email, otp);

      // VALIDATION

      if (!email || !otp) {

         return res.status(400).json({
            success: false,
            message: 'Email and OTP are required'
         });

      }

      // CHECK TASKER

      const [results] = await db.query(
         'SELECT * FROM taskers WHERE email = ?',
         [email]
      );

      // TASKER NOT FOUND

      if (results.length === 0) {

         return res.status(404).json({
            success: false,
            message: 'Tasker not found'
         });

      }

      const tasker = results[0];

      // CHECK OTP

      if (tasker.otp != otp) {

         return res.status(400).json({
            success: false,
            message: 'Invalid OTP'
         });

      }

      // CHECK OTP EXPIRY

      const currentTime = new Date();

      if (currentTime > tasker.otp_expiry) {

         return res.status(400).json({
            success: false,
            message: 'OTP expired'
         });

      }

      // UPDATE TASKER

      await db.query(
         `UPDATE taskers
         SET
         is_verified = true,
         otp = NULL,
         otp_expiry = NULL
         WHERE email = ?`,
         [email]
      );

      // SUCCESS RESPONSE

      res.status(200).json({
         success: true,
         message: 'OTP verified successfully'
      });

   } catch (error) {

      console.error('VERIFY OTP ERROR:', error);

      res.status(500).json({
         success: false,
         message: 'Server error'
      });

   }

};
// ================= RESEND OTP =================

exports.resendOtp = async (req, res) => {

   try {

      // GET EMAIL

      const { email } = req.body;

      console.log(email);

      // VALIDATION

      if (!email) {

         return res.status(400).json({
            success: false,
            message: 'Email is required'
         });

      }

      // CHECK TASKER

      const [results] = await db.query(
         'SELECT * FROM taskers WHERE email = ?',
         [email]
      );

      // TASKER NOT FOUND

      if (results.length === 0) {

         return res.status(404).json({
            success: false,
            message: 'Tasker not found'
         });

      }

      // GENERATE NEW OTP

      const otp = Math.floor(
         1000 + Math.random() * 9000
      );

      console.log('NEW OTP:', otp);

      // NEW OTP EXPIRY

      const otpExpiry = new Date(
         Date.now() + 5 * 60 * 1000
      );

      // UPDATE DATABASE

      await db.query(
         `UPDATE taskers
         SET otp = ?, otp_expiry = ?
         WHERE email = ?`,
         [otp, otpExpiry, email]
      );

      // SUCCESS RESPONSE

      res.status(200).json({
         success: true,
         message: 'OTP resent successfully'
      });

   } catch (error) {

      console.error('RESEND OTP ERROR:', error);

      res.status(500).json({
         success: false,
         message: 'Server error'
      });

   }

};

// ================= GET PROFILE =================

exports.getProfile = async (req, res) => {

   try {

      // GET EMAIL FROM TOKEN

      const email = req.user.email;

      console.log(email);

      // FETCH TASKER

      const [results] = await db.query(
         `SELECT
         tasker_id,
         name,
         email,
         phone,
         is_verified,
         created_at
         FROM taskers
         WHERE email = ?`,
         [email]
      );

      // TASKER NOT FOUND

      if (results.length === 0) {

         return res.status(404).json({
            success: false,
            message: 'Tasker not found'
         });

      }

      // SUCCESS RESPONSE

      res.status(200).json({
         success: true,
         tasker: results[0]
      });

   } catch (error) {

      console.error('GET PROFILE ERROR:', error);

      res.status(500).json({
         success: false,
         message: 'Server error'
      });

   }

};
// ================= UPDATE PROFILE =================

exports.updateProfile = async (req, res) => {

   try {

      const { name, phone } = req.body;

      // GET EMAIL FROM TOKEN

      const email = req.user.email;

      // CHECK TASKER EXISTS

      const [results] = await db.query(
         'SELECT * FROM taskers WHERE email = ?',
         [email]
      );

      if (results.length === 0) {

         return res.status(404).json({
            success: false,
            message: 'Tasker not found'
         });

      }

      // UPDATE PROFILE

      await db.query(
         `UPDATE taskers
          SET name = ?, phone = ?
          WHERE email = ?`,
         [name, phone, email]
      );

      res.status(200).json({
         success: true,
         message: 'Profile updated successfully'
      });

   } catch (error) {

      console.error('UPDATE PROFILE ERROR:', error);

      res.status(500).json({
         success: false,
         message: 'Server error'
      });

   }

};
// ================= FORGOT PASSWORD =================

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const [taskers] = await db.query(
      'SELECT tasker_id FROM taskers WHERE email = ?',
      [email]
    );

    if (taskers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tasker not found'
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    const otpExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await db.query(
      'UPDATE taskers SET otp = ?, otp_expiry = ? WHERE email = ?',
      [otp, otpExpiry, email]
    );

    console.log('TASKER FORGOT PASSWORD OTP:', otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent for password reset'
    });

  } catch (error) {

    console.error(error);

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

    // VALIDATION
    if (!oldPassword || !newPassword) {

      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      });

    }

    // FIND TASKER
    const [results] = await db.query(
      'SELECT * FROM taskers WHERE email = ?',
      [email]
    );

    if (results.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Tasker not found'
      });

    }

    const tasker = results[0];

    // CHECK OLD PASSWORD
    const isMatch = await bcrypt.compare(
      oldPassword,
      tasker.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect'
      });

    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // UPDATE PASSWORD
    await db.query(
      'UPDATE taskers SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

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