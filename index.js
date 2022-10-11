const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genre');
const customers = require('./routes/customer');

const app = express()

mongoose.connect(config.get('dbConfig.url'))
    .then(() => {console.log("Connected to DB");})
    .catch((err) => {console.log("Error connecting to the DB", err);})

app.use(express.json());
app.use('/api/genres', genres)
app.use('/api/customers', customers)

const hostname = "127.0.0.1"
const port = process.env.PORT || 5000


app.listen(port, () =>{
    console.log(`Server instance running on http://${hostname}:${port}`);
})