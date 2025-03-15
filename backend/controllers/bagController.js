const Inventory = require('../models/inventory2');
const Fridge = require('../models/fridge');
const Bag = require('../models/bags');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const Donor = require('../models/donor');
const User = require('../models/user');
exports.createBag = catchAsyncErrors(async (req, res, next) => {
    const { userID, volume, expressDate } = req.body;
    console.log("body: ", req.body)
    const donor = await Donor.find({ user: userID });
    if (!donor) {
        return next(new ErrorHandler('Donor not found', 404));
    }

    console.log('donor: ', donor[0]._id);
    const bags = await Bag.create({ donor: donor[0]._id, volume, expressDate });
    res.status(201).json({
        success: true,
        bags,
    });
})


exports.getDonorBags = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const donor = await Donor.find({ user: id });
    if (!donor) {
        return next(new ErrorHandler('Donor not found', 404));
    }
    const result = await Bag.aggregate([
        { $match: { donor: donor[0]._id, status: "Expressed" } }, // Filter by donor & status
        {
            $group: {
                _id: null,
                totalVolume: { $sum: "$volume" }, // Calculate total volume
                oldestExpressDate: { $min: "$expressDate" }, // Get the earliest expressDate
                latestExpressDate: { $max: "$expressDate" }, // Get the latest expressDate
                bags: { $push: "$$ROOT" } // Push all bag documents into an array
            }
        }
    ]);

    const totalVolume = result.length > 0 ? result[0].totalVolume : 0;
    const bags = result.length > 0 ? result[0].bags : [];
    const oldestExpressDate = result.length > 0 ? result[0].oldestExpressDate : null;
    const latestExpressDate = result.length > 0 ? result[0].latestExpressDate : null;

    res.status(200).json({
        success: true,
        count: bags.length,
        bags,
        totalVolume,
        oldestExpressDate,
        latestExpressDate
    });
})

exports.getSingleBag = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const bag = await Bag.findById(id);
    if (!bag) {
        return next(new ErrorHandler('Bag not found', 404));
    }
    res.status(200).json({
        success: true,
        bag
    });
})

exports.updateBag = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let bag = await Bag.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    if (!bag) {
        return next(new ErrorHandler('Bag not found', 404));
    }
    res.status(200).json({
        success: true,
        bag
    });

})

exports.deleteBag = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const bag = await Bag.findByIdAndDelete(id);
    if (!bag) {
        return next(new ErrorHandler('Bag not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Bag deleted successfully'
    });
})