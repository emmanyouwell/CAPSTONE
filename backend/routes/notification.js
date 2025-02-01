const express = require('express');
const { saveToken, notifyUsers } = require('../controllers/notifController');

const router = express.Router();

router.post('/notifications/save-token', saveToken);
router.get('/notifications', notifyUsers);

module.exports = router;
