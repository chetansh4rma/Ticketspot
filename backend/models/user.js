const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema definition
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // userId: { // Ensure this is a unique identifier for the user
  //   type: mongoose.Schema.Types.ObjectId,
  //   auto: true, // Automatically create ObjectId
  // },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: String,
  expireToken: Date,

myTickets: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Ticket' // Reference to the Ticket model
}],
  // myTickets: [{ // Field to store user's tickets
  //   ticketId: { // Assuming tickets have a unique identifier
  //     type: String, // or you can change it to ObjectId if you want
  //     required: true,
  //     unique: true, // Ensures each ticketId is unique
  //   },
  //   ticketNo: { // Assuming tickets have a unique identifier
  //     type: String, // or you can change it to ObjectId if you want
  //     required: true,
  //     unique: true, // Ensures each ticketId is unique
  //   },
  //   purchasedAt: {
  //     type: Date,
  //     default: Date.now, // Timestamp of when the ticket was purchased
  //   },
  //   price:{
  //     type: Number,
  //     default:0
  //   },
  //   ExpirationDate:{
  //     type:Date,
  //     required:true
  //   }
  // }],
  location: { // Field to store user address details
    street: {
      type: String,
      // required: true, // Assuming street is required
    },
    city: {
      type: String,
      // required: true, // Assuming city is required
    },
    state: {
      type: String,
      // required: true, // Assuming state is required
    },
    zipCode: {
      type: String,
      // required: true, // Assuming zip code is required
    },
    country: {
      type: String,
      // required: true, // Assuming country is required
    },
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);

// OTP schema definition
const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 300 }, // It will expire in 5 min
});

const Otp = mongoose.model('Otp', OtpSchema);

module.exports = { User, Otp };
