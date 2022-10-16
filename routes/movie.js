const router = require("express").Router();
const auth = require("../middleware/auth");
const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort({ name: 1 })
    if (!movies || movies == "") return res.status(404).json("No resource found")
    
    res.json(movies)
})

router.get("/:id", async(req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).json("Resource not found")
    
    res.json(movie);
})

router.post("/", auth, async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send("Invalid Genre Id supplied")

    const movie = new Movie({ 
        name: req.body.name,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    })
    await movie.save()
    res.json(movie)
})

router.put("/:id", auth, async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send("Invalid Genre Id supplied")

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    }, {new: true})
    if (!movie) return res.status(404).json("Resource not found")

    res.json(movie);
});

router.delete("/:id", auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if (!movie) return res.status(404).json("Resource not found")

    res.send(movie)
})

module.exports = router
