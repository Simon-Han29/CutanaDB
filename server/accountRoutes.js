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

module.exports = router;