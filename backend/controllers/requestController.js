const Request = require("../models/request");
const Patient = require("../models/patient");
const Inventory = require("../models/inventory");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("cloudinary");

// Get All requests => /api/v1/requests
exports.allRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await Request.find()
    .populate("patient", "name patientType")
    .populate("requestedBy", "name employeeID")
    .populate("tchmb.approvedBy", "name email role")
    .populate("tchmb.ebm", "pasteurizedDetails");

  const count = await Request.countDocuments();

  res.status(200).json({
    success: true,
    count,
    requests,
  });
});

// Create request => /api/v1/requests
exports.createRequest = catchAsyncErrors(async (req, res, next) => {
  try {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "requests",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;

    const patient = await Patient.findById(req.body.patient);
    if (!patient) {
      return next(
        new ErrorHandler(
          `Patient is not found with this id: ${req.body.patient}`
        )
      );
    }
    let newData = {};
    if (req.body.patientType === "Inpatient") {
      newData = {
        ...req.body,
        department: req.body.location,
      };
    } else {
      newData = {
        ...req.body,
        hospital: req.body.location,
      };
    }
    const request = await Request.create(newData);

    patient.patientType = req.body.patientType;
    patient.requested.push(request._id);
    patient.save();

    res.status(201).json({
      success: true,
      request,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    next(error);
  }
});

// Get specific request details => /api/v1/request/:id
exports.getRequestDetails = catchAsyncErrors(async (req, res, next) => {
  const request = await Request.findById(req.params.id)
    .populate("patient", "name patientType")
    .populate("requestedBy", "name employeeID")
    .populate("tchmb.approvedBy", "name email role")
    .populate("tchmb.ebm", "pasteurizedDetails");

  if (!request) {
    return next(
      new ErrorHandler(`Request is not found with this id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    request,
  });
});

// Update request => /api/v1/request/:id
exports.updateRequest = catchAsyncErrors(async (req, res, next) => {
  const data = req.body;

  try {
    // console.log("Request Data: ", data)
    // console.log("Parameters: ", req.params.id)
    let request = await Request.findById(req.params.id);
    if (!request) {
      return next(
        new ErrorHandler(`Request is not found with this id: ${req.params.id}`)
      );
    }

    let newImages = [];
    let existingImages = [];

    if (Array.isArray(data.images)) {
      data.images.forEach((image) => {
        if (image.public_id) {
          // Existing Cloudinary image
          existingImages.push(image);
        } else if (image.local) {
          // New local image
          newImages.push(image.url);
        }
      });
    }

    // Remove images that are no longer in the request
    for (let oldImage of request.images) {
      if (!existingImages.some((img) => img.public_id === oldImage.public_id)) {
        await cloudinary.v2.uploader.destroy(oldImage.public_id);
      }
    }

    // Upload new images to Cloudinary
    let uploadedImages = [];
    if (newImages.length > 0) {
      for (let imageUri of newImages) {
        if (!imageUri.startsWith("data:image")) {
          console.log("Skipping invalid image format:", imageUri);
          continue;
        }

        const result = await cloudinary.v2.uploader.upload(imageUri, {
          folder: "requests",
        });
        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    // Merge existing and newly uploaded images
    data.images = [...existingImages, ...uploadedImages];

    // Validate patient
    const patient = await Patient.findById(data.patient);
    if (!patient) {
      return next(
        new ErrorHandler(`Patient is not found with this id: ${data.patient}`)
      );
    }

    patient.patientType = data.patientType;
    await patient.save();

    let newData = {};
    if (data.patientType === "Inpatient") {
      newData = {
        ...data,
        department: data.location,
        hospital: "Taguig-Pateros District Hospital",
      };
    } else {
      newData = { ...data, department: null, hospital: data.location };
    }

    // Update request
    request = await Request.findByIdAndUpdate(req.params.id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    next(error);
  }
});

// Delete request => /api/v1/request/:id
exports.deleteRequest = catchAsyncErrors(async (req, res, next) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return next(
      new ErrorHandler(`request is not found with this id: ${req.params.id}`)
    );
  }

  // for (let i = 0; i < request.images.length; i++) {
  //     const result = await cloudinary.v2.uploader.destroy(request.images[i].public_id)
  // }

  await request.deleteOne();

  res.status(200).json({
    success: true,
    message: "Request Deleted",
  });
});

// Update Request Status
exports.updateRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return next(
        new ErrorHandler(`Request is not found with this id: ${req.params.id}`)
      );
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get staff request => /api/v1/staff/:id/requests
exports.myRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await Request.find({ requestedBy: req.params.id })
    .populate("patient", "name patientType")
    .populate("requestedBy", "name employeeID")
    .populate("tchmb.approvedBy", "name email role")
    .populate("tchmb.ebm", "pasteurizedDetails");

  const count = requests.length;

  res.status(200).json({
    success: true,
    count,
    requests,
  });
});

// Update Requested Volume => /api/v1/request/:id/volume
exports.updateVolumeRequested = catchAsyncErrors(async (req, res, next) => {
  const { volume, days } = req.body;

  const request = await Request.findById(req.params.id)
    .populate("patient")
    .populate("requestedBy");

  if (!request) {
    return next(
      new ErrorHandler(`Request is not found with this id: ${req.params.id}`)
    );
  }

  request.volumeRequested.volume = volume;
  request.volumeRequested.days = days;
  await request.save();

  res.status(200).json({
    success: true,
    request,
  });
});

// Dispense Inpatient Request
exports.inpatientDispense = catchAsyncErrors(async (req, res) => {
  const { request, transport, approvedBy, dispenseAt } = req.body;
  try {
    if (!Array.isArray(request) || request.length === 0) {
      return next(new ErrorHandler("Request data are required.", 400));
    }

    for (const reqItem of request) {
      for (const ebm of reqItem.tchmb.ebm) {
        const { invId, bottle } = ebm;

        const inventory = await Inventory.findById(invId);
        if (!inventory) {
          return next(new ErrorHandler("Inventory not found", 404));
        }

        const { start, end } = bottle;

        inventory.pasteurizedDetails.bottles =
          inventory.pasteurizedDetails.bottles.map((bot) => {
            if (
              bot.bottleNumber >= start &&
              bot.bottleNumber <= end &&
              bot.status === "Reserved"
            ) {
              return { ...bot.toObject(), status: "Dispensed" };
            }
            return bot;
          });

        const allDispensed = inventory.pasteurizedDetails.bottles.every(
          (bot) => bot.status === "Dispensed"
        );

        if (allDispensed) {
          inventory.status = "Unavailable";
        }

        await inventory.save();
      }
    }

    for (const req of request) {
      const updatedRequest = await Request.findById(req._id);
      if (!updatedRequest) {
        return next(new ErrorHandler("Request not found", 404));
      }
      updatedRequest.status = "Done";
      updatedRequest.tchmb.transport = transport;
      updatedRequest.tchmb.dispenseAt = dispenseAt;
      updatedRequest.tchmb.approvedBy = approvedBy;
      await updatedRequest.save();
    }

    res.status(200).json({
      success: true,
      message: "Inpatient requests completed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Dispense Outpatient Request
exports.outpatientDispense = catchAsyncErrors(async (req, res) => {
  const { request, transport, approvedBy } = req.body;
  // console.log(req.body)
  try {
    if (!Array.isArray(request.tchmb.ebm) || request.tchmb.ebm.length === 0) {
      return next(new ErrorHandler("Request data are required.", 400));
    }

    for (const ebm of request.tchmb.ebm) {
      const { invId, bottle } = ebm;

      const inventory = await Inventory.findById(invId);
      if (!inventory) {
        return next(new ErrorHandler("Inventory not found", 404));
      }

      const { start, end } = bottle;

      inventory.pasteurizedDetails.bottles =
        inventory.pasteurizedDetails.bottles.map((bot) => {
          if (
            bot.bottleNumber >= start &&
            bot.bottleNumber <= end &&
            bot.status === "Reserved"
          ) {
            return { ...bot.toObject(), status: "Dispensed" };
          }
          return bot;
        });

      const allDispensed = inventory.pasteurizedDetails.bottles.every(
        (bot) => bot.status === "Dispensed"
      );

      if (allDispensed) {
        inventory.status = "Unavailable";
      }
      await inventory.save();
    }

    const updatedRequest = await Request.findById(request._id);
    if (!updatedRequest) {
      return next(new ErrorHandler("Request not found", 404));
    }
    updatedRequest.status = "Done";
    updatedRequest.tchmb.transport = transport;
    updatedRequest.tchmb.approvedBy = approvedBy;

    await updatedRequest.save();

    res.status(200).json({
      success: true,
      message: "Outpatient request completed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
