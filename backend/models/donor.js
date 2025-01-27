const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

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
    home_address: {
        street: {
            type: String,
            required: [true, 'Enter Street']
        },
        brgy: {
            type: String,
            required: [true, 'Enter Baranggay']
        },
        city: {
            type: String,
            required: [true, 'Enter City']
        }
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
    office_address: {
        type: String,
        required: [true, 'Please enter office address of the donor']
    },
    contact_number: {
        type: String,
        required: [true, 'Please enter contact number of the donor']
    },
    occupation: {
        type: String,
        required: [true, 'Please enter occupation of the donor']
    },
    donorType: {
        type: String,
        enum: ['Community', 'Private', 'Employee', 'Network Office/Agency'],
        required: [true, 'Please enter type of donor']
    },
    children: [
        {
            name: { type: String },
            dateOfBirth: {
                type: Date,
            },
            age: {
                type: Number,
            },
            birth_weight: {
                type: Number,
            },
            aog: {
                type: Number,
            }

        }
    ],
    donation: [
        {
            invId: {
                type: ObjectId,
                ref: 'Inventory'
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Donor', donorSchema);