// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {User,Otp} = require('./models/user');

const router = express.Router();
const cors=require("cors")
const nodemailer=require('nodemailer')
const dotenv = require('dotenv');
const Event=require("./models/event");
const Ticket=require("./models/tickets");
const Monument=require("./models/agency")
const Feedback=require("./models/feedback")
const axios=require("axios");

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
   user: process.env.EMAIL,
   pass: process.env.EMAIL_PASS,
  },
 });

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password ,location} = req.body;
console.log(req.body);
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password,location });
    await user.save();


    // generate otp
    const otpCode = crypto.randomInt(1000, 9999).toString();
    const otp = new Otp({ email, otp: otpCode });
    await otp.save();

    // send mail
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otpCode}`,
    });



    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: false,   // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: 'Strict', // Controls whether cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time in milliseconds
    });

    res.status(201).json({ msg: 'Otp is sent to your mail' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


//verify otp
router.post('/verify-otp', async (req, res) => {
  const { email, otpCode } = req.body;
  console.log(email,otpCode)
  try {
    const otpRecord = await Otp.findOne({ email, otp: otpCode });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    
    await User.updateOne({ email }, { isVerified: true });

    
    await Otp.deleteOne({ email, otp: otpCode });

    const user = await User.findOne({ email: email });


    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: false,   // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: 'Strict', // Controls whether cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time in milliseconds
    });



    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
});




// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
console.log(req.body)
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: false,   // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: 'Strict', // Controls whether cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time in milliseconds
    });

   
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
function authenticateToken(req, res, next) {

  const token = req.cookies.token;
  console.log(req)
  if (token == null) return res.sendStatus(401); // Unauthorized
  
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
}



router.post('/userLocation', authenticateToken, async (req, res) => {
  try {
    const { street, city, state, zipCode, country } = req.body; // Extract location data from the request body

    // Find the user and update their location
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        location: {
          street,
          city,
          state,
          zipCode,
          country,
        },
      },
      { new: true, runValidators: true } // return the updated document and run validators
    ).select('-password'); // Exclude password

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({success:true,message:"Location is stored in DB"}); // Respond with the updated user data
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/userdetails', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Forgot Password Route
router.post('/sent-otp-forget',async(req,res)=>{
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

     // generate otp
     const otpCode = crypto.randomInt(1000, 9999).toString();
     const otp = new Otp({ email, otp: otpCode });
     await otp.save();
 
     // send mail
     await transporter.sendMail({
       from: process.env.EMAIL,
       to: email,
       subject: 'Your OTP Code',
       text: `Your OTP code is ${otpCode}`,
     });




    res.status(201).json({ msg: 'Otp is sent to your mail' });

  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
})


router.post('/verify-otp-forgot', async (req, res) => {
  const { email, otpCode } = req.body;
  console.log(email,otpCode)
  try {
    const otpRecord = await Otp.findOne({ email, otp: otpCode });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    
    await User.updateOne({ email }, { isVerified: true });

    
    await Otp.deleteOne({ email, otp: otpCode });


    res.status(201).json({ message: 'Now set new password!' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
});



router.post('/forget-pass', async (req, res) => {
  const { email,password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    
    user.password=password;
    await user.save();


    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: false,   // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: 'Strict', // Controls whether cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time in milliseconds
    });

    res.status(201).json({ message: 'Password changed Successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).send('Server error');
  }
});

// Buy Ticket Route

router.post('/buy-ticket',authenticateToken, async (req, res) => {
  const userId = req.user.userId ||"6708ab76b8eb6b9f753613cc"; // Assuming a static user ID for now
  const { eventid, selectedPersons, selectedDate } = req.body; // Extract data from the request body
  
  const chosenDate = new Date(selectedDate);



  // console.log(req.body, userId);

  try {
    // Convert selectedDate to a Date object
    

    // Get current date and calculate the maximum allowed date
    const currentDate = new Date();
    const fiveDaysFromNow = new Date(currentDate);
    fiveDaysFromNow.setDate(currentDate.getDate() + 5);

    // Validate the selected date
    if (chosenDate < currentDate || chosenDate > fiveDaysFromNow) {
      return res.status(400).json({ msg: 'Selected date must be within the next 5 days' });
    }

    // Find the event by ID
    const event = await Event.findById(eventid);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    // console.log(event)

    // Validate number of persons
    const persons = parseInt(selectedPersons, 10);
    if (!persons || persons <= 0) {
      return res.status(400).json({ msg: 'Invalid number of persons' });
    }
    if (event.totalTicketsAvailable < persons) {
      return res.status(400).json({ msg: 'Not enough tickets available' });
    }

    // Create an array to hold the tickets
    const tickets = [];

    const tick=[];
    for (let i = 0; i < persons; i++) {
      // Generate a unique hexadecimal ticket number
      const ticketNo = crypto.randomBytes(16).toString('hex'); // Generates a unique 32-character hex string

    

      // Create a new ticket using the Ticket schema
      const ticket = new Ticket({
        ticketNo: ticketNo,
        eventId: event._id, // Reference to the event
        userId: userId, // Reference to the user
        price: event.ticketPrice, // Fetching the price from the event
        purchasedAt: Date.now(), // Timestamp of when the ticket was purchased
        ExpirationDate: new Date(chosenDate.getTime() + 24 * 60 * 60 * 1000), // Ticket expiration is 24 hours later
        selectedDate: chosenDate // Storing the selected date for the ticket
      });

      // console.log(ticket," hello")

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

    // Update the event to decrement the available tickets
    await Event.findByIdAndUpdate(
      eventid,
      { $inc: { totalTicketsAvailable: -persons } }, // Decrement available tickets by number of persons
      { new: true } // Return the updated document
    );

    res.status(201).json({ msg: `${persons} tickets purchased successfully`, tickets:tick });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

/// Search Monument by Name
router.get('/search-monuments/:name', async (req, res) => {
  const { name } = req.params; // Get the name from the request parameters
  const { region, priceRange, category } = req.query; // Get additional filters from query parameters
console.log(req.query);
  console.log(`Searching for monuments with name starting with: ${name}`);
  
  try {
    // Create a regex pattern that matches the input as a prefix
    const regex = new RegExp('^' + name, 'i'); // Starts with the input, case-insensitive

    // Build the query for filtering
    const query = {
      MonumentName: { $regex: regex },
    };

    // Add region filter if provided
    if (region) {
      query['region'] = region; // Assuming 'region' is a field in your Monument model
    }

    // Add category filter if provided
    if (category) {
      query['category'] = category; // Assuming 'category' is a field in your Monument model
    }

    // Fetch monuments based on the built query
    let monuments = await Monument.find(query);

    if (monuments.length === 0) {
      return res.status(404).json({ msg: 'No monuments found for the specified name' });
    }

    // Implement price filtering if priceRange is provided
    if (priceRange) {
      const maxPrice = parseInt(priceRange, 10);
      monuments = monuments.filter(monument => monument.price <= maxPrice); // Assuming 'price' is a field in your Monument model
    }

    // Get the category of the first monument found
    const categoryResults = monuments.length > 0 ? monuments[0].category : null;

    // Find other monuments from the same category if applicable
    if (categoryResults) {
      const monumentsByCategory = await Monument.find({ category: categoryResults });
      // Combine the original search results with the category-based results
      monuments = [...monuments, ...monumentsByCategory];
    }

    res.status(200).json({ success: true, total: monuments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
// Existing imports and setup...
router.get('/Recommend', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token

  try {
    const tickets = await Ticket.find({ userId }).populate('eventId', 'MonumentName'); // Assuming eventId contains the MonumentName
    // Fetch tickets for the user

    // Check if any tickets were found
    if (tickets.length === 0) {
      // Fetch random 6 monuments when no tickets are found
      const randomMonuments = await Monument.aggregate([{ $sample: { size: 6 } }]);
      return res.json(randomMonuments); // Send the random monuments back to the client
    }

    // Extract the first monument name from tickets
    const firstMonumentName = tickets[0].eventId.MonumentName || "Golden Temple"; // Get the first ticket's monument name or set default
    console.log("first", firstMonumentName);

    // Send data to the recommendation API with the first monument name
    const response = await axios.post('http://127.0.0.1:5000/recommend', {
      user_id: userId,
      place: firstMonumentName // Pass the first monument name
    });

    // Get the recommendations from the response
    const recommendations = response.data.recommendations; // Assuming this structure

    // Fetch monument details based on the recommendations
    const monumentDetails = await Monument.find({ _id: { $in: recommendations } });

    // Send the monument details back to the client
    console.log(monumentDetails);
    res.json(monumentDetails);
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ message: 'Error fetching user tickets' });
  }
});
router.get('/mytickets', async (req, res) => {
  const userId ="6708ab5cef2fed484e6addbd" ; // Assuming req.user is populated by your verifyToken middleware
  try {
    console.log("User ID:", userId); // Log user ID for debugging
    // Find tickets for the logged-in user
    const tickets = await Ticket.find({ userId }); // Ensure that Ticket model has the userId field
    console.log(tickets);
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error while fetching tickets." });
  }
});


router.post('/events-detail', async (req, res) => {
  const { MonumentId } = req.body; // Extract eventId from the request body
 console

  try {
    // Get the current date and the date for 5 days later
    const currentDate = new Date();
    console.log(MonumentId,currentDate)
    const fiveDaysFromNow = new Date(currentDate);
    fiveDaysFromNow.setDate(currentDate.getDate() + 5);

    // Find the event by the provided event ID and make sure the event is within the date range
    let events = await Event.find({
      MonumentId: MonumentId,
      eventDate: { $gt: currentDate, $lte: fiveDaysFromNow } // Event must be within the date range
    }).limit(5);
    console.log(events)
    // If no event matches the criteria, get the first upcoming event in the collection
    if (!events || events.length==0) {
      events = await Event.find({ MonumentId: MonumentId }).sort({ eventDate: 1 }).limit(10);
    }

    console.log(events)

    // If no event is found, return a message
    if (!events) {
      return res.status(404).json({ msg: 'No upcoming events found' });
    }
     console.log(events)
    // Return the found event details
    return res.status(200).json({
      msg: 'Event details fetched successfully',
      events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});







router.get('/products/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the Monument document by ID while excluding certain fields
    const monument = await Monument.findById(id).select(
      '-tickets -bookings -guides -ticketPrice -totalAvailableTicket -totalRevenue -events -password'
    );

    if (!monument) {
      return res.status(404).json({ msg: 'Monument not found' });
    }

    // Return the monument details
    res.status(200).json({
      msg: 'Monument details fetched successfully',
      monument,
    });
  } catch (error) {
    console.error('Error fetching monument details:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


router.post('/reviews', authenticateToken, async (req, res) => {
  const { text, rating, id } = req.body; // Extract data from the request body
  const userId = req.user.userId; // Assuming `req.user` is set by authentication middleware

  // Fetch the user's name from the User collection
  let userName;
  try {
    const user = await User.findOne({ _id: userId }).select('name');
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }
    userName = user.name;
  } catch (error) {
    return res.status(500).json({ msg: 'Error fetching user details.' });
  }

  // Validation
  if (!userId) {
    return res.status(401).json({ msg: 'User must be logged in to submit feedback.' });
  }
  if (!id) {
    return res.status(400).json({ msg: 'Monument ID is required.' });
  }
  if (!text || !text.trim()) {
    return res.status(400).json({ msg: 'Feedback comment cannot be empty.' });
  }
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ msg: 'Rating must be a number between 1 and 5.' });
  }

  try {
    // Create a new feedback entry
    const feedback = new Feedback({
      userId,
      userName,
      MonumentId: id,
      rating,
      comment: text.trim(),
    });

    // Save the feedback to the database
    await feedback.save();

    res.status(200).json({ msg: 'Feedback submitted successfully!', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ msg: 'Server error while submitting feedback.' });
  }
});




module.exports = router;

