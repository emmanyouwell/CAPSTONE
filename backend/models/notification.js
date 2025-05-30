const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const softDeletePlugin = require('./plugins/softDelete')
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
notificationSchema.plugin(softDeletePlugin)
module.exports = mongoose.model('Notification', notificationSchema);
