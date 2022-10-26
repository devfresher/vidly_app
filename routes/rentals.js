const router = require("express").Router();
const auth = require("../middleware/auth");
const { Customer } = require("../models/customer");
const { db } = require("../startup/db");
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");


router.get("/", async (req, res) => {
    const rental = await Rental.find().sort({ dateOut: -1 })
    if (!rental || rental == "") return res.status(404).json("No resource found")
    
    res.json(rental)
})

router.get("/:id", async(req, res) => {
    const rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(404).json("Resource not found")
    
    res.json(rental);
})

router.post("/", auth, async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send("Invalid Customer Id supplied")

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send("Invalid Movie Id supplied")

    if(movie.numberInStock === 0) return res.status(400).send("Movie not in stock");

    const rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        }, 
        movie: {
            _id: movie._id,
            name: movie.name,
            dailyRentalRate: movie.dailyRentalRate,
            numberInStock: movie.numberInStock
        }
    })

    const transaction = await db.startSession()
    transaction.startTransaction()
    try {
        await rental.save()

        movie.numberInStock --
        await movie.save()

        await transaction.commitTransaction();
        res.json(rental)
    } catch (error) {
        await transaction.abortTransaction()
        res.status(500).send(error)
    }


})

router.put("/:id", auth, async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const rental = await Rental.findByIdAndUpdate(req.params.id, {name : req.body.name}, {
        new: true
    })
    if (!rental) return res.status(404).json("Resource not found")

    res.json(rental);
});

router.delete("/:id", auth, async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id)
    if (!rental) return res.status(404).json("Resource not found")

    res.send(rental)
})

module.exports = router
