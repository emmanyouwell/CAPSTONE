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
// exports.sendNotification = async (req, res) => {
//     try {
//         const { title, body } = req.body;
//         if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });

//         const tokens = await Notification.find({});
//         if (tokens.length === 0) return res.status(400).json({ error: 'No registered tokens' });

//         const messages = tokens.map(user => ({
//             to: user.token,
//             sound: 'default',
//             title,
//             body,
//         }));

//         const response = await fetch('https://exp.host/--/api/v2/push/send', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(messages),
//         });

//         res.json(await response.json());
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// };
