const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = require("express").Router();
const { User, validateLogin } = require("../models/user");

router.post("/", async (req, res) => {
    let { error } = validateLogin(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid email or password")

    const isValidPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isValidPassword) return res.status(400).send("Invalid email or password")

    const token = user.generateAuthToken()
    res.json(token)
})

module.exports = router