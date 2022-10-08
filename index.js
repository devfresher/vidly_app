const express = require('express');
const genres = require('./routes/genre');

const app = express()
app.use(express.json());
app.use('/api/genres', genres)

const hostname = "127.0.0.1"
const port = process.env.PORT || 5000


app.listen(port, () =>{
    console.log(`Server instance running on http://${hostname}:${port}`);
})