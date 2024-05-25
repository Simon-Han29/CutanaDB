const express = require("express")
const router = express.Router();

const BASE_URL = 'https://api.jikan.moe/v4'

router.get("/seasonal/now", (req, res) => {
    console.log("in /api/anime/seasonal/now")
    fetch(`${BASE_URL}/seasons/now`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                console.log("Error with the API handling request")
                response.status(400).send();
            }
        })
        .then((currentSeasonalAnime) => {
            res.status(200).json(currentSeasonalAnime);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        })
})

router.get("/seasons", async (req, res) => {
    try {
        let response = await fetch(`${BASE_URL}/seasons`);
        let data;
        if (response.status === 200) {
            data = await response.json();
        } else if (response.status === 400) {
            throw new Error("Bad request")
        } else {
            throw new Error("Server Error")
        }

        res.status(200).json(data);
    } catch(err) {
        res.status(500).send();
    }
})

router.get("/:id", (req, res) => {
    console.log(req.params.id)
})

module.exports = router;