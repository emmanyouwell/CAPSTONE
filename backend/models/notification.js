const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const notificationSchema = new mongoose.Schema({
    token: { 
        type: String, 
        required: true, 
        unique: true 
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
