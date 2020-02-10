/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // gets user

  //logs user out
  router.post("/logout", (req, res) => {
    // res.clearCookie("user");
      // whatever we'll be calling this cookie
    res.redirect("/")
  })

  // registers user
  router.get("/register", (req, res) => {
    console.log("Yay")
    res.render("./registration.ejs")
  })

  // sends registration info for new user
  router.post("/register", (req, res) => {
    db.query(`
    INSERT INTO users (name)
    VALUES $1
    `, name)
    .then(data => {
      const users = data.rows;
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })

  router.get("/favourites", (req, res) => {
    db.query(`
    SELECT maps.title
    FROM maps
    JOIN favourite_maps ON favourite_maps.user_id = maps.viewer_id
    JOIN users ON favourite_maps.user_id = users.id
    WHERE users.id = $1
    `, [users.id]) // $1 being user cookie
  })

  router.get("/owned", (req, res) => {
    db.query(`
    SELECT maps.title
    FROM maps
    JOIN favourite_maps ON favourite_maps.user_id = maps.owner_id
    JOIN users ON favourite_maps.user_id = users.id
    WHERE users.id = $1
    `, [users.id]) // $1 being user cookie
  })

  router.get("/:id", (req, res) => {
    console.log("Id: ", req.params)
    db.query(`
    SELECT * FROM users
    WHERE users.id = ${req.params};
    `)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
