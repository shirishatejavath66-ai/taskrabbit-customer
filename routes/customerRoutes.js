const express = require('express');

const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');


const customerController =
require('../controllers/customerController');

console.log(customerController.refreshToken);


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
   authorizeRole("customer"),
   customerController.getProfile
);
// ================= UPDATE PROFILE API =================
router.put(
   '/update-profile',
   verifyToken,
   authorizeRole("customer"),
   customerController.updateProfile
);
//=============LOGOUT API=================
router.post(
   '/logout',
   verifyToken,
   authorizeRole("customer"),
   customerController.logoutCustomer
);
// ================= CHANGE PASSWORD =================
router.put(
   '/change-password',
   verifyToken,
   authorizeRole("customer"),
   customerController.changePassword
);
// ================= DELETE ACCOUNT =================
router.delete(
   '/delete-account',
   verifyToken,
   authorizeRole("customer"),
   customerController.deleteAccount
);
//===============Refresh Token======================
router.post("/refresh-token", customerController.refreshToken);

module.exports = router;