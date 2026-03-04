const express = require('express');
const router = express.Router();
const { register, login, sendOTP, verifyOTP, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', authenticate, getMe);

module.exports = router;
