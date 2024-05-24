const express = require("express")
const app = express();
const cors = require("cors")
const PORT = 8080;
const animeRoutes = require("./routes/animeRoutes")
app.use(cors())
app.use(express.json())
app.get("/api/home", (req, res) => {
    res.json([{message: "Hello world"}])
})

app.use("/api/anime", animeRoutes)

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)
}) 