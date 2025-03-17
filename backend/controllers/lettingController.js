const Letting = require("../models/letting");
const Collection = require("../models/collection");
const User = require("../models/user");
const Donor = require("../models/donor");
const Bag = require("../models/bags");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Get All lettings => /api/v1/lettings
exports.allLettings = catchAsyncErrors(async (req, res, next) => {
  const lettings = await Letting.find()
    .populate({
      path: "attendance.donor",
      select: "user home_address",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate({
      path: "attendance.bags",
      select: "volume",
    });

  const count = await Letting.countDocuments();

  res.status(200).json({
    success: true,
    count,
    lettings,
  });
});

// Create letting => /api/v1/lettings
exports.createLetting = catchAsyncErrors(async (req, res, next) => {
  const actDetails = {
    start: new Date(req.body.start), // This stores in UTC
    end: new Date(req.body.end), // This stores in UTC
  };

  const letting = await Letting.create({
    ...req.body,
    actDetails,
  });

  res.status(201).json({
    success: true,
    letting,
  });
});

// Get specific letting details => /api/v1/letting/:id
exports.getLettingDetails = catchAsyncErrors(async (req, res, next) => {
  const letting = await Letting.findById(req.params.id)
    .populate({
      path: "attendance.donor",
      select: "user home_address",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate({
      path: "attendance.bags",
      select: "volume",
    });
  if (!letting) {
    return next(
      new ErrorHandler(`letting is not found with this id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    letting,
  });
});

// Update letting => /api/v1/letting/:id
exports.updateLetting = catchAsyncErrors(async (req, res, next) => {
  const actDetails = {
    start: req.body.start,
    end: req.body.end,
  };

  const newLettingData = {
    ...req.body,
    actDetails,
  };

  const letting = await Letting.findByIdAndUpdate(
    req.params.id,
    newLettingData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    letting,
  });
});

// Delete letting => /api/v1/letting/:id
exports.deleteletting = catchAsyncErrors(async (req, res, next) => {
  const letting = await Letting.findById(req.params.id);

  if (!letting) {
    return next(
      new ErrorHandler(`letting is not found with this id: ${req.params.id}`)
    );
  }

  await letting.deleteOne();

  res.status(200).json({
    success: true,
    message: "Milk Letting Deleted",
  });
});

// Create Milk Letting Event
exports.createEvent = catchAsyncErrors(async (req, res) => {
  const { activity, venue, actDetails, admin } = req.body;

  try {
    const newEvent = await Letting.create({
      activity,
      venue,
      actDetails,
      admin,
    });
    res
      .status(201)
      .json({ success: true, message: "Created Milk Letting Event", newEvent });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create event", details: error.message });
  }
});

// Mark Attendance for Donors
exports.markAttendance = catchAsyncErrors(async (req, res, next) => {
  const { lettingId, donorId, donorType, bags, lastDonation } = req.body;

  try {
    const event = await Letting.findById(lettingId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    let total = Number(event.totalVolume) || 0;

    const newBags = bags.flatMap((bag) => {
      if (bag.quantity === 0)
        throw new ErrorHandler("Bag quantity cannot be zero");

      const numericVolume = Number(bag.volume) || 0;
      total += numericVolume * bag.quantity;

      return Array.from({ length: bag.quantity }, () => ({
        collectionType: "Public",
        donor: donorId,
        status: "Collected",
        volume: bag.volume,
      }));
    });

    const createdBags = await Bag.insertMany(newBags);
    const bagIds = createdBags.map((bag) => bag._id);

    const attendanceEntry = {
      donor: donorId,
      donorType,
      bags: bagIds,
      ...(lastDonation && { lastDonation }), // Conditionally add `lastDonation`
    };

    event.attendance.push(attendanceEntry);
    event.totalVolume = total;
    await event.save();

    res.status(200).json({
      success: true,
      message: "Attendance recorded successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to mark attendance",
      details: error.message,
    });
  }
});

// Finalize the Milk Letting Session
exports.finalizeSession = catchAsyncErrors(async (req, res) => {
  const { lettingId, adminId } = req.body;

  try {
    const event = await Letting.findById(lettingId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    let collection = await Collection.findOne({ pubDetails: lettingId });

    if (!collection) {
      if (event.status !== "Done") {
        event.status = "Done";
        await event.save();

        collection = await Collection.create({
          collectionType: "Public",
          collectionDate: new Date(),
          pubDetails: lettingId,
          user: [adminId],
        });
      } else {
        return res
          .status(400)
          .json({ error: "Session already finalized, no new data created." });
      }
    } else {
      if (!collection.user.includes(adminId)) {
        collection.user.push(adminId);
        await collection.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Session finalized successfully",
      collection,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to finalize session", details: error.message });
  }
});

// New Public Donor
exports.newPublicDonor = catchAsyncErrors(async (req, res, next) => {
  try {
    const formData = req.body.formData;

    // Prepare children array with one child object
    const children = [
      {
        name: formData.child_name,
        age: formData.child_age,
        birth_weight: formData.birth_weight,
        aog: formData.aog,
      },
    ];
    let password = `${formData.first_name
      .replace(/\s+/g, "")
      .toLowerCase()}${formData.last_name.replace(/\s+/g, "").toLowerCase()}`;

    const name = {
      first: formData.first_name || "",
      middle: formData.middle_name || "",
      last: formData.last_name || "",
    };

    const userExist = await User.findOne({
      name,
      email: formData.email,
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name: name,
      email: formData.email,
      phone: formData.contact_number,
      password: password,
      role: "User",
    });

    // Create donor
    const donor = await Donor.create({
      user: user._id,
      home_address: {
        street: formData.street,
        brgy: formData.brgy,
        city: formData.city || "Taguig City",
      },
      age: formData.age,
      birthday: formData.birthday,
      children: children,
      office_address: formData.office_address,
      contact_number: formData.contact_number_2,
      donorType: formData.donor_type,
      occupation: formData.occupation,
    });

    res.status(200).json({
      success: true,
      user,
      donor,
    });
  } catch (error) {
    console.error("Error in createDonor:", error);
    res.status(500).json({ error: error.message });
  }
});
