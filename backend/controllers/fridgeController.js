const Fridge = require('../models/fridge')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Inventory = require('../models/inventory');
// Get All fridges => /api/v1/fridges
exports.allFridges = catchAsyncErrors(async (req, res) => {
    try {
        const fridges = await Fridge.find();
        let totalVolume = 0;
        const past = fridges.filter((f) => f.fridgeType === 'Pasteurized') || []
        const unpast = fridges.filter((f) => f.fridgeType === 'Unpasteurized') || []
        let unpastFridge = [];
        let pastFridge = []
        if (unpast.length > 0) {
            unpastFridge = await Promise.all(unpast.map(async (fridge) => {
                const inventories = await Inventory.find({ fridge: fridge._id })
                    .populate({
                        path: "unpasteurizedDetails.collectionId",
                        populate: {
                            path: "pubDetails",
                            populate: [
                                {
                                    path: "attendance.donor",
                                    populate: {
                                        path: "user",
                                        select: "name email phone"
                                    },
                                    select: "_id home_address"
                                },
                                {
                                    path: "attendance.bags",
                                    select: "volume"
                                },
                                {
                                    path: "attendance.additionalBags",
                                    select: "volume"
                                }
                            ]
                        }
                    });
                if (inventories.length > 0) {
                    // Flatten all bags and additionalBags
                    const allBags = inventories.flatMap(inv =>
                        inv.unpasteurizedDetails.collectionId.pubDetails.attendance.flatMap(att => [
                            ...(att.bags || []),
                            ...(att.additionalBags || [])
                        ])

                    );
                    console.log('allBags', allBags)
                    // Calculate total volume for this fridge
                    totalVolume = allBags.reduce((acc, bag) => acc + (bag.volume || 0), 0);
                }
                // Return fridge object with totalVolume included
                return {
                    ...fridge.toObject(), // Convert Mongoose object to plain object
                    totalVolume
                };
            }));


        }
        if (past.length > 0) {
            pastFridge = await Promise.all(past.map(async (fridge) => {
                const inventories = await Inventory.find({ fridge: fridge._id })

                // Calculate total volume for this fridge
                totalVolume = inventories.reduce((acc, inv) => acc + (inv.pasteurizedDetails.batchVolume || 0), 0);

                // Return fridge object with totalVolume included
                return {
                    ...fridge.toObject(), // Convert Mongoose object to plain object
                    totalVolume
                };
            }));
        }

        const updatedFridges = [...unpastFridge, ...pastFridge]
        res.status(200).json({
            success: true,
            count: updatedFridges.length,
            fridges: updatedFridges
        });
    } catch (error) {
        console.error('Error fetching fridges:', error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }




})

// Create fridge => /api/v1/fridges
exports.createFridge = catchAsyncErrors(async (req, res) => {
    const data = req.body;

    const fridge = await Fridge.create({
        name: data.name,
        fridgeType: data.fridgeType.trim(),
    });

    res.status(201).json({
        success: true,
        fridge
    });
})

// Get specific fridge details => /api/v1/fridge/:id
exports.getFridgeDetails = catchAsyncErrors(async (req, res, next) => {
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
exports.updateFridge = catchAsyncErrors(async (req, res, next) => {
    const data = req.body;

    const newfridgeData = {
        name: data.name,
        fridgeType: data.fridgeType.trim(),
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
exports.deleteFridge = catchAsyncErrors(async (req, res, next) => {
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


exports.openFridge = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let allBags
    let total = 0
    const fridge = await Fridge.findById(id);
    const inventories = await Inventory.find({ fridge: id })
        .populate({
            path: "unpasteurizedDetails.collectionId",
            populate: [{
                path: "pubDetails",
                populate: [
                    {
                        path: "attendance.donor",
                        populate: {
                            path: "user",
                            select: "name email phone"
                        },
                        select: "_id home_address"
                    },
                    {
                        path: "attendance.bags",
                        select: "volume"
                    },
                    {
                        path: "attendance.additionalBags",
                        select: "volume"
                    }
                ]
            },
            {
                path: 'privDetails',
                populate: [
                    {
                        path: 'donorDetails.donorId',
                        populate: { path: 'user', select: 'name phone' }
                    },
                    {
                        path: 'donorDetails.bags'
                    }
                ]
            }]
        })
        
    const formattedInventories = inventories.map(inventory => {
        const attendance = inventory.unpasteurizedDetails.collectionId.pubDetails.attendance;

        const totalBags = attendance.reduce((sum, att) =>
            sum + (att.bags?.length || 0) + (att.additionalBags?.length || 0), 0
        );
        total = attendance.reduce((sum, att) =>
            sum + (att.bags?.reduce((acc, bag) => acc + (bag.volume || 0), 0) || 0) +
            (att.additionalBags?.reduce((acc, bag) => acc + (bag.volume || 0), 0) || 0), 0
        );
        return {
            ...inventory.toObject(),
            totalBags,
            totalVolume: total
        };
    });

    if (inventories) {
        allBags = inventories.flatMap(inv =>
            inv.unpasteurizedDetails.collectionId.pubDetails.attendance.flatMap(att => [...(att.bags) || [], ...(att.additionalBags || [])])
        )
        total = allBags.reduce((acc, bag) => acc + (bag.volume || 0), 0)
    }

    res.status(200).json({
        success: true,
        fridge,
        inventories: formattedInventories,
        allBags,
        total
    })
})