const express = require('express');
const { saveToken, notifyUsers, sendNotification } = require('../controllers/notifController');

const router = express.Router();

router.post('/notifications/save-token', saveToken);
router.get('/notifications', notifyUsers);
router.post('/send-notification', sendNotification);

module.exports = router;
