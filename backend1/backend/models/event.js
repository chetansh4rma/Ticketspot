const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  eventCategory:{
         type:String,
         required: true
  },
  // eventId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   auto: true
  // },
  MonumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
    required: true,
  }
  ,
  totalTicketsAvailable: {
    type: Number,
    required: true,
    min: 0,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  ticketPrice: {
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
  refreshment:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled',
  },
   tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket' // Reference to the Ticket model
  }]
 
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
