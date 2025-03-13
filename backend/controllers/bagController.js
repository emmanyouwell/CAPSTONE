const Inventory = require('../models/inventory2');
const Fridge = require('../models/fridge');
const Bag = require('../models/bags');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Donor = require('../models/donor');
const User = require('../models/user');
exports.createBag = catchAsyncErrors(async (req, res, next) => {
    const {userID, volume, expressDate} = req.body;
    console.log("body: ",req.body)
    const donor = await Donor.find({user: userID});
    if (!donor) {
        return next(new ErrorHandler('Donor not found', 404));
    }
    
    console.log('donor: ', donor[0]._id);
    const bags = await Bag.create({donor: donor[0]._id, volume, expressDate});
    res.status(201).json({
        success: true,
        bags,
    });
})


exports.getDonorBags = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const donor = await Donor.find({user: id});
    if (!donor) {
        return next(new ErrorHandler('Donor not found', 404));
    }
    const bags = await Bag.find({donor: donor._id, status: 'Expressed'});
    res.status(200).json({
        success: true,
        count: bags.length,
        bags,
    });
})
