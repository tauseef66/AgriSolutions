// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./swagger/swagger');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const yieldRoutes =require('./routes/yieldRoutes')
// const cropRoutes =require('./routes/cropRoutes')
// const fertilizerRoutes =require('./routes/fertilizerRoutes')
// const predictionRoutes = require('./routes/predictionRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Swagger Documentation
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api', yieldRoutes);
// app.use('/api', cropRoutes);
// app.use('/api', fertilizerRoutes);
// app.use('/api/predictions', predictionRoutes);
// app.use('/api/reviews', reviewRoutes);
// // Default route
// app.get('/', (req, res) => {
//   res.send('MERN Auth API is running!');
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// module.exports = app;






const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const yieldRoutes = require('./routes/yieldRoutes');
const cropRoutes = require('./routes/cropRoutes');
const fertilizerRoutes = require('./routes/fertilizerRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
require('dotenv').config();

const app = express();

/** ====== OPEN CORS (ALLOW ALL) ====== **/
app.use(cors({
  origin: '*', // allow requests from anywhere
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // can't be true if origin is '*'
}));

// Handle preflight for all routes
app.options('*', cors());

/** ====== Middleware ====== **/
app.use(express.json());

/** ====== Swagger Docs ====== **/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/** ====== MongoDB Connection ====== **/
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

/** ====== Routes ====== **/
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', yieldRoutes);
app.use('/api', cropRoutes);
app.use('/api', fertilizerRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/reviews', reviewRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('MERN Auth API is running!');
});

/** ====== Error Handling ====== **/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

module.exports = app;