// server.js
const dotenv = require('dotenv');
const express = require('express');
const functions = require('@google-cloud/functions-framework');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Agency = require('./models/agency'); 
const Event=require("./models/event");
const cookieParser = require('cookie-parser');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const {User,Otp} = require('./models/user');
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/logoUrl', express.static(path.join(__dirname, 'uploads/companyLogo')));
app.use('/imageUrl', express.static(path.join(__dirname, 'uploads/monuImages')));
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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401); // Unauthorized
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
}
app.get("/fetchmuseumfamilyevents", async(req,res)=>{
  try{
   const results = await Agency.aggregate([
      { $sample: { size: 5 } },  // Randomly selects 2 documents
      { $sort: { ticketPrice: 1 } } ,
    ]);
res.json(results);
  }
  catch{
res.json("error");
  }
})
app.get("/fetchmuseumStudentevents", async (req, res) => {
  try {
    const results = await Agency.aggregate([
      { $sample: { size: 5 } },  // Randomly selects 2 documents
      { $sort: { ticketPrice: 1 } }  // Sorts by ticketPrice in ascending order
    ]);
    console.log(results);
    res.json(results); // Send the results as JSON
  } catch (error) {
    console.error("Error fetching student events:", error);
    res.status(500).json({ message: "Error fetching events" }); // Return an error message if something goes wrong
  }
});
app.get("/fetchmuseumSoloevents", async (req, res) => {
  try {
    const results = await Agency.aggregate([
      { $sample: { size: 5 } },  // Randomly selects 2 documents
      { $sort: { ticketPrice: 1 } }  // Sorts by ticketPrice in ascending order
    ]);
    console.log(results);
    res.json(results); // Send the results as JSON
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

// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/agency', Monument);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
