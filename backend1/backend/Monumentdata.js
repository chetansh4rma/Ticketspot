const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Agency = require('./models/agency'); // Import the Agency model
const Event = require('./models/event'); // Import the Agency model
const {Otp} = require('./models/user');
const nodemailer=require('nodemailer')
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const Feedback =require('./models/feedback')

dotenv.config(); // Load environment variables

const router = express.Router(); // Initialize router

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Fallback for dev


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





// Define the multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'companyLogo/'); // Folder to store the images
  },
  filename: function (req, file, cb) {
    const randomNumber = crypto.randomInt(1000, 9999);
    const uniqueSuffix = `${req.body.agencyName}-${randomNumber}-${Date.now()}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // File name: agencyName-randomNumber-timestamp.extension
  }
});

// Define the file filter for image files
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
  }
}).single('monumentLogo'); // Field name for file upload




// Register Route
router.post('/register', (req, res) => {
  console.log(req.file);
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ error: err.message });
    }

    // Extract other fields from the request
    const { agencyName, email, password, contactNumber, monumentName } = req.body;

    const street = req.body['location.street'];
    const city = req.body['location.city'];
    const state = req.body['location.state'];
    const zipCode = req.body['location.zipCode'];

// Create the location object
const location1 = {
  street,
  city,
  state,
  zipCode,
};


    try {
      // Check if email is already registered
      const existingAgency = await Agency.findOne({ email });
      if (existingAgency) {
        return res.status(400).json({ error: 'Agency with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new agency with the uploaded file path
      const newAgency = new Agency({
        agencyName,
        email,
        password: hashedPassword,
        contactNumber,
        MonumentLogo: req.file ? req.file.filename : '', // Store the file name if uploaded
       MonumentName: monumentName,
        location:location1,
      });

      // Save to the database
      await newAgency.save();

      // Generate OTP
      const otpCode = crypto.randomInt(1000, 9999).toString();
      const otp = new Otp({ email, otp: otpCode });
      await otp.save();

      // Send OTP via email
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otpCode}`,
      });

      res.status(201).json({ message: 'OTP is sent to your email', agencyId: newAgency._id });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
});


