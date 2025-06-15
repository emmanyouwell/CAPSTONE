const express = require('express');
const router = express.Router();

const { 
    checkNotifications, 
    getUserNotifications, 
    markAsSeen, 
    deleteNotification,
    sendNotifications, 
} = require('../controllers/notifController');

const { isAuthenticatedUser } = require('../middlewares/auth');


router.route('/notifications/check')
    .post(isAuthenticatedUser, checkNotifications); 

router.route('/notifications')
    .get(isAuthenticatedUser, getUserNotifications);

router.route('/notifications/:id')
    .put(isAuthenticatedUser, markAsSeen)
    .delete(isAuthenticatedUser, deleteNotification);

router.route('/notifications/send')
    .post(isAuthenticatedUser, sendNotifications);
    


module.exports = router;
