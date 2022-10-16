const router = require("express").Router();
const { User, validate } = require("../models/user");
lodash

router.get("/", async (req, res) => {
    const users = await User.find().sort({ name: 1 })
    if (!users) return res.status(404).json("No resource found")

    res.json(users)
})

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json("Resource not found")

    res.json(user);
})

router.post("/", async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send("Email already exit")

    const hashedPassword = req.body.password

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    
    await user.save()
    res.json(user)
})

router.put("/:id", async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)
});

router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(404).json("Resource not found")

    res.send(user)
})

module.exports = router