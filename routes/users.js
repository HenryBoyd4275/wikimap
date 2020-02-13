/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  const loginCheck = function (user) {
    return db.query(`
    SELECT *
    FROM users
    WHERE name = $1;
    `, [`${user.username}`])
      .then (user => {
        return user.rows[0];})
      .catch( error => {
        console.log("caught ", error);
      })
  }

  router.post("/login", (req, res) => {
    const username = req.body;
    if (!username) {
      res.status(400);
      res.send("Please enter a username");
    }

    // check if user exists, and pass along name and id cookies
    loginCheck(username)
    .then( user => {
      if(!user) {
        res.redirect("/");
      }
      req.session.username = user.name;
      req.session.userId = user.id
      res.redirect("/");
    }).catch(error => console.log("error: ", error))
   });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  // registers user
  router.get("/register", (req, res) => {
    res.render("./registration.ejs")
  })

  // sends registration info for new user
  router.post("/register", (req, res) => {
    const name = req.body.name;
    db.query(`
    INSERT INTO users (name)
    VALUES ($1)
    `, [`${name}`])
    .then(data => {
      const users = data.rows;
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
    res.redirect("/")
  })

  //should render favourite maps for user
  //NOTE: this is different than "favouriting the map" in maps.js
  router.get("/favourites", (req, res) => {
    db.query(`
    SELECT maps.title, maps.id
    FROM maps
    JOIN favourite_maps ON favourite_maps.map_id = maps.id
    JOIN users ON maps.viewer_id = users.id
    WHERE users.id = ${currentUser}
    `, [users.id]) // $1 being user cookie
  })

  router.get("/owned", (req, res) => {
    const username = req.session.username
    console.log(username)
    db.query(`
    SELECT maps.*
    FROM maps
    JOIN users ON owner_id = users.id;
    WHERE owner.id = $1;
    `, [`${username}`]) // $1 being user cookie
  })

  return router;
};
