const Inventory = require("../models/inventory");
const Fridge = require("../models/fridge");
const Collection = require("../models/collection");
const Schedule = require("../models/schedule");
const Letting = require("../models/letting");
const Bags = require("../models/bags");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Get All Patients => /api/v1/inventories
exports.allInventories = catchAsyncErrors(async (req, res, next) => {
  const inventories = await Inventory.find()
    .populate("fridge")
    .populate({
      path: "unpasteurizedDetails.collectionId",
      select: "collectionType pubDetails privDetails collectionDate",
      populate: [
        {
          path: "pubDetails",
          select: "attendance totalVolume actDetails",
          populate: {
            path: "attendance.bags attendance.donor",
          },
        },
        {
          path: "privDetails",
          select: "donorDetails totalVolume dates",
          populate: {
            path: "donorDetails.bags donorDetails.donorId",
          },
        },
      ],
    });

  res.status(200).json({
    success: true,
    count: inventories.length,
    inventories,
  });
});

// Create inventory => /api/v1/inventories
exports.createInventory = catchAsyncErrors(async (req, res, next) => {
  const { fridgeId, userId, pasteurizedDetails, unpasteurizedDetails } =
    req.body;

  // Validate fridge
  const fridge = await Fridge.findById(fridgeId);
  if (!fridge) {
    return next(new ErrorHandler("Refrigerator not found", 404));
  }

  if (!fridgeId || !userId) {
    return next(new ErrorHandler("Please fill out the required details", 400));
  }

  const inventoryData = { fridge: fridgeId, user: userId };

  if (fridge.fridgeType === "Pasteurized") {
    console.log("This is where I go in pasteur");
    if (
      !pasteurizedDetails ||
      !pasteurizedDetails.pasteurizationDate ||
      !pasteurizedDetails.batch ||
      !pasteurizedDetails.pool ||
      !pasteurizedDetails.bottleType ||
      !pasteurizedDetails.bottleQty ||
      !pasteurizedDetails.donors
    ) {
      return next(
        new ErrorHandler(
          "Pasteurized fridge requires complete pasteurizedDetails",
          400
        )
      );
    }
    const expiration = new Date(pasteurizedDetails.pasteurizationDate);
    expiration.setDate(expiration.getDate() + 183);
    const batchVolume =
      pasteurizedDetails.bottleType * pasteurizedDetails.bottleQty;
    const pastDetails = {
      ...pasteurizedDetails,
      batchVolume: batchVolume,
      expiration: expiration.getTime(),
    };
    inventoryData.pasteurizedDetails = pastDetails;
  } else if (fridge.fridgeType === "Unpasteurized") {
    if (!unpasteurizedDetails || !unpasteurizedDetails.collectionId) {
      return next(
        new ErrorHandler(
          "Unpasteurized fridge requires complete unpasteurizedDetails",
          400
        )
      );
    }

    const unpast = {
      collectionId: unpasteurizedDetails.collectionId,
    };

    const collection = await Collection.findById(
      unpasteurizedDetails.collectionId
    );
    
    if (collection.pubDetails) {
      const letting = await Letting.findById(collection.pubDetails);
      if (!letting) {
        return next(new ErrorHandler("Letting not found", 404));
      }
      unpast.expressDateStart = letting.actDetails.start;
      unpast.expressDateEnd = letting.actDetails.end;

      const expiration = new Date(letting.actDetails.start);
      expiration.setDate(expiration.getDate() + 14);

      unpast.expiration = expiration.getTime();
    } else if (collection.privDetails) {
      const schedule = await Schedule.findById(collection.privDetails);
      if (!schedule) {
        return next(new ErrorHandler("Schedule not found", 404));
      }
      // Retrieve bags linked to the donor in the schedule
      const bags = await Bags.find({ donor: schedule.donorDetails.donorId });

      if (!bags || bags.length === 0) {
        return next(new ErrorHandler("No bags found for this donor.", 404));
      }

      // Sort bags to find the oldest and newest expressDate
      const expressStartDate = bags.reduce(
        (oldest, bag) => (bag.expressDate < oldest ? bag.expressDate : oldest),
        bags[0].expressDate
      );

      const expressEndDate = bags.reduce(
        (latest, bag) => (bag.expressDate > latest ? bag.expressDate : latest),
        bags[0].expressDate
      );
      unpast.expressDateStart = expressStartDate;
      unpast.expressDateEnd = expressEndDate;

      const expiration = new Date(expressStartDate);
      expiration.setDate(expiration.getDate() + 14);

      unpast.expiration = expiration.getTime();
    } else {
      return next(new ErrorHandler("No public or private details", 400));
    }
    collection.status = 'Stored';
    await collection.save()
    inventoryData.unpasteurizedDetails = unpast;
  } else {
    return next(new ErrorHandler("Invalid fridge type", 400));
  }

  const inventory = await Inventory.create(inventoryData);

  if (fridge.fridgeType === "Pasteurized" && pasteurizedDetails) {
    await Bags.updateMany(
      { _id: { $in: pasteurizedDetails.items } },
      { $set: { status: "Pasteurized" } }
    );
    for (let i = 0; i < pasteurizedDetails.bottleQty; i++) {
      const bottleDetails = { bottleNumber: i + 1, status: "Available" };
      inventory.pasteurizedDetails.bottles.push(bottleDetails);
      await inventory.save();
    }
  }

  res.status(201).json({
    success: true,
    inventory,
  });
});

