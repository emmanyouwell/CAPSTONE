const Notification = require('../models/notification');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { sendPushNotification } = require("../utils/sendPushNotification");

exports.notifyUsers = catchAsyncErrors(async (req, res, next) => {
    const userNotifs = await Notification.find()
        .populate('user', 'role')

    res.status(200).json({
        success: true,
        userNotifs
    })
})

exports.saveToken = catchAsyncErrors(async (req, res, next) => {
console.log(req.body)
    const userNotif = await Notification.create(req.body);

    res.status(201).json({
        success: true,
        userNotif
    });
})

// Send push notifications
exports.sendNotification = catchAsyncErrors(async (req, res, next) => {
    const { token, title, body } = req.body;
    
    if (!token || !title || !body) {
        return next(new ErrorHandler('Title, Body, and Token are Required', 400));
    }

    const response = await sendPushNotification(token, title, body);
    
    if (response.error) {
        return res.status(500).json({ error: response.error });
    }

    res.json(response);
});