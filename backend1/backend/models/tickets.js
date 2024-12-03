const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({

  ticketNo: {
    type: String,
    unique: true, // Ensure ticket number is unique
    required: true,
  },
  MonumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now, // Timestamp of when the ticket was purchased
},
ExpirationDate:{
    type:Date
    // default: Date.now, // Timestamp of when the ticket was purchased
  },
  selectedDate:{
     type:Date
  }
});

// Exporting the Ticket model
const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
