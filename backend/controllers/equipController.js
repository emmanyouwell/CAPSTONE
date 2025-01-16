const Equipment = require('../models/equipment')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary');

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
exports.createEquipment = catchAsyncErrors(async (req, res, next) => {
    try {
        let images = []
        if (typeof req.body.images === 'string') {
            images.push(req.body.images)
        } else {
            images = req.body.images
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'equipments'
        });
        
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        });
        }

        req.body.images = imagesLinks

        // Create equipment entry in the database
        const equipment = await Equipment.create(req.body);

        // Send response
        res.status(201).json({
            success: true,
            equipment,
        });
    } catch (error) {
        // Handle errors and avoid duplicate headers
        return next(error);
    }
});

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
    // const { name, equipType, quantity, condition, location, invBy, mainDate, usageLogs } = req.body;
    let equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
        return next(new ErrorHandler('Equipment not Found', 400));
    };
    
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the equipment
        for (let i = 0; i < equipment.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(equipment.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'equipments'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }

    equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    
    res.status(200).json({
        success: true,
        equipment
    })

})

// Delete Equipment => /api/v1/Equipment/:id
exports.deleteEquipment = catchAsyncErrors( async (req, res, next) => {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
        return next(new ErrorHandler(`Equipment is not found with this id: ${req.params.id}`))
    }

    for (let i = 0; i < equipment.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(equipment.images[i].public_id)
    }

    res.status(200).json({
        success: true,
        message: "Equipment Deleted"
    })
})