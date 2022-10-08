const Joi = require('joi')
const { Router } = require("express");
const router = Router();



router.get("/", (req, res) => {
    if (!genres || genres == "") return res.json("No resource found").status(404)
    res.json(genres)
})

router.get("/:id", (req, res) => {
    let genre = genres.find(g => g.id == parseInt(req.params.id))
    if (!genre || genre == "") return res.json("Resource not found").status(404)

    res.json(genre);
})

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
    let genre = genres.find(g => g.id == parseInt(req.params.id))
    if (!genre || genre == "") return res.json("Resource not found").status(404)

    genre.title = req.body.title
    res.json(genre)
});

router.delete("/:id", (req, res) => {
    let genre = genres.find(g => g.id == parseInt(req.params.id))
    if (!genre || genre == "") return res.json("Resource not found").status(404)

    genreIndex = genres.indexOf(genre);
    genres.splice(genreIndex, 1)
    res.json(genre)
})

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

function validateGenre(genre) {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(255)
            .required(),
    })

    return schema.validate(genre);
}


module.exports = router
