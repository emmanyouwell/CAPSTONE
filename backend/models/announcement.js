const mongoose = require('mongoose');

const announementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Announcement', announementSchema);  