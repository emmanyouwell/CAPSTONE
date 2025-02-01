const Notification = require('../models/notification');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

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
    try {
        const { token, title, body } = req.body;
        if (!title || !body) return next(new ErrorHandler('Title and Body is Required', 400));

        if (!token) return next(new ErrorHandler('No registered Device', 400));;

        const messages = {
            to: token,
            sound: 'default',
            title,
            body,
        };
        
        const fetch = (await import('node-fetch')).default;

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });

        res.json(await response.json());
    } catch (error) {
        res.status(500).json({ error: 'Error Sending Push Notifications' });
    }
});
