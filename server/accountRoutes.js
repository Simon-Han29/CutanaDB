const express = require("express")
const router = express.Router();
const client = require("./db")
router.get("/", async (req, res) => {
  let uid = req.session.uid;
  console.log(req.session.uid)
  const findUserQuery = `
    SELECT username, uid, animeList, following, followers, customlists
    FROM users
    WHERE uid=$1
  `
  let queryResult = await client.query(findUserQuery, [uid])
  if (queryResult.rowCount === 0) {
    res.status(404).send("Account does not exist")
  } else {
    res.status(200).json(queryResult.rows[0])
  }

})

router.get("/animelist/:id", async(req, res) => {
  const uid = req.session.uid;
  if (uid === undefined) {
    res.status(401).send();
  } else {
    const animeId = req.params.id;
    const getListQuery = `
      SELECT animelist
      FROM users
      WHERE uid=$1
    `
  
    const queryRes = await client.query(getListQuery, [uid])
    const animelist = queryRes.rows[0].animelist;
    if (animelist[animeId] === undefined) {
      res.status(404).send();
    } else {
      res.status(200).send();
    }
  }
  
})

router.post("/animelist", async(req, res) => {
  const uid = req.session.uid;
  if (uid === undefined) {
    res.status(401).send();
  } else {
    const mal_id = req.body.mal_id;
    const getAnimeListQuery = `
      SELECT animelist
      FROM users 
      WHERE uid=$1
    `
    let queryRes = await client.query(getAnimeListQuery, [uid])
    let animelist = queryRes.rows[0].animelist
    if (animelist[mal_id] === undefined) {
      animelist[mal_id] = req.body;
      let updateListQuery = `
        UPDATE users
        SET animelist=$1
        WHERE uid=$2
      `
      await client.query(updateListQuery, [animelist, uid])
      res.status(201).send();
    } else {
      res.status(409).send();
    }
  }
})

router.delete("/animelist/:mal_id", async (req, res) => {
  const uid = req.session.uid;
  if (uid === undefined) {
    res.status(401).send();
  } else {
    const mal_id = req.body.mal_id;
    const getAnimeListQuery = `
    SELECT animelist
    FROM users 
    WHERE uid=$1
  `
  let queryRes = await client.query(getAnimeListQuery, [uid])
  let animelist = queryRes.rows[0].animelist
  delete animelist[mal_id]
  let updateListQuery = `
    UPDATE users
    SET animelist=$1
    WHERE uid=$2
  `
  await client.query(updateListQuery, [animelist, uid])
  res.status(200).send();
  }
})

module.exports = router;