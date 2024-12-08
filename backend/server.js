// server.js
const dotenv = require('dotenv');
const express = require('express');
const functions = require('@google-cloud/functions-framework');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Agency = require('./models/agency'); 
const Event=require("./models/event");
const Ticket=require('./models/tickets')
const cookieParser = require('cookie-parser');
const app = express();
const translate = require("google-translate-api-x");
const jwt = require('jsonwebtoken');
const path = require('path');
const {User,Otp} = require('./models/user');
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/logoUrl', express.static(path.join(__dirname, 'uploads/companyLogo')));
app.use('/imageUrl', express.static(path.join(__dirname, 'uploads/monuImages')));
const crypto = require('crypto');
dotenv.config();

const cors=require("cors");


const allowedOrigins = [
  `${process.env.FRONT_URL1}`,  // First frontend URL
  `${process.env.FRONT_URL2}`   // Second frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
    console.log('Request Origin:', origin)
  },
  credentials: true // Allow cookies and other credentials
}));

// console.log('Request Origin:', origin)


// app.use(cors({
//   origin: (origin, callback) => {
//     // Check if the origin is in the list of allowed origins
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true); // Allow request
//     } else {
//       callback(new Error('Not allowed by CORS')); // Block request
//     }
//   },
//   credentials: true // Allow credentials (cookies, etc.)
// }));

// app.use(cors({
//   origin: `${process.env.FRONT_URL}`, // Your frontend origin
//   credentials: true
// }));


const authRoutes = require('./Users'); // Ensure correct path to auth routes
const Monument=require("./Monumentdata");



mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message,err);
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {

  const token = req.cookies.token;
  
  if (token == null) return res.sendStatus(401); // Unauthorized
  
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
}

app.get("/fetchmuseumfamilyevents", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["General", "family","children"] } } },
      { $sample: { size: 5 } },
    ]);
    
    const eventWithMonuments = await Promise.all(events.map(async (event) => {
      const monument = await Agency.findById(event.MonumentId);
         // Translate monument name into Tamil
         const translatedName = await translate(monument.MonumentName, {
          to: "ta",
        });
      return {
        eventName: event.eventName,
        eventTicketPrice: event.eventTicketPrice,
        eventDate: event.eventDate,
        monument: {
          MonumentName: monument.MonumentName,
          MonumentNameTamil: typeof translatedName === "string" ? translatedName : translatedName.text, 
          MonumentId: monument._id,
          location: monument.location,
          MonumentLogo: monument.MonumentLogo,
        },
      };
    }));

    res.json(eventWithMonuments);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});



app.get("/fetchmuseumStudentevents", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["student", "General","Solo"] } } },
      { $sample: { size: 5 } },
      { $sort: { ticketPrice: 1 } }
    ]);
    
    const eventWithMonuments = await Promise.all(events.map(async (event) => {
      const monument = await Agency.findById(event.MonumentId);
      return {
        eventName: event.eventName,
        eventTicketPrice: event.eventTicketPrice,
        eventDate: event.eventDate,
        monument: {
          MonumentName: monument.MonumentName,
          MonumentId: monument._id,
          location: monument.location,
          MonumentLogo: monument.MonumentLogo,
        },
      };
    }));

    res.json(eventWithMonuments);
  } catch (error) {
    console.error("Error fetching student events:", error);
    res.status(500).json({ message: "Error fetching events" }); 
  }
});
app.get("/fetchmuseumStudenteventstamil", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["student", "General", "Solo"] } } },
      { $sample: { size: 5 } },
      { $sort: { ticketPrice: 1 } },
    ]);

    const eventWithMonuments = await Promise.all(
      events.map(async (event) => {
        const monument = await Agency.findById(event.MonumentId);

        
        const translatedName = await translate(monument.MonumentName, {
          to: "ta",
        });

        return {
          eventName: event.eventName,
          eventTicketPrice: event.eventTicketPrice,
          eventDate: event.eventDate,
          monument: {
            MonumentName: monument.MonumentName, 
            MonumentNameTamil: typeof translatedName === "string" ? translatedName : translatedName.text, 
            MonumentId: monument._id,
            location: monument.location,
            MonumentLogo: monument.MonumentLogo,
          },
        };
      })
    );

    console.log(eventWithMonuments);
    res.json(eventWithMonuments);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});
