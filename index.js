const Joi = require('joi')
const express = require('express')

const app = express()
app.use(express.json());

const hostname = "127.0.0.1"
const port = process.env.PORT || 5000

let genres = [
    {
        id: 1,
        title: "Romance",
        created: Date.now(),
    },
    {
        id: 2,
        title: "Fiction",
        created: Date.now(),
    },
    {
        id: 3,
        title: "Non Fiction",
        created: Date.now(),
    }
]

const schema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(255)
        .required(),
})

function validateGenre(genre) {
    return schema.validate(genre);
}

app.get("/api/genres", (req, res) => {
    if (!genres || genres == "") return res.json("No resource found").status(404)
    res.json(genres)
})

app.get("/api/genres/:id", (req, res) => {
    let genre = genres.find(g => g.id == parseInt(req.params.id))
    if (!genre || genre == "") return res.json("Resource not found").status(404)

    res.json(genre);
})

app.post("/api/genres", (req, res) => {
    let {error} = validateGenre(req.body);
    if (error) return res.json(error.details[0].message).status(400)

    let genre = {
        id: genres.length + 1,
        title: req.body.title,
        created: Date.now()
    }

    genres.push(genre);
    res.json(genre)
})

app.put("/api/genres/:id", (req, res) => {
    let genre = genres.find(g => g.id == parseInt(req.params.id))
    if (!genre || genre == "") return res.json("Resource not found").status(404)

    genre.title = req.body.title
    res.json(genre)
});

app.delete("/api/genres/:id", (req, res) => {
    let genre = genres.find(g => g.id == parseInt(req.params.id))
    if (!genre || genre == "") return res.json("Resource not found").status(404)

    genreIndex = genres.indexOf(genre);
    genres.splice(genreIndex, 1)
    res.json(genre)
})

app.listen(port, () =>{
    console.log(`Server instance running on http://${hostname}:${port}`);
})