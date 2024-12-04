const express = require('express');
const cors = require('cors')
const app = express();

const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const errorMiddleware = require('./middlewares/errors');

// Setting up config file
dotenv.config({ path: 'config/.env' });

const corsOptions = {
    origin:['*','http://192.168.5.235:8081','http://192.168.5.234:8081', 'https://yourfrontenddomain.com'], // Add your frontend's URL here
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

// API routes
app.use('/api/v1', user);
app.use('/api/v1', event);
app.use('/api/v1', patient);
app.use('/api/v1', donor);
app.use('/api/v1', fridge);
app.use('/api/v1', inventory);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
