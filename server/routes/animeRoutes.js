const express = require("express")
const router = express.Router();

const BASE_URL = 'https://api.jikan.moe/v4'

router.get("/seasonal/now", (req, res) => {
    console.log("in seasonal/now")
    res.status(200).send(JSON.stringify("I WANT TO FIGHT WIZ  MAYWEZER WOO"));
})

router.get("/:id", (req, res) => {
    console.log(req.params.id)
})

module.exports = router;