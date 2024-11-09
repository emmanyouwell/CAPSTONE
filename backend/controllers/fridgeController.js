const Fridge = require('../models/fridge')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All fridges => /api/v1/fridges
exports.allFridges = catchAsyncErrors( async (req, res, next) => {
    const fridges = await Fridge.find();

    const count = await Fridge.countDocuments();

    res.status(200).json({
        success: true,
        count,
        fridges
    })
})

// Create fridge => /api/v1/fridges
exports.createFridge= catchAsyncErrors( async (req, res, next) => {
    const data = req.body;

    const fridge = await Fridge.create({
        name: data.name,
        fridgeType: data.fridgeType.trim(),
        capacity: data.capacity,
    });

    res.status(201).json({
        success: true,
        fridge
    });
})

// Get specific fridge details => /api/v1/fridge/:id
exports.getFridgeDetails = catchAsyncErrors( async (req, res, next) => {
    const fridge = await Fridge.findById(req.params.id);

    if (!fridge) {
        return next(new ErrorHandler(`fridge is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        fridge
    })
})

// Update fridge => /api/v1/fridge/:id
exports.updateFridge = catchAsyncErrors( async (req, res, next) => {
    const data = req.body;
    
    const newfridgeData = {
        name: data.name,
        fridgeType: data.fridgeType.trim(),
        capacity: data.capacity,
    }

    const fridge = await Fridge.findByIdAndUpdate(req.params.id, newfridgeData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    if (!fridge) {
        return next(new ErrorHandler(`fridge is not found with this id: ${req.params.id}`))
    }
    
    res.status(200).json({
        success: true,
        fridge
    })

})

// Delete fridge => /api/v1/fridge/:id
exports.deleteFridge = catchAsyncErrors( async (req, res, next) => {
    const fridge = await Fridge.findById(req.params.id);

    if (!fridge) {
        return next(new ErrorHandler(`fridge is not found with this id: ${req.params.id}`))
    }

    await fridge.deleteOne();

    res.status(200).json({
        success: true,
        message: "Fridge Deleted"
    })
})