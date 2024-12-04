const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const donorSchema = new mongoose.Schema({
    name: {
        last: {
            type: String,
            required: [true, 'Please enter last name']
        },
        first: {
            type: String,
            required: [true, 'Please enter first name']
        },
        middle: {
            type: String,
            required: [true, 'Please enter middle name']
        }
    },
    address: {
        type: String,
        required: [true, 'Please enter address of the donor']
    },
    phone: {
        type: String,
        required: [true, 'Please enter contact number of the donor']
    },
    age: {
        type: Number,
        required: [true, 'Please enter age of the donor']
    },
    birthday: {
        type: Date,
        required: [true, 'Please enter birthday of the donor']
    },
    civilStatus: {
        type: String,
        enum: ['Single', 'Married', 'Widowed', 'Legally Separated'],
        default: 'Single'
    },
    spouse: {
        type: String
    },
    children: [
        {
            name: {type: String}
        }
    ],
    donation: [
        {
            date: {
                type: Date,
                required: [true, 'Please enter date of donation']
            },
            milkDonated: {
                type: Number,
                required: [true, 'Please enter amount of milk donated']
            },
            approvedBy: {
                type: ObjectId,
                required: true,
                ref: 'User'
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Donor', donorSchema);