app.get("/fetchmuseumcheapplacetamil", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["student", "General", "Solo","children","family"] } } },
      { $sample: { size: 5 } },
      { $sort: { ticketPrice: 1 } },
    ]);

    const eventWithMonuments = await Promise.all(
      events.map(async (event) => {
        const monument = await Agency.findById(event.MonumentId);

        
        const translatedName = await translate(monument.MonumentName, {
          to: "ta",
        });

        return {
          eventName: event.eventName,
          eventTicketPrice: event.eventTicketPrice,
          eventDate: event.eventDate,
          monument: {
            MonumentName: monument.MonumentName, 
            MonumentNameTamil: typeof translatedName === "string" ? translatedName : translatedName.text, 
            MonumentId: monument._id,
            location: monument.location,
            MonumentLogo: monument.MonumentLogo,
          },
        };
      })
    );

    console.log(eventWithMonuments);
    res.json(eventWithMonuments);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});

app.get("/fetchmuseumSoloevents", async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { audience_type: { $in: ["student", "General","Solo"] } } },
      { $sample: { size: 5 } },
      { $sort: { ticketPrice: 1 } }
    ]);
    
    const eventWithMonuments = await Promise.all(events.map(async (event) => {
      const monument = await Agency.findById(event.MonumentId);
      return {
        eventName: event.eventName,
        eventTicketPrice: event.eventTicketPrice,
        eventDate: event.eventDate,
        monument: {
          MonumentName: monument.MonumentName,
          MonumentId: monument._id,
          location: monument.location,
          MonumentLogo: monument.MonumentLogo,
        },
      };
    }));

    res.json(eventWithMonuments);
  } catch (error) {
    console.error("Error fetching student events:", error);
    res.status(500).json({ message: "Error fetching events" }); // Return an error message if something goes wrong
  }
});
app.get("/fetchmuseumDefault", async (req, res) => {
  try {
    const results = await Agency.aggregate([
      { $sample: { size: 2 } },  // Randomly selects 2 documents
      { $sort: { ticketPrice: 1 } }  // Sorts by ticketPrice in ascending order
    ]);
    
    console.log(results);    
    res.json(results); // Send the results as JSON
  } catch (error) {
    console.error("Error fetching student events:", error);
    res.status(500).json({ message: "Error fetching events" }); // Return an error message if something goes wrong
  }
});
app.get("/fetchmuseumlowtohigh", async (req, res) => {
  try {
    const results = await Agency.aggregate([
      { $sample: { size: 2 } },  // Randomly selects 2 documents
      { $sort: { ticketPrice: 1 } }  // Sorts by ticketPrice in ascending order
    ]);
    
    console.log(results);    
    res.json(results); // Send the results as JSON
  } catch (error) {
    console.error("Error fetching student events:", error);
    res.status(500).json({ message: "Error fetching events" }); // Return an error message if something goes wrong
  }
});
app.get("/fetchmuseumfromplace/:Place", async (req, res) => {
  try {
    const { Place } = req.params;
    console.log("Searching for:", Place);

    // Using regex to handle case-insensitivity and allow for some spelling flexibility
    const results = await Agency.find({
      MonumentName: { 
        $regex: `^${Place.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}$`, // Escape special characters
        $options: 'i' // Case-insensitive search
      }
    }).sort({ ticketPrice: 1 }); // Sort by ticketPrice in ascending order (low to high)

    // Check if results are empty
    if (results.length === 0) {
      return res.status(404).json({ message: "No matching places found." });
    }

    res.json(results); // Send the results as JSON
  } catch (error) {
    console.error("Error fetching museums from place:", error);
    res.status(500).json({ message: "Error fetching events" }); // Return an error message if something goes wrong
  }
});


