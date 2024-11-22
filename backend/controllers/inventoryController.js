const Inventory = require('../models/inventory');
const Fridge = require('../models/fridge');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Get All Patients => /api/v1/inventories
exports.allInventories = catchAsyncErrors(async (req, res, next) => {
    const inventories = await Inventory.find().populate('fridge').populate('unpasteurizedDetails.donor');

    res.status(200).json({
        success: true,
        count: inventories.length,
        inventories,
    });
});

// Create inventory => /api/v1/inventories
exports.createInventory = catchAsyncErrors(async (req, res, next) => {
    const { fridgeId, userId, pasteurizedDetails, unpasteurizedDetails, inventoryDate } = req.body;

    // Validate fridge
    const fridge = await Fridge.findById(fridgeId);
    if (!fridge) {
        return next(new ErrorHandler('Refrigerator not found', 404));
    }

    const inventoryData = { fridge: fridgeId, inventoryDate, user: userId };

    if (fridge.fridgeType === 'Pasteurized') {
        if (!pasteurizedDetails || pasteurizedDetails.length === 0) {
            return next(new ErrorHandler('Pasteurized fridge requires pasteurizedDetails', 400));
        }

        inventoryData.pasteurizedDetails = pasteurizedDetails.map(item => {
            if (!item.pasteurizationDate || !item.batch || !item.pool || !item.bottle || !item.volume || !item.expiration) {
                throw new ErrorHandler('Pasteurized item must include all required fields.', 400);
            }
            return item;
        });

        // Automatically update fridge capacity
        let totalVolume = 0;
        pasteurizedDetails.forEach(item => {
            totalVolume += parseInt(item.volume, 10); 
        });

        const updatedCapacity = parseInt(fridge.capacity, 10) - totalVolume;
        if (updatedCapacity < 0) {
            return next(new ErrorHandler('Fridge capacity exceeded', 400));
        }

        fridge.capacity = updatedCapacity;
        await fridge.save();

    } else if (fridge.fridgeType === 'Unpasteurized') {
        if (!unpasteurizedDetails || unpasteurizedDetails.length === 0) {
            return next(new ErrorHandler('Unpasteurized fridge requires unpasteurizedDetails', 400));
        }

        inventoryData.unpasteurizedDetails = unpasteurizedDetails.map(item => {
            if (!item.donor || !item.expressDate || !item.collectionDate || !item.volume) {
                throw new ErrorHandler('Unpasteurized item must include all required fields.', 400);
            }
            return item;
        });

        // Automatically update fridge capacity
        let totalVolume = 0;
        unpasteurizedDetails.forEach(item => {
            totalVolume += parseInt(item.volume, 10); 
        });

        const updatedCapacity = parseInt(fridge.capacity, 10) - totalVolume;
        if (updatedCapacity < 0) {
            return next(new ErrorHandler('Fridge capacity exceeded', 400));
        }

        fridge.capacity = updatedCapacity;
        await fridge.save();
    } else {
        return next(new ErrorHandler('Invalid fridge type', 400));
    }

    // Create inventory
    const inventory = await Inventory.create(inventoryData);

    res.status(201).json({
        success: true,
        inventory,
        fridge,
    });
});

// Get specific Inventory details => /api/v1/inventory/:id
exports.getInventoryDetails = catchAsyncErrors(async (req, res, next) => {
    const inventory = await Inventory.findById(req.params.id)
        .populate('fridge')
        .populate('unpasteurizedDetails.donor');

    if (!inventory) {
        return next(new ErrorHandler('Inventory not found', 404));
    }

    res.status(200).json({
        success: true,
        inventory,
    });
});

// Update Inventory details => /api/v1/inventory/:id
exports.updateInventory = catchAsyncErrors(async (req, res, next) => {
    const { pasteurizedDetails, unpasteurizedDetails, inventoryDate } = req.body;

    const inventory = await Inventory.findById(req.params.id).populate('fridge');

    if (!inventory) {
        return next(new ErrorHandler('Inventory not found', 404));
    }

    if (inventoryDate) {
        inventory.inventoryDate = inventoryDate;
    }

    // Update based on fridge type
    if (inventory.fridge.fridgeType === 'Pasteurized' && pasteurizedDetails) {
        inventory.pasteurizedDetails = pasteurizedDetails.map(item => {
            if (!item.pasteurizationDate || !item.batch || !item.pool || !item.bottle || !item.expiration) {
                throw new ErrorHandler('Pasteurized item must include all required fields.', 400);
            }
            return item;
        });
    } else if (inventory.fridge.fridgeType === 'Unpasteurized' && unpasteurizedDetails) {
        inventory.unpasteurizedDetails = unpasteurizedDetails.map(item => {
            if (!item.donor || !item.expressDate || !item.collectionDate || !item.volume) {
                throw new ErrorHandler('Unpasteurized item must include all required fields.', 400);
            }
            return item;
        });
    }

    await inventory.save();

    res.status(200).json({
        success: true,
        inventory,
    });
});

// Delete Inventory details => /api/v1/inventory/:id
exports.deleteInventory = catchAsyncErrors(async (req, res, next) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
        return next(new ErrorHandler('Inventory not found', 404));
    }

    await inventory.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Inventory deleted successfully',
    });
});
