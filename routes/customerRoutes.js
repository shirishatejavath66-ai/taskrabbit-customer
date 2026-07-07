const express = require('express');

const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');

const customerController =
require('../controllers/customerController');


// ================= REGISTER API =================

router.post(
   '/register',
   customerController.registerCustomer
);

//==================VERIFY OTP=======================

router.post(
   '/verify-otp',
   customerController.verifyOtp
);

//===============Resend OTP==========================
router.post(
   '/resend-otp',
   customerController.resendOtp
);
//==============forgot password=============
router.post(
   '/forgot-password',
   customerController.forgotPassword
);
//=====================rest password=============

router.post(
   '/reset-password',
   customerController.resetPassword
);
// ================= LOGIN API =================

router.post(
   '/login',
   customerController.loginCustomer
);
// ================= PROFILE API =================
router.get(
   '/profile',
   verifyToken,
   customerController.getProfile
);
// ================= UPDATE PROFILE API =================
router.put(
   '/update-profile',
   verifyToken,
   customerController.updateProfile
);
//=============LOGOUT API=================
router.post(
   '/logout',
   verifyToken,
   customerController.logoutCustomer
);
// ================= CHANGE PASSWORD =================
router.put(
   '/change-password',
   verifyToken,
   customerController.changePassword
);
// ================= DELETE ACCOUNT =================
router.delete(
   '/delete-account',
   verifyToken,
   customerController.deleteAccount
);
module.exports = router;