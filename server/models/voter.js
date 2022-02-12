const mongoose = require("mongoose");
const { Schema } = mongoose;

const VoterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },

  fatherName: {
    type: String,
  },
  aadharCard: {
    type: Number,
  },
  gender: {
    type: String,
  },
  registrationNumber: {
    type: String,
  },
  profession: {
    type: String,
    required: true,
  },

  dob: {
    type: String,
    required: true,
  },
  VoterMobileNumber: {
    type: Number,
  },
  otp: {
    type: String,
  },
});

module.exports = mongoose.model("Voter", VoterSchema);
