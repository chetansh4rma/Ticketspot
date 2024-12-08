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
  ref: 'Ticket' 
}],
  location: { 
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    country: {
      type: String,
    },
  },
});
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);
const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 300 }, 
});

const Otp = mongoose.model('Otp', OtpSchema);

module.exports = { User, Otp };
