
# TicketSpot

**TicketSpot** is a chatbot-based ticketing system designed to streamline the process of booking monument tickets in India. It allows users to easily book tickets for various monuments, access event details, and make the most out of their visit through a user-friendly, AI-powered interface.

---

## Features

- **Chatbot Interface**: Interact with the chatbot to book tickets seamlessly.
- **Monument Ticket Booking**: Allows users to book tickets for monuments across India.
- **Event Management**: Users can get information about events related to each monument.
- **Real-time Availability**: Get up-to-date information on ticket availability and events.
- **Secure Payments**: Integrated secure payment gateway for smooth transactions.

---

## Installation

Follow the steps below to set up TicketSpot locally.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (local or cloud instance)

### Clone the repository

```bash
git clone https://github.com/chetansh4rma/Ticketspot.git
cd ticketspot
```

### Install dependencies

```bash
npm install
```


### Start the server

```bash
npm start
```

---

## Usage

1. **Start the application**: After starting the server, open your browser and navigate to `http://localhost:3000`.
2. **Chat with the bot**: The chatbot will guide you through the process of selecting the monument and booking tickets.
3. **Make Payments**: Complete the booking with secure payment integration.

---

## Folder Structure

Here is the basic structure of the project:

```
ticketspot/
│
├── controllers/           # API route handlers
├── models/                # MongoDB schemas
├── routes/                # Express route definitions
├── services/              # Business logic and external API integrations
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
└── server.js              # Main server entry point
```

---

## Technologies Used

- **Node.js**: Server-side JavaScript environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user data and ticket bookings
- **Dialogflow**: AI integration for the chatbot interface
- **Razorpay**: Payment gateway for secure transactions
