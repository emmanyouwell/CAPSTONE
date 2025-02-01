const express = require('express');
const { saveToken } = require('../controllers/notifController');

const router = express.Router();

router.post('/notifications/save-token', saveToken);

module.exports = router;
