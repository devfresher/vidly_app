const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const validate = require("../middleware/validate");
const router = require("express").Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send("Rental not found")

    if(rental.dateReturned) return res.status(400).send("Return already processed")

    rental.return()
    await rental.save()

    const movie = await Movie.findById(req.body.movieId)
    movie.increaseStock()
    await movie.save()

    return res.status(200).send(rental)
})

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    })

    return schema.validate(req);
}

module.exports = router