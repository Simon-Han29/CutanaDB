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
            } else {
                console.log(response.status)
            }
        })
        .then((currentSeasonalAnime) => {
            console.log("In seasonal now")
            console.log(req.session);
            res.status(200).json(currentSeasonalAnime);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        })
})

router.get("/seasonal/:year/:season", (req, res) => {
    if (req.params.year === 0 && req.season.params === "none") {
        res.status(204).send({"pagination": {}, "data": []})
    } else {
        fetch(`${BASE_URL}/seasons/${req.params.year}/${req.params.season}`)
        .then((response) => {
            console.log(response.status);
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                console.log("Error with the API handling request")
                response.status(400).send();
            } else {
                console.log(response.status)
                
            }
        })
        .then((animeFromSeason) => {
            res.status(200).json(animeFromSeason);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        })
    }

})

router.get("/seasons", (req, res) => {
    fetch(`${BASE_URL}/seasons`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                res.status(400).send();
            } else {
                res.status(500).send();
            }
        })
        .then((seasons) => {
            res.status(200).json(seasons);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        })
})

router.get("/top", (req, res) => {
    fetch(`${BASE_URL}/top/anime`)
        .then((response) => {
            console.log(response.status)
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                res.status(400).send();
            } else {
                res.status(500).send();
            }            
        })
        .then((topAnime) => {
            res.status(200).json(topAnime)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        })

})

router.get("/search", (req, res) => {
    const searchTerm = req.query.q;
    fetch(`${BASE_URL}/anime?q=${searchTerm}`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                res.status(400).send();
            } else {
                res.status(500).send();
            }  
        })
        .then((searchResults) => {
            res.status(200).json(searchResults)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        })
})

router.get("/:id", (req, res) => {
    console.log(req.params.id)
    const id = req.params.id;
    fetch(`${BASE_URL}/anime/${id}`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                res.status(400).send();
            } else {
                res.status(500).send();
            } 
        })
        .then((searchResults) => {
            res.status(200).json(searchResults)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        })
})

module.exports = router;