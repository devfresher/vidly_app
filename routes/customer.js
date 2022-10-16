const router = require("express").Router();
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 })
    if (!customers) return res.status(404).json("No resource found")

    res.json(customers)
})

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).json("Resource not found")

    res.json(customer);
})

router.post("/", async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })
    
    await customer.save()
    res.json(customer)
})

router.put("/:id", async (req, res) => {
    let { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { new: true })

    if (!customer) return res.status(404).json("Resource not found")

    res.json(customer);
});

router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if (!customer) return res.status(404).json("Resource not found")

    res.send(customer)
})

module.exports = router