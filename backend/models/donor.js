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
    value: {
      type: Number,
      required: [true, "Please enter age of the donor"]
    },
    unit: {
      enum: ["year", "month", "week", "day"],
      type: String,
      required: true
    }
  },
  birthday: {
    type: Date,
    required: [true, "Please enter birthday of the donor"],
  },
  office_address: {
    type: String,
    
  },
  contact_number: {
    type: String,
    
  },
  occupation: {
    type: String,
    
  },
  donorType: {
    type: String,
    enum: ["Community", "Private", "Employee", "Network Office/Agency"],
    required: [true, "Please enter type of donor"],
  },
  eligibility: {
    type: String,

  },
  submissionID: {
    type: String,
  },
  lastSubmissionDate: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
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
        value: {
          type: Number,
          required: [true, "Please enter age of the donor"]
        },
        unit: {
          enum: ["year", "month", "week", "day"],
          type: String,
          required: true
        }
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
