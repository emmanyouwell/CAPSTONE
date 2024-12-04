const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const inventorySchema = new mongoose.Schema({
    fridge: {
        type: ObjectId,
        ref: 'Fridge',
        required: [true, 'A fridge must be associated with this inventory item'],
    },
    inventoryDate: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'User is needed to complete inventory'],
    },
    pasteurizedDetails:  {
            pasteurizationDate: {
                type: Date,
                required: function () {
                    return this.fridgeType === 'Pasteurized';
                },
            },
            batch:{
                type: Number,
                required: function () {
                    return this.fridgeType === 'Pasteurized';
                },
            },
            pool:{
                type: Number,
                required: function () {
                    return this.fridgeType === 'Pasteurized';
                },
            },
            bottle:{
                type: Number,
                required: function () {
                    return this.fridgeType === 'Pasteurized';
                },
            },
            volume: {
                type: Number,
                required: function () {
                    return this.fridgeType === 'Unpasteurized';
                },
            },
            expiration: {
                type: Date,
                required: function () {
                    return this.fridgeType === 'Pasteurized';
                },
            },
        },
    unpasteurizedDetails: {
            donor: {
                type: ObjectId,
                required: function () {
                    return this.fridgeType === 'Unpasteurized';
                },
                ref: 'Donor'
            },
            expressDate: {
                type: Date,
                required: function () {
                    return this.fridgeType === 'Unpasteurized';
                },
            },
            collectionDate: {
                type: Date,
                required: function () {
                    return this.fridgeType === 'Unpasteurized';
                },
            },
            volume: {
                type: Number,
                required: function () {
                    return this.fridgeType === 'Unpasteurized';
                },
            },
        },
});

inventorySchema.virtual('fridgeType').get(function () {
    return this.populate('fridge').fridgeType;
});

module.exports = mongoose.model('Inventory', inventorySchema);