router.post('/verify-otp', async (req, res) => {
  const { email, otpCode } = req.body;
  console.log(email,otpCode)
  try {
    const otpRecord = await Otp.findOne({ email, otp: otpCode });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    
    await Agency.updateOne({ email }, { isVerified: true });

    
    await Otp.deleteOne({ email, otp: otpCode });

    const agency = await Agency.findOne({ email: email });


    const payload = { agencyId: agency._id};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: false,   // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: 'Strict', // Controls whether cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time in milliseconds
    });



    res.status(201).json({ message: 'Agency registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
});





// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the agency exists
    const agency = await Agency.findOne({ email });
    if (!agency) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const payload = { agencyId: agency._id};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: false,   // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
      sameSite: 'Strict', // Controls whether cookies are sent with cross-site requests
      maxAge: 3600000, // Cookie expiry time in milliseconds
    });
    res.status(201).json({ msg: 'Agency registered successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



function authenticateToken(req, res, next) {

  const token = req.cookies.token;
  // console.log(req)
  if (token == null) return res.sendStatus(401); // Unauthorized
  
  
  jwt.verify(token, process.env.JWT_SECRET, (err, agency) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.agency = agency;
    next();
  });
}

router.get('/agencydetails', authenticateToken, async (req, res) => {
  try {
    const user = await Agency.findById(req.agency.agencyId).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const monument = await Agency.findById(req.agency.agencyId);
    // await monument.incrementBookingCount('2024-1-12',12);
    // await monument.incrementBookingCount('2024-2-12',10);
    // await monument.incrementBookingCount('2024-3-12',4);
    // await monument.incrementBookingCount('2024-4-12',3);
    // await monument.incrementBookingCount('2024-5-12',4);
    // await monument.incrementBookingCount('2024-6-12',4);
    // await monument.incrementBookingCount('2024-7-12',8);
    // await monument.incrementBookingCount('2024-8-12',4);
    // await monument.incrementBookingCount('2024-9-12',1);
    // await monument.incrementBookingCount('2024-10-12',4);
    // await monument.incrementBookingCount('2024-11-12',6);
    // await monument.incrementBookingCount('2024-12-12',4);
    
    // await monument.incrementBookingCount('2024-4-12',4);
    // await monument.incrementBookingCount('2024-5-12',4);
    // await monument.incrementBookingCount('2024-6-12',4);
    // await monument.incrementBookingCount('2024-7-12',4);
    // await monument.incrementBookingCount('2024-8-12',4);

    // await monument.incrementBookingCount('2024-11-12',6);
    // await monument.incrementBookingCount('2024-12-12',2);

    

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Endpoint to get bookings for an agency
router.get('/fetch-bookings',authenticateToken, async (req, res) => {
  try {
    
    
    // Find the agency by ID
    const agency = await Agency.findById(req.agency.agencyId);
    if (!agency) {
      return res.status(404).json({ msg: 'Agency not found' });
    }

    // Return the bookings data
    res.status(200).json({ bookings: agency.bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});





// Create Event Route
router.post('/event-creation',authenticateToken, async (req, res) => {
     
    const monumentId = req.agency.agencyId; // Extract the monument ID from the URL
    const { eventName,eventCategory, totalTicketsAvailable, eventDate, eventTime, ticketPrice, description,refreshments } = req.body;
    console.log(req.agency)
    try {
      // Find the agency (monument) by ID
      const monument = await Agency.findOne({_id:monumentId});
      if (!monument) {
        return res.status(404).json({ error: 'Agency (Monument) not found' });
      }
  
      // Create a new event linked to this agency
      const newEvent = new Event({
        eventName,
        eventCategory,
        MonumentId: monumentId, // Link the event to the monument
        totalTicketsAvailable,
        eventDate,
        eventTime,
        ticketPrice,
        description,
        refreshments
      });
  
      // Save the event to the database
      const savedEvent = await newEvent.save();
  
      // Optionally, you can push the event ID to an events array in the monument if needed
      if (!monument.events) {
        monument.events = []; // Initialize if it doesn't exist
      }
      monument.events.push(savedEvent._id);
      await monument.save();
  
      res.status(201).json({
        message: 'Event created successfully',
        event: savedEvent,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });


  


  // show events
  router.get('/events-show', authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const MonumentId = req.agency.agencyId;
  
    try {
      // Fetch events for the specified monument, sorted by createdAt (latest first)
      const events = await Event.find({ MonumentId: MonumentId })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (-1)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
  
    
  
      res.status(200).json({
        events  
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });



  // delete event

  router.delete('/events-delete/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const monumentId = req.agency.agencyId; // Extract MonumentId from authenticated token or request
    // console.log(id," ",monumentId)
    try {
      // Find the monument by MonumentId and ensure the event is linked to this monument
      const monument = await Agency.findOneAndUpdate(
        { _id: monumentId, events: id }, // Find monument by MonumentId where event ID exists
        { $pull: { events: id } }, // Remove the event ID from the events array
        { new: true } // Return the updated monument
      );
  
      if (!monument) {
        return res.status(404).json({ error: 'Monument not found or event not linked to this monument' });
      }
  
      // Delete the event
      await Event.findOneAndDelete({_id:id});
  
      res.status(200).json({
        message: 'Event deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

  // show competitors

  router.get('/competitors-show', authenticateToken, async (req, res) => {
    const { page = 1, limit = 6 } = req.query;
    const MonumentId = req.agency.agencyId;

    try {
        // Get the city of the agency making the request
        const loc = await Agency.findOne({ _id: MonumentId }, { 'location.city': 1 });
        const city = loc?.location?.city;

        // Check if city is found
        if (!city) {
            return res.status(404).json({ message: 'City not found.' });
        }

        // Pagination setup
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        // Find agencies in the specified city
        const agencies = await Agency.find({ 'location.city': city, _id: { $ne: MonumentId }})
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        // Check if agencies were found
        if (agencies.length === 0) {
            return res.status(404).json({ message: 'No agencies found in this city.' });
        }

        // Prepare the response data
        const responseData = [];

        for (const agency of agencies) {
            // Get the first event ID if it exists
            const firstEventId = agency.events[0];

            let eventTime = 'N/A';
            let ticketPrice = 0;

            // Fetch the first event details if it exists
            if (firstEventId) {
                const event = await Event.findOne({_id:firstEventId}).select('eventTime ticketPrice');
                if (event) {
                    eventTime = event.eventTime || 'N/A';
                    ticketPrice = event.ticketPrice || 0;
                }
            }

            responseData.push({
                agencyName: agency.MonumentName, // Assuming MonumentName is the agency name
                monumentName: agency.MonumentName, // Assuming MonumentName is the same as monument name
                eventTime,
                ticketPrice,
                url:agency.MonumentLogo
            });
        }

        // Send response
        res.status(200).json({
            competitors: responseData,
        });
    } catch (error) {
        console.error('Error fetching agencies:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// get reviews


router.get('/show-review', authenticateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 3; // Default limit
  const page = parseInt(req.query.page) || 1; // Default page
  const skip = (page - 1) * limit; // Calculate skip
  const MonumentId = req.agency.agencyId;
  console.log(MonumentId)

  try {
    const totalFeedbacks = await Feedback.countDocuments(); // Total number of feedbacks
    const feedbacks = await Feedback.find({MonumentId:MonumentId})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit).exec(); // Paginate with skip and limit
    console.log(feedbacks)
    res.json({
      reviews: feedbacks,
      total: totalFeedbacks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback data.' });
  }
});


router.get('/fetch-revenue', authenticateToken, async (req, res) => {
  const agencyId = req.agency.agencyId;
  try {
    
    console.log(agencyId)
    // Find the agency by ID
    const agency = await Agency.findById(agencyId);
    

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    

    // Get current date, month, and year
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const currentMonthYear = `${currentMonth} ${currentYear}`;

    // Find current month's booking count
    const currentMonthBooking = agency.bookings.find(booking => booking.month === currentMonthYear);

    // If no bookings for the current month, return 0
    const bookingCount = currentMonthBooking ? currentMonthBooking.count : 0;

    // Calculate total revenue by fetching the ticket price of the first event
    let totalRevenue = 0;

    if (bookingCount > 0 && agency.events.length > 0) {
      // Get the first event ID from the agency's events array
      const firstEventId = agency.events[0];

      // Fetch the event by ID to get the ticket price
      const event = await Event.findById(firstEventId);
      console.log(event,firstEventId)
      if (event) {
        
        totalRevenue = event.ticketPrice * bookingCount; // Calculate total revenue
      }
    }

    res.json({
      currentMonth: currentMonthYear,
      bookingCount,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


  
module.exports = router;
