const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');

const customerRoutes = require('./routes/customerRoutes');
const taskerRoutes = require('./routes/taskerRoutes');
const guestRoutes = require('./routes/guestRoutes');
const walletRoutes = require('./routes/walletRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressRoutes');
const searchRoutes = require('./routes/searchRoutes');

const db = require('./config/db');

// LOAD ENV VARIABLES
dotenv.config();

// CREATE EXPRESS APP
const app = express();

// MIDDLEWARE
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

console.log('Server starting...');

// ROUTES
app.use('/api/customers', customerRoutes);
app.use('/api/taskers', taskerRoutes);
app.use('/api/guest', guestRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/search', searchRoutes);

console.log('Guest routes mounted');

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('API is running');
});

// CORS TEST ROUTE
app.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS test route working'
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await db.query('SELECT 1');
    console.log(`Server running on port ${PORT}`);
    console.log('MySQL Connected');
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }
});