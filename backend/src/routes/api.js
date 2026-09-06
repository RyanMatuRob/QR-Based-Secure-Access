const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const qrController = require('../controllers/qrController');
const logController = require('../controllers/logController');

// Auth & Users
router.post('/users', authController.registerUser);
router.post('/auth/login', authController.login);

// QR Management
router.post('/qr/generate', auth, qrController.generateQR);
router.post('/qr/verify', auth, qrController.verifyQR);

// Access Logs
router.post('/access-logs', auth, logController.createLog);

module.exports = router;