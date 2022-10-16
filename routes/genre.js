const router = require("express").Router();
const { Genre, validate } = require("../models/genre");

router.get("/", async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 })
    if (!genres || genres == "") return res.status(404).json("No resource found")
    
    res.json(genres)
})

router.get("/:id", async(req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).json("Resource not found")
    
    res.json(genre);
})

router.post("/", async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const genre = new Genre({ name: req.body.name })
    await genre.save()

    res.json(genre)
})

router.put("/:id", async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name : req.body.name}, {
        new: true
    })
    if (!genre) return res.status(404).json("Resource not found")

    res.json(genre);
});

router.delete("/:id", async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).json("Resource not found")

    res.send(genre)
})

module.exports = router
