const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const eventRoutes = require('./controllers/eventControllers');
const organizationsRoutes = require('./controllers/organizationController');
const authRoutes = require('./controllers/authController');

const app = express();
dotenv.config();

mongoose.connect('mongodb://localhost:27017/event-booking-node', 
{useNewUrlParser: true},
() => console.log('Mongo db is connected'));

// middlewares
app.use(express.json());
 
// controller routes
app.use('/api/v1', eventRoutes);
app.use('/api/v1', organizationsRoutes);
app.use('/api/v1', authRoutes);


app.listen(process.env.PORT || 3000, () => console.log('App is running'));