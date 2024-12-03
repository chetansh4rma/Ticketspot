const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  
  MonumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
    required: true,
  }
  ,
  eventTotalTicketsAvailable: {
    type: Number,
    required: true,
    min: 0,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventTicketPrice: {
    type: Number,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
 
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