functions.http('handleWebhook', (request, response) => {
  const tag = request.body.queryResult.intent.displayName;

  // Log the value of 'tag' to the console
  console.log('Intent Display Name:', tag);

  let jsonResponse = {};
  
  if (tag === 'Default Welcome Intent') {
    jsonResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: ['Hello from a GCF Webhook'],
          },
        },
      ],
    };
  } else if (tag === 'get-name') {
    jsonResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: ['My name is Flowhook'],
          },
        },
      ],
    };
  } else if (tag === 'student_events') {
    jsonResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: ['Yes, there are free events available for students. Check our website for more details.'],
          },
        },
      ],
    };
  } else {
    jsonResponse = {
      fulfillmentMessages: [
        {
          text: {
            text: [`There are no fulfillment responses defined for the "${tag}" tag.`],
          },
        },
      ],
    };
  }

  response.setHeader('Content-Type', 'application/json');
  response.status(200).send(jsonResponse);
});
app.post('/webhook', async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  const Price = req.body.queryResult.parameters.budget;
  const Date = req.body.queryResult.parameters.date;
  const Place = req.body.queryResult.parameters.any;
  console.log("Display Name",req.body);
  let result=null;
  // let monument=null;
  try {
    if(Price&&Date){
      const params={
        price:Price,
        date:Date
      }
       const results= await fetchmuseum(params);
       console.log("Results",results);
      //  console.log(results)
       result = ""; // Initialize an empty string
       for (let i = 0; i < 5; i++) {
           result += results[i].MonumentName; // Concatenate each MonumentName
           if (i < 4) { // Add a separator like a comma or space, except after the last element
               result += ", ";
           }
       }
      
    }
    let response;
 if(Place){
  const params={
  MonumentName:Place
  }
 const results=await fetchmuseum(params);
 console.log("result",results)
  result=results.desc
 }
    // Handle different intents
    if (intentName === 'IntentName1') {
      // Query for data relevant to IntentName1
      response = await YourModel1.findOne({ name: 'some criteria' });
    } else if (intentName === 'IntentName2') {
      // Query for data relevant to IntentName2
      response = await YourModel2.findOne({ name: 'some other criteria' });
    } else {
      // Handle fallback or default response
      response = { message: 'Sorry, I don\'t understand the request.' };
    }
console.log("reso",result);
    // Send the response back to Dialogflow
    return res.json({
      fulfillmentText: result,  // This will be shown as the bot's reply
      source: 'webhook'
    });


  } catch (error) {
    console.error(error);
    return res.json({
      fulfillmentText: 'There was an error processing your request.',
      source: 'webhook'
    });
  }
});
const fetchmuseum = async (params) => {
  const { price, date ,MonumentName} = params;

  try {
    let results=null;
    // Fetch monuments with ticket prices less than or equal to the provided budget
   if(price && date){
    results = await Agency.find({
       ticketPrice: { $lte: price }, // Ensure ticketPrice is less than or equal to the budget
      });
    }
    else if(MonumentName){
      results = await Agency.findOne({
        MonumentName:MonumentName, // Ensure ticketPrice is less than or equal to the budget
       });
    }

    return results;
  } catch (error) {
    console.error('Error fetching monuments:', error);
    throw new Error('Unable to fetch monuments within budget');
  }
};

