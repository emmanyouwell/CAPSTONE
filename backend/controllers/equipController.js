const Equipment = require('../models/equipment')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get All Equipments => /api/v1/Equipments
exports.allEquipments = catchAsyncErrors( async (req, res, next) => {
    const equipments = await Equipment.find();

    const count = await Equipment.countDocuments();

    res.status(200).json({
        success: true,
        count,
        equipments
    })
})

// Create Equipment => /api/v1/Equipments
exports.createEquipment= catchAsyncErrors( async (req, res, next) => {
    const { name, equipType, quantity, condition, location, invBy} = req.body;

    const equipment = await Equipment.create({
        name,
        equipType, 
        quantity,
        condition,
        location,
        invBy
    });

    res.status(201).json({
        success: true,
        equipment
    });
})

// Get specific Equipment details => /api/v1/Equipment/:id
exports.getEquipmentDetails = catchAsyncErrors( async (req, res, next) => {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
        return next(new ErrorHandler(`Equipment is not found with this id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        equipment
    })
})

// Update Equipment => /api/v1/Equipment/:id
exports.updateEquipment = catchAsyncErrors( async (req, res, next) => {
    const { name, equipType, quantity, condition, location, invBy, mainDate, usageLogs } = req.body;
    
    const newEquipmentData = {
        name,
        equipType, 
        quantity,
        condition,
        location,
        invBy,
        mainDate,
        usageLogs
    }

    const equipment = await Equipment.findByIdAndUpdate(req.params.id, newEquipmentData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    if (!Equipment) {
        return next(new ErrorHandler(`Equipment is not found with this id: ${req.params.id}`))
    }
    
    res.status(200).json({
        success: true,
        equipment
    })

})

// Delete Equipment => /api/v1/Equipment/:id
exports.deleteEquipment = catchAsyncErrors( async (req, res, next) => {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
        return next(new ErrorHandler(`Equipment is not found with this id: ${req.params.id}`))
    }

    await equipment.deleteOne();

    res.status(200).json({
        success: true,
        message: "Equipment Deleted"
    })
})