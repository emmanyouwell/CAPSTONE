const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const fridgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name of refrigerator']
    },
    fridgeType: {
        type: String,
        enum: ['Unpasteurized', 'Pasteurized'],
        default: 'Unpasteurized'
    },
    capacity: {
        type: String,
        required: [true, 'Please enter capacity of the fridge']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Fridge', fridgeSchema);