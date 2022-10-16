const config = require('config');
const express = require('express');
const app = express()

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Routes
const genres = require('./routes/genre');
const customers = require('./routes/customer');
const movies = require('./routes/movie');
const rentals = require('./routes/rentals');
const users = require('./routes/user');
const auth = require('./routes/auth')

app.use(express.json());
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users/', users)
app.use('/api/auth/', auth)

// Models
const { db } = require('./models/db');

const hostname = "127.0.0.1"
const port = config.get("port") || 5000


app.listen(port, () =>{
    console.log(`Server instance running on http://${hostname}:${port}`);
})