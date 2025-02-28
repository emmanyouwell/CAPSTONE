const express = require('express');
const cors = require('cors')
const app = express();

const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const checkExpiringMilk = require('./notifications/expirationChecker')
const newDonor = require('./notifications/newDonor')

const errorMiddleware = require('./middlewares/errors');

// Setting up config file
dotenv.config({ path: 'config/.env' });

const corsOptions = {
    origin:['*','http://localhost:5173','http://192.168.5.235:8081','http://192.168.5.234:8081', 'https://tchmb-portal.vercel.app'], // Add your frontend's URL here
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload()); // For handling file uploads

// Route Imports
const user = require('./routes/user');
const event = require('./routes/event');
const patient = require('./routes/patient');
const donor = require('./routes/donor');
const fridge = require('./routes/fridge');
const inventory = require('./routes/inventory');
const request = require('./routes/request');
const equipment = require('./routes/equipment');
const article = require('./routes/article')
const notification = require('./routes/notification');

// API routes
app.use('/api/v1', user);
app.use('/api/v1', event);
app.use('/api/v1', patient);
app.use('/api/v1', donor);
app.use('/api/v1', fridge);
app.use('/api/v1', inventory);
app.use('/api/v1', request);
app.use('/api/v1', equipment);
app.use('/api/v1', article);
app.use('/api/v1', notification);

// Middleware to handle errors
app.use(errorMiddleware);

// Notifications
checkExpiringMilk();
newDonor();

module.exports = app;
