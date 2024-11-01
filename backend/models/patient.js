const mongoose = require('mongoose');
const validator = require('validator');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone'],
        minlength: [11, 'Phone number is invalid'],
    },
    avatar: {
        public_id: {
            type: String,
            // required: true
        },
        url: {
            type: String,
            // required: true
        }
    },
    role: {
        type: String,
        enum: ['Staff', 'Admin', 'SuperAdmin'],
        default: 'Staff'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('User', userSchema);