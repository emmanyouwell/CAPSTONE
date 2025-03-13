const Inventory = require('../models/inventory2');
const Fridge = require('../models/fridge');
const Bag = require('../models/bags');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Donor = require('../models/donor');
const User = require('../models/user');
exports.createBag = catchAsyncErrors(async (req, res, next) => {
    const {donor, volume, expressDate} = req.body;
    const donorId = await Donor.find({user: donor});
    if (!donorId) {
        return next(new ErrorHandler('Donor not found', 404));
    }
    const bags = await Bag.create({donor: donor, volume, expressDate});
    res.status(201).json({
        success: true,
        bags,
    });
})
