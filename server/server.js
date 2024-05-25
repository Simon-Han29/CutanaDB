const express = require("express")
const app = express();
const cors = require("cors")
const PORT = 8080;
const animeRoutes = require("./animeRoutes")
const mangaRoutes = require("./mangaRoutes")
app.use(cors())
app.use(express.json())
app.get("/api/home", (req, res) => {
    res.json([{message: "Hello world"}])
})

app.use("/api/anime", animeRoutes)
app.use("/api/manga", mangaRoutes)

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)
}) 