import React, { useState } from 'react';
import axios from 'axios';
import './css/EventCreation.css';  // Importing the custom CSS file
import NavBar from './Navbar';

const EventCreation = () => {
  // State for event data
  const [eventData, setEventData] = useState({
    eventName: '',
    eventCategory: '', // New field for Event Category
    totalTicketsAvailable: 0,
    eventDate: '',
    ticketPrice: 0,
    eventTime: '',
    description: '',
    refreshments: 'Paid', // New field for Refreshments
  });

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request to backend
     const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/agency/event-creation`, eventData,{withCredentials: true});
      alert('Event Created Successfully!');
      console.log(response)
    } catch (error) {
      console.error('There was an error creating the event:', error);
    }
  };

  return (
    <div>
    <NavBar/>
    <div className="create-event-container">
      <h1>Create New Event</h1>
      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleChange}
            required
            placeholder="Enter event name"
            className="input-field"
          />
        </div>

        {/* Event Category */}
        <div className="form-group">
          <label>Event Category</label>
          <input
            type="text"
            name="eventCategory"
            value={eventData.eventCategory}
            onChange={handleChange}
            required
            placeholder="Enter event category"
            className="input-field"
          />
        </div>

        {/* Total Tickets Available */}
        <div className="form-group">
          <label>Total Tickets Available</label>
          <input
            type="number"
            name="totalTicketsAvailable"
            value={eventData.totalTicketsAvailable}
            onChange={handleChange}
            min="0"
            required
            placeholder="Enter total tickets"
            className="input-field"
          />
        </div>

        {/* Event Date */}
        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Ticket Price */}
        <div className="form-group">
          <label>Ticket Price</label>
          <input
            type="number"
            name="ticketPrice"
            value={eventData.ticketPrice}
            onChange={handleChange}
            required
            placeholder="Enter ticket price in INR"
            className="input-field"
          />
        </div>

        {/* Event Time */}
        <div className="form-group">
          <label>Event Time</label>
          <input
            type="text"
            name="eventTime"
            value={eventData.eventTime}
            onChange={handleChange}
            required
            placeholder="e.g. from : 6:00 A.M. -  18:00 P.M."
            className="input-field"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            className="input-field textarea"
          ></textarea>
        </div>

        {/* Refreshments */}
        <div className="form-group">
          <label>Refreshments</label>
          <select
            name="refreshments"
            value={eventData.refreshments}
            onChange={handleChange}
            className="input-field select-field"
          >
            <option value="Paid">Paid</option>
            <option value="Free">Free</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Create Event</button>
      </form>
    </div>
    </div>
  );
};

export default EventCreation;