// User Details Route (use `authenticateToken` middleware here)
app.get('/api/userdetails', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    console.log(user) 
    // Exclude password
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.get("/translate", async (req, res) => {
  const { text, lang } = req.query; // Get text and language from the query params

  try {
    const translated = await translate(text, { to: lang });
    
    res.json({ translatedText: translated.text });
  } catch (error) {
    console.error("Error translating:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});


app.get('/api/userdetails', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    console.log(user) 
    // Exclude password
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
  
});

app.post('/api/getEventOrRegular', authenticateToken, async (req, res) => {
  const { date, lang, id } = req.body;

 
  try {
    

    // Fetch single agency using findOne
    const agency = await Agency.findOne({ _id: id });

    if (!agency) {
      return res.status(404).json({ msg: 'Agency not found' });
    }

    const normalizedInputDate = date.slice(0, 10);
    let events = [];
    let regularVisit = null;

    // Translate 'Regular Visit'
    const evName = await translate('Regular Visit', { to: lang });

    // Check if events array is empty
    if (Array.isArray(agency.events) && agency.events.length === 0) {
      
    } else {
      // Fetch events
      events = await getEvents(id, date, lang);
    }

    const price = await translate('Ticket Price', { to: lang });
const timing = await translate('Timing', { to: lang });
const soldOut=await translate('Sorry, all tickets for the events are sold out.',{to: lang})

if(agency.totalAvailableTicket>1){
    regularVisit = {
      eventName: evName.text,
      eventDate: normalizedInputDate,
      eventTicketPrice: `${price.text} :₹ ${agency.ticketPrice}`,
      eventTime: `${timing.text} : ${agency.timing}`,
      evId:agency._id,
      enName:'Regular Visit',
      eventTotalTicketsAvailable: agency.totalAvailableTicket,
      ticketPrice:agency.ticketPrice
    };
  }

    // Normalize events to always be an array
    if (!Array.isArray(events)) {
      events = [events];
    }

    // Add regularVisit to events if it exists
    if (regularVisit) {
      events.push(regularVisit);
    }

    
    return res.status(200).json({ events ,soldOutMsg:soldOut.text});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

  const getEvents = async (id, date,lang) => {
    try {
      // Normalize the input date to YYYY-MM-DD
      const normalizedInputDate = date.slice(0, 10);
  
      // Query the Events collection
      const events = await Event.find({
        MonumentId: id,
        eventDate: {
          $eq: new Date(`${normalizedInputDate}T00:00:00.000Z`)
          // $gte: new Date(`${normalizedInputDate}T00:00:00.000Z`),
          // $lt: new Date(`${normalizedInputDate}T23:59:59.999Z`),
        },
      });

      const price = await translate('Ticket Price', { to: lang });
const timing = await translate('Timing', { to: lang });

// const translatedEvents = await Promise.all(
//   events.map(async (event) => {
//     const translatedName = await translate(event.eventName, { to: lang });

//     return {
//       eventDate: normalizedInputDate,
//       eventTicketPrice: `${price.text} :₹ ${event.eventTicketPrice}`, // Fixed template literal usage
//       eventTime: `${timing.text} : ${event.eventTime}`, // Fixed template literal usage
//       eventName: translatedName.text,
//       evId: event._id,
//       enName:event.eventName,
//       eventTotalTicketsAvailable:event.eventTotalTicketsAvailable
//     };
//   })
// );

const translatedEvents = await Promise.all(
  events
    .filter((event) => event.eventTotalTicketsAvailable > 1) // Filter events with tickets available > 1
    .map(async (event) => {
      const translatedName = await translate(event.eventName, { to: lang });

      return {
        eventDate: normalizedInputDate,
        eventTicketPrice: `${price.text} :₹ ${event.eventTicketPrice}`, // Fixed template literal usage
        eventTime: `${timing.text} : ${event.eventTime}`, // Fixed template literal usage
        eventName: translatedName.text,
        evId: event._id,
        enName: event.eventName,
        eventTotalTicketsAvailable: event.eventTotalTicketsAvailable,
        ticketPrice:event.eventTicketPrice
      };
    })
);


      
      
      return translatedEvents; 
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };


  const dateToTimestamp = (dateString) => {
    // Split the date string into day, month, and year
    const [day, month, year] = dateString.split('/');
  
    // Create a Date object using the parsed values
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
  
    // Return the timestamp
    return date.getTime();
  };


  app.post('/api/buy-ticket-Event', authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Assuming a static user ID for now
    const { eventid, selectedPersons, selectedDate, monuId } = req.body; // Extract data from the request body
  
    console.log( selectedDate);
    // console
 
    try {
      // Find the event by ID
      const event = await Event.findOne({ _id: eventid, MonumentId: monuId });
      if (!event) return res.status(404).json({ msg: 'Event not found' });
  
      // Validate number of persons
      const persons = parseInt(selectedPersons, 10);
      if (!persons || persons <= 0) {
        return res.status(400).json({ msg: 'Invalid number of persons' });
      }
      if (event.eventTotalTicketsAvailable < persons) {
        return res.status(400).json({ msg: 'Not enough tickets available' });
      }
  
      // Parse and validate selectedDate
      const parsedDate = dateToTimestamp(selectedDate);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ msg: 'Invalid selected date' });
      }
  
      // Create an array to hold the tickets
      const tickets = [];
      const tick = [];
  
      for (let i = 0; i < persons; i++) {
        // Generate a unique hexadecimal ticket number
        const ticketNo = crypto.randomBytes(8).toString('hex'); // Generates a unique 32-character hex string
  
        // Calculate ExpirationDate as 24 hours after the selectedDate
        const expirationDate = (parsedDate + 24 * 60 * 60 * 1000);
  
        // Create a new ticket using the Ticket schema
        const ticket = new Ticket({
          ticketNo: ticketNo,
          MonumentId: monuId,
          eventId: event._id, // Reference to the event
          userId: userId, // Reference to the user
          price: event.eventTicketPrice, // Fetching the price from the event
          // purchasedAt: Date.now(), // Timestamp of when the ticket was purchased
          ExpirationDate: expirationDate, // Ticket expiration is 24 hours later
          selectedDate: parsedDate // Storing the parsed selected date for the ticket
        });
  
        // Save the ticket to the database
        await ticket.save();
  
        // Add the ticket to the array
        tickets.push(ticket._id);
        tick.push(ticket);
      }
  
      // Update the user's myTickets array with all purchased tickets
      await User.updateOne(
        { _id: userId },
        { $push: { myTickets: { $each: tickets } } } // Use $each to push an array of ticket IDs
      );

      await Agency.updateOne(
        { _id: monuId },
        { $push: { tickets: { $each: tickets } } } // Use $each to push an array of ticket IDs
      );

      const user=await User.findOne({_id:userId})
  
      // Update the event to decrement the available tickets
      await Event.findByIdAndUpdate(
        eventid,
        { $inc: { eventTotalTicketsAvailable: -persons } }, // Decrement available tickets by number of persons
        { new: true } // Return the updated document
      );

      await handleIncrementRevenue(selectedDate,persons,event.eventTicketPrice,monuId);
 
      res.status(201).json({ msg: `${persons} tickets purchased successfully`, tickets: tick,time:event.eventTime,name:user.name});
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  const  handleIncrementRevenue=async(selectedDate,totalPersons,ticketPrice,monuId)=>{
    try{
      const agency = await Agency.findOne({ _id: monuId });
      if (!agency) return res.status(404).json({ msg: 'Event not found' });

       await agency.updateRevenueAndBookings(selectedDate, totalPersons, ticketPrice);
       return;
    }catch(error){
      console.error('Error fetching events:', error);
      throw error;
    }
  }


  app.post('/api/buy-ticket-Regular', authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Assuming a static user ID for now
    const { selectedPersons, selectedDate, monuId } = req.body; // Extract data from the request body
  
    console.log( selectedPersons, selectedDate);
  
    try {
      // Find the event by ID
      const agency = await Agency.findOne({ _id: monuId });
      if (!agency) return res.status(404).json({ msg: 'Event not found' });
  
      // Validate number of persons
      const persons = parseInt(selectedPersons, 10);
      if (!persons || persons <= 0) {
        return res.status(400).json({ msg: 'Invalid number of persons' });
      }
      if (agency.totalAvailableTicket < persons) {
        return res.status(400).json({ msg: 'Not enough tickets available' });
      }
  
      // Parse and validate selectedDate
     const parsedDate = dateToTimestamp(selectedDate);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ msg: 'Invalid selected date' });
      }
  
      // Create an array to hold the tickets
      const tickets = [];
      const tick = [];
  
      for (let i = 0; i < persons; i++) {
        // Generate a unique hexadecimal ticket number
        const ticketNo = crypto.randomBytes(8).toString('hex'); // Generates a unique 32-character hex string
  
        // Calculate ExpirationDate as 24 hours after the selectedDate
        const expirationDate = (parsedDate + 24 * 60 * 60 * 1000);
  
        // Create a new ticket using the Ticket schema
        const ticket = new Ticket({
          ticketNo: ticketNo,
          MonumentId: monuId,
           // Reference to the event
          userId: userId, // Reference to the user
          price: agency.ticketPrice, // Fetching the price from the event
          purchasedAt: Date.now(), // Timestamp of when the ticket was purchased
          ExpirationDate: expirationDate, // Ticket expiration is 24 hours later
          selectedDate: parsedDate // Storing the parsed selected date for the ticket
        });
  
        // Save the ticket to the database
        await ticket.save();
  
        // Add the ticket to the array
        tickets.push(ticket._id);
        tick.push(ticket);
      }


  
      // Update the user's myTickets array with all purchased tickets
      await User.updateOne(
        { _id: userId },
        { $push: { myTickets: { $each: tickets } } } // Use $each to push an array of ticket IDs
      );

      await Agency.updateOne(
        { _id: monuId },
        { $push: { tickets: { $each: tickets } } } // Use $each to push an array of ticket IDs
      );

      const user=await User.findOne({_id:userId})
  
      // Update the event to decrement the available tickets
      await Agency.findByIdAndUpdate(
        monuId,
        { $inc: { totalAvailableTicket: -persons } }, // Decrement available tickets by number of persons
        { new: true } // Return the updated document
      );

      await handleIncrementRevenue(selectedDate,persons,agency.ticketPrice,monuId);
      console.log(agency.timing,user.name)
  
      res.status(201).json({ msg: `${persons} tickets purchased successfully`, tickets: tick,time:agency.timing,name:user.name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  




// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/agency', Monument);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});