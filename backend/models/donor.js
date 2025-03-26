const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const donorSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
  home_address: {
    street: {
      type: String,
      required: [true, "Enter Street"],
    },
    brgy: {
      type: String,
      required: [true, "Enter Baranggay"],
    },
    city: {
      type: String,
      required: [true, "Enter City"],
    },
  },
  age: {
    type: Number,
    required: [true, "Please enter age of the donor"],
  },
  birthday: {
    type: Date,
    required: [true, "Please enter birthday of the donor"],
  },
  office_address: {
    type: String,
    required: [true, "Please enter office address of the donor"],
  },
  contact_number: {
    type: String,
    required: [true, "Please enter contact number of the donor"],
  },
  occupation: {
    type: String,
    required: [true, "Please enter occupation of the donor"],
  },
  donorType: {
    type: String,
    enum: ["Community", "Private", "Employee", "Network Office/Agency"],
    required: [true, "Please enter type of donor"],
  },
  eligibility: {
    type: String,

  },
  dateTested: {
    type: Date
  },
  children: [
    {
      name: { type: String },
      dateOfBirth: {
        type: Date,
      },
      age: {
        type: String,
      },
      birth_weight: {
        type: String,
      },
      aog: {
        type: String,
      },
    },
  ],
  donations: [
    {
      donationType: {
        type: String,
        enum: ["Public", "Private"],
        required: true,
      },
      schedule: {
        type: ObjectId,
        ref: "Schedule",
      },
      milkLettingEvent: {
        type: ObjectId,
        ref: "Letting",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Donor", donorSchema);
