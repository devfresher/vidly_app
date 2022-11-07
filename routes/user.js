const _ = require('lodash');
const mongoose = require('mongoose');
const winston = require('winston/lib/winston/config');
const auth = require('../middleware/auth');
const router = require("express").Router();
const { User, validate, hashPassword, validateUpdate } = require("../models/user");


router.get("/", async (req, res) => {
    const users = await User.find().sort({ name: 1 })
    if (!users.length) return res.status(204).json("No content")

    res.json(users)
})

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json("Resource not found")

    res.json(user);
})

router.get("/:id", async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) 
        return res.status(400).send('Invalid User Id')

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json("Resource not found")

    res.json(user);
})


router.post("/",  async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send("Email already exit")

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    user.password  = await hashPassword(req.body.password)
    await user.save()

    const token  = user.generateAuthToken()

    res.header('x-auth-token', token).json(_.pick(user, ['_id', 'name', 'email']))
})

router.put("/:id", auth, async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send("Invalid userId")

    let { error } = validateUpdate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const user = await Genre.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
    }, { new: true })

    if (!user) return res.status(404).json("Resource not found")

    res.json(user);
});

router.delete("/:id", auth, async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(404).json("Resource not found")

    res.send(user)
})

module.exports = router