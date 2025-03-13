const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const inventory2Schema = new mongoose.Schema({
    fridge: {
        type: ObjectId,
        ref: 'Fridge',
        required: [true, 'A fridge must be associated with this inventory item'],
    },
    inventoryDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available',
        required: true
    },
    pasteurizedDetails: {
        pasteurizationDate: {
            type: Date,
            required: function () {
                return this._fridgeType === 'Pasteurized';
            },
        },
        batch: {
            type: Number,
            default: 0
        },
        pool: {
            type: Number,
            default: 0
        },
        bottle: {
            type: Number,
            default: 0
        },
        bottleType: {
            type: String,
            enum: ['100ml', '200ml'],
            default: '100ml',
            required: function () {
                return this._fridgeType === 'Pasteurized';
            }
        },
        volume: {
            type: Number,
            required: function () {
                return this._fridgeType === 'Pasteurized';
            },
        },
        expiration: {
            type: Date,
            required: function () {
                return this._fridgeType === 'Pasteurized';
            },
        },
        quantity: {
            type: Number,
            required: function () {
                return this._fridgeType === 'Pasteurized';
            },
        },
        donors: [{
            type: ObjectId,
            ref: 'Donor',
            required: function () {
                return this._fridgeType === 'Pasteurized';
            }
        }]
    },
    unpasteurizedDetails: {
        donor: {
            type: ObjectId,
            ref: 'Donor',
            required: function () {
                return this._fridgeType === 'Unpasteurized';
            },
        },
        expressDateStart: {
            type: Date,
            required: function () {
                return this._fridgeType === 'Unpasteurized';
            },
        },
        expressDateEnd: {
            type: Date,
            required: function () {
                return this._fridgeType === 'Unpasteurized';
            },
        },
        collectionDate: {
            type: Date,
            required: function () {
                return this._fridgeType === 'Unpasteurized';
            },
        },
        expiration: {
            type: Date,
            required: function () {
                return this._fridgeType === 'Unpasteurized';
            },
        },
        volume: {
            type: Number,
            required: function () {
                return this._fridgeType === 'Unpasteurized';
            },
        },
        bags: [{
            type: ObjectId,
            ref: 'Bag',
            required: function () {
                return this._fridgeType === 'Unpasteurized';
            },
        }]
    },
});

// Virtual to retrieve fridge type
inventory2Schema.virtual('fridgeType').get(function () {
    return this.fridge ? this.fridge.fridgeType : null;
});

// Middleware to fetch fridgeType before validation
inventory2Schema.pre('validate', async function (next) {
    if (!this.fridge) return next();
    
    const fridge = await mongoose.model('Fridge').findById(this.fridge);
    if (!fridge) return next(new Error('Fridge not found'));

    this._fridgeType = fridge.type; // Store fridge type in a temporary field
    next();
});

module.exports = mongoose.model('Inventory2', inventory2Schema);
