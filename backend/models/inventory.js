const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const inventorySchema = new mongoose.Schema({
  fridge: {
    type: ObjectId,
    ref: "Fridge",
    required: [true, "A fridge must be associated with this inventory item"],
  },
  inventoryDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: [true, "Admin is needed to complete inventory"],
  },
  status: {
    type: String,
    enum: ["Available", "Unavailable"],
    default: "Available",
    required: true,
  },
  pasteurizedDetails: {
    pasteurizationDate: {
      type: Date,
      required: function () {
        return this._fridgeType === "Pasteurized";
      },
    },
    batch: {
      type: Number,
      required: function () {
        return this._fridgeType === "Pasteurized";
      },
    },
    pool: {
      type: Number,
      required: function () {
        return this._fridgeType === "Pasteurized";
      },
    },
    bottle: {
      type: Number,
      required: function () {
        return this._fridgeType === "Pasteurized";
      },
    },
    bottleType: {
      type: String,
      enum: ["100ml", "200ml"],
      default: "100ml",
      required: function () {
        return this._fridgeType === "Pasteurized";
      },
    },
    batchVolume: {
      type: Number,
      required: function () {
        return this._fridgeType === "Pasteurized";
      },
    },
    expiration: {
      type: Date,
      required: function () {
        return this._fridgeType === "Pasteurized";
      },
    },
    quantity: {
      type: Number,
      required: function () {
        return this._fridgeType === "Pasteurized";
      },
    },
    donors: [
      {
        type: ObjectId,
        ref: "Donor",
        required: function () {
          return this._fridgeType === "Pasteurized";
        },
      },
    ],
  },
  unpasteurizedDetails: {
    collectionId: {
      type: ObjectId,
      ref: "Collection",
      required: function () {
        return this._fridgeType === "Unpasteurized";
      },
    },
    expressDateStart: {
      type: Date,
      required: function () {
        return this._fridgeType === "Unpasteurized";
      },
    },
    expressDateEnd: {
      type: Date,
      required: function () {
        return this._fridgeType === "Unpasteurized";
      },
    },
    expiration: {
      type: Date,
      required: function () {
        return this._fridgeType === "Unpasteurized";
      },
    },
  },
});

// Virtual to retrieve fridge type
inventorySchema.virtual("_fridgeType").get(function () {
  return this.fridge ? this.fridge.fridgeType : null;
});

// Middleware to fetch _fridgeType before validation
inventorySchema.pre("validate", async function (next) {
  if (!this.fridge) return next();

  const fridge = await mongoose.model("Fridge").findById(this.fridge);
  if (!fridge) return next(new Error("Fridge not found"));

  this._fridgeType = fridge.type; // Store fridge type in a temporary field
  next();
});

module.exports = mongoose.model("Inventory", inventorySchema);
