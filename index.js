const express = require('express');
const genres = require('./routes/genre');
const customers = require('./routes/customer');
const movies = require('./routes/movie');
const rentals = require('./routes/rentals');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const { db } = require('./models/db');
const app = express()

app.use(express.json());
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)

const hostname = "127.0.0.1"
const port = process.env.PORT || 5000


app.listen(port, () =>{
    console.log(`Server instance running on http://${hostname}:${port}`);
})