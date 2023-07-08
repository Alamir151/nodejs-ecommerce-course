

const express = require('express');
const { signupValidator,loginValidator
} = require('../utils/validator/authValidator');


const { 
    signUp,login,forgetPassword,verifyPasswordResetCode,
    resetPassword
} = require('../services/authService');


const router = express.Router();


router.post("/signup",signupValidator,signUp);
router.post("/login",loginValidator,login);
router.post("/forgotPassword",forgetPassword);
router.post("/verifyResetCode",verifyPasswordResetCode);
router.put("/resetPassword",resetPassword);






module.exports = router;
