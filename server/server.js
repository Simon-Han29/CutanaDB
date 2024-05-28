const express = require("express")
const app = express();
const cors = require("cors")
const session = require("express-session")
const bodyParser = require("body-parser")
const client = require('./db');

const PORT = 8080;
const animeRoutes = require("./animeRoutes")
const mangaRoutes = require("./mangaRoutes")
// const secret = generateRandomId(15)
app.use(cors({
    origin: 'http://localhost:3000', // or whatever your Next.js app's URL is
    credentials: true
  }));
  app.use(
    session({
      secret: "some secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        httpOnly: true,
        secure: false, // set to true if you're using https
        sameSite: 'lax' // or 'strict' or 'none' based on your needs
      }
    })
  );
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/api/isLoggedIn", (req, res) => {
    // console.log(req.session);
    if (req.session.uid) {
        console.log(req.session)
        res.status(200).send();
    } else {
        res.status(404).send();
    }
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
                req.session.save();
                console.log(req.session);
                res.status(201).send();
            } else {
                res.status(401).send("incorrect password");
            }
        }
    } catch(err) {
        req.status(500).send();
    } 
})

app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.clearCookie('connect.sid'); // Assuming 'connect.sid' is the name of the session cookie
      res.status(200).send("Logged out");
    });
  });

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