// Get specific Inventory details => /api/v1/inventory/:id
exports.getInventoryDetails = catchAsyncErrors(async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id)
    .populate("fridge")
    .populate("unpasteurizedDetails.donor");

  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }

  res.status(200).json({
    success: true,
    inventory,
  });
});

// Update Inventory details => /api/v1/inventory/:id
exports.updateInventory = catchAsyncErrors(async (req, res, next) => {
  const {
    pasteurizedDetails,
    unpasteurizedDetails,
    inventoryDate,
    status,
    temp,
  } = req.body;

  const inventory = await Inventory.findById(req.params.id).populate("fridge");

  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }

  const fridge = inventory.fridge;

  // Update inventory date
  if (inventoryDate) {
    inventory.inventoryDate = inventoryDate;
  }

  if (status) {
    inventory.status = status;
  }

  if (temp) {
    inventory.temp = temp;
  }
  console.log("Inventory Data: ", inventory);
  // Validation of Updating based on fridge type
  if (fridge.fridgeType === "Pasteurized") {
    if (
      !pasteurizedDetails ||
      !pasteurizedDetails.pasteurizationDate ||
      !pasteurizedDetails.batch ||
      !pasteurizedDetails.pool ||
      !pasteurizedDetails.bottle ||
      !pasteurizedDetails.expiration
    ) {
      return next(
        new ErrorHandler(
          "Pasteurized fridge requires complete pasteurizedDetails.",
          400
        )
      );
    }
  } else if (fridge.fridgeType === "Unpasteurized") {
    if (
      !unpasteurizedDetails ||
      !unpasteurizedDetails.donor ||
      !unpasteurizedDetails.expressDate ||
      !unpasteurizedDetails.collectionDate ||
      !unpasteurizedDetails.volume
    ) {
      return next(
        new ErrorHandler(
          "Unpasteurized fridge requires complete unpasteurizedDetails.",
          400
        )
      );
    }
  } else {
    return next(new ErrorHandler("Invalid fridge type", 400));
  }

  // await fridge.save(); // Save fridge updates
  await inventory.save(); // Save inventory updates

  res.status(200).json({
    success: true,
    inventory,
  });
});

// Delete Inventory details => /api/v1/inventory/:id
exports.deleteInventory = catchAsyncErrors(async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory) {
    return next(new ErrorHandler("Inventory not found", 404));
  }

  await inventory.deleteOne();

  res.status(200).json({
    success: true,
    message: "Inventory deleted successfully",
  });
});

// Update Inventory Status
exports.updateInventoryStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return next(new ErrorHandler("Inventory not found", 404));
    }

    inventory.status = status;
    await inventory.save();

    res.status(200).json({
      success: true,
      message: "Inventory status updated successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Reserve Inventory for Request => /api/v1/inventories/:id/reserve
exports.reserveInventoryForRequest = catchAsyncErrors(
  async (req, res, next) => {
    const { bottlesToReserve } = req.body;

    // Find inventory
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return next(new ErrorHandler("Inventory not found", 404));
    }

    if (
      !inventory.pasteurizedDetails ||
      !inventory.pasteurizedDetails.bottles
    ) {
      return next(
        new ErrorHandler(
          "This inventory does not contain pasteurized details",
          400
        )
      );
    }

    const availableBottles = inventory.pasteurizedDetails.bottles.filter(
      (bottle) => bottle.status === "Available"
    );

    if (availableBottles.length < bottlesToReserve) {
      return next(
        new ErrorHandler(
          `Not enough available bottles. Only ${availableBottles.length} is available.`,
          400
        )
      );
    }

    // Reserve the specified number of bottles
    for (let i = 0; i < bottlesToReserve; i++) {
      availableBottles[i].status = "Reserved";
    }

    if (availableBottles.length === 0) {
      inventory.status = "Unavailable";
    }

    await inventory.save();

    res.status(200).json({
      success: true,
      message: `${bottlesToReserve} bottles have been reserved successfully.`,
      updatedInventory: inventory,
    });
  }
);

// Controller to check all inventories and update their status
exports.updateAllInventoriesStatus = catchAsyncErrors(async (req, res, next) => {
  try {
      const inventories = await Inventory.find({ 'unpasteurizedDetails.collectionId': { $exists: true } }).populate('unpasteurizedDetails.collectionId');

      if (!inventories.length) {
        return next(
          new ErrorHandler(
            "No Inventories",
            400
          ));
      }

      let updatedCount = 0;
      for (const inventory of inventories) {
          const collection = inventory.unpasteurizedDetails.collectionId;
          let bags = [];

          if (collection.pubDetails) {
              const letting = await Letting.findById(collection.pubDetails).populate('attendance.bags');
              if (letting) {
                  bags = [
                      ...letting.attendance.flatMap(attendee => attendee.bags),
                      ...letting.attendance.flatMap(attendee => attendee.additionalBags)
                  ];
              }
          } else if (collection.privDetails) {
              const schedule = await Schedule.findById(collection.privDetails).populate('donorDetails.bags');
              if (schedule) {
                  bags = schedule.donorDetails.bags;
              }
          }

          if (bags.length) {
              const allPasteurized = bags.every(bag => bag.status === 'Pasteurized');
              if (allPasteurized) {
                  inventory.status = 'Unavailable';
                  await inventory.save();
                  updatedCount++;
              }
          }
      }

      return res.status(200).json({ message: `${updatedCount} inventories checked and updated successfully.` });

  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
});

