// server.js
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const {User,Otp} = require('./models/user');
app.use(express.json());
app.use(cookieParser());

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



mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
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
