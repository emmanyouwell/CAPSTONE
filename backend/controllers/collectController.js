const Collection = require('../models/collection');
const Fridge = require('../models/fridge');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Get All Collection => /api/v1/collections
exports.allCollection = catchAsyncErrors(async (req, res, next) => {
    const collection = await Collection.find()
        .populate('pubDetails.milkLetting')
        .populate('privDetails.scheduled');

    res.status(200).json({
        success: true,
        count: collection.length,
        collection,
    });
});

// Create collection => /api/v1/collections
exports.createCollection = catchAsyncErrors(async (req, res, next) => {
    const { user, pubDetails, privDetails, collectionDate, status } = req.body;
    
    // Validate Collection Type
    const collectionType = pubDetails ? 'Public' : privDetails ? 'Private' : null;

    if (!collectionType || !user || !status || !collectionDate) {
        return next(new ErrorHandler('Please fill out the required details', 400));
    }

    const collectionData = { 
        collectionType, 
        collectionDate, 
        user, 
        status 
    };

    if (collectionType === 'Public') {
        if (!pubDetails || !pubDetails.totalVol || !pubDetails.milkLetting) {
            return next(new ErrorHandler('Public Milk Collection requires complete pubDetails', 400));
        }

        collectionData.pubDetails = pubDetails;

    } else if (collectionType === 'Private') {
        if (!privDetails || !privDetails.totalVol || !privDetails.scheduled) {
            return next(new ErrorHandler('Private Milk Collection requires complete privDetails', 400));
        }

        collectionData.privDetails = privDetails;

    } else {
         return next(new ErrorHandler('Invalid Milk Collection', 400));
    }

    const collection = await Collection.create(collectionData);

    res.status(201).json({
        success: true,
        collection,
    });
});

// Get specific collection details => /api/v1/collection/:id
exports.getCollectionDetails = catchAsyncErrors(async (req, res, next) => {
    const collection = await Collection.findById(req.params.id)
        .populate('pubDetails.milkLetting')
        .populate('privDetails.scheduled');

    if (!collection) {
        return next(new ErrorHandler('collection not found', 404));
    }

    res.status(200).json({
        success: true,
        collection,
    });
});

// Update collection details => /api/v1/collection/:id
exports.updateCollection = catchAsyncErrors(async (req, res, next) => {
    const {pubDetails, privDetails, collectionDate, status } = req.body;

    const collection = await Collection.findById(req.params.id);

    if (!collection) {
        return next(new ErrorHandler('collection not found', 404));
    }

    // Update collection date
    if (collectionDate) {
        collection.collectionDate = collectionDate;
    }

    if (status) {
        collection.status = status;
    }

    console.log("collection Data: ", collection)

    // Validation of Updating based on fridge type
    if (collection.collectionType === 'Public') {
        if (!pubDetails || !pubDetails.totalVol || !pubDetails.milkLetting) {
            return next(new ErrorHandler('Public Milk Collection requires complete pubDetails.', 400));
        }

        collection.pubDetails = pubDetails;

    } else if (collection.collectionType === 'Private') {
        if (!privDetails || !privDetails.totalVol || !privDetails.scheduled) {
            return next(new ErrorHandler('Private Milk Collection requires complete privDetails.', 400));
        }

        collection.privDetails = privDetails;

    } else {
        return next(new ErrorHandler('Invalid Milk Collection Type', 400));
    }

    await collection.save(); // Save collection updates

    res.status(200).json({
        success: true,
        collection,
    });
});

// Delete collection details => /api/v1/collection/:id
exports.deleteCollection = catchAsyncErrors(async (req, res, next) => {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
        return next(new ErrorHandler('Collection not found', 404));
    }

    await collection.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Collection deleted successfully',
    });
});
