const express = require('express');
const router = express.Router();

console.log('Tasker Routes Loaded');

const taskerController = require('../controllers/taskerController');
const verifyToken = require('../middleware/authMiddleware');


// ================= REGISTER TASKER =================
router.post(
  '/register',
  taskerController.registerTasker
);


// ================= VERIFY OTP =================
router.post(
  '/verify-otp',
  taskerController.verifyOtp
);


// ================= RESEND OTP =================
router.post(
  '/resend-otp',
  taskerController.resendOtp
);


// ================= LOGIN TASKER =================
router.post(
  '/login',
  taskerController.loginTasker
);


// ================= GET PROFILE =================
router.get(
  '/profile',
  verifyToken,
  taskerController.getProfile
);


// ================= UPDATE PROFILE =================
router.put(
  '/update-profile',
  verifyToken,
  taskerController.updateProfile
);


// ================= FORGOT PASSWORD =================
router.post(
  '/forgot-password',
  taskerController.forgotPassword
);

// ================= CHANGE PASSWORD =================
router.post(
  '/change-password',
  verifyToken,
  taskerController.changePassword
);
module.exports = router;