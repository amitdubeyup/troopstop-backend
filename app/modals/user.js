var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model(
  'User',
  new Schema({
    salutation: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      default: null,
    },
    emailVerified: {
      type: Number,
      default: 0,
    },
    emailCode: {
      type: Number,
      default: 0,
    },
    mobile: {
      type: Number,
      unique: true,
      required: true,
      default: 0,
    },
    mobileVerified: {
      type: Number,
      default: 0,
    },
    mobileCode: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    localAddress: {
      type: String,
      default: null,
    },
    landmark: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    pinCode: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    photo: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: 'active',
    },
  }, {
    timestamps: true,
    collection: 'User',
    versionKey: false
  })
);