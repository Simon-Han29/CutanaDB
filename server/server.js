const express = require("express")
const app = express();
const cors = require("cors")
const session = require("express-session")
const bodyParser = require("body-parser")
const client = require('./db');

const PORT = 8080;
const animeRoutes = require("./animeRoutes")
const mangaRoutes = require("./mangaRoutes")

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: generateRandomId(15),
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/api/home", (req, res) => {
    res.json([{message: "Hello world"}])
})
app.post("/api/signup", async (req, res) => {
    try {
        const {username, password} = req.body;

        let findUserByUsernameQuery = `
            SELECT * FROM users
            WHERE username=$1
        `
        let matchingUsername = await client.query(findUserByUsernameQuery, [username])
        if (matchingUsername.rowCount > 0) {
            res.status(409).send("username exists"); 
        }
        else {
            let uid = generateRandomId(15);
            let findUserByIdQuery = `
                SELECT * FROM users
                WHERE uid=$1
            `
            let matchingAccounts = await client.query(findUserByIdQuery, [uid])
            while (matchingAccounts.rowCount > 0) {
                uid = generateRandomId(15)
                matchingAccounts = await client.query(findUserByIdQuery, [uid])
            }
            let createNewUserQuery = `
                INSERT INTO users (username, password, uid, animelist, following, followers, customlists)
                VALUES ($1, $2, $3, '{}', '{}', '{}', '{}')
            `

            await client.query(createNewUserQuery, [username, password, uid])
            
            res.status(201).send();
        }
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }

})

app.post("/api/login", async (req, res) => {
    try {
        let {username, password} = req.body;
        const findUserQuery = `
            SELECT * FROM users
            WHERE username=$1
        `
        const matchingUser = await client.query(findUserQuery, [username])
        if (matchingUser.rowCount === 0) {
            res.status(404).send("username does not exist")
        } else {
            let userInfo = matchingUser.rows[0];
            if (userInfo.password === password) {
                req.session.uid = userInfo.uid;
                req.session.username = userInfo.username;
                res.status(201).send();
            } else {
                res.status(401).send("incorrect password");
            }
        }
    } catch(err) {
        req.status(500).send();
    } 
})

app.use("/api/anime", animeRoutes)
app.use("/api/manga", mangaRoutes)

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)
})

function isLoggedIn(req, res, next) {
    if (req.session.uid) {
        return next();
    }
    res.status(401).send()
}

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }