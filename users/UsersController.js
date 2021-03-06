const express = require("express");
const router = express.Router();
const User = require("./User")

router.get("/admin/users", (req, res) => {
    res.send("Listagem de usuários");
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
});

router.post("/users/create", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    res.json({email, password})
})

module.exports = router;