/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

 // every /.. stands for /users.., because of the mounting in index.js

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // gets user
  // TODO check if req.params is right use
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

  //logs user out
  // router.post("/:id/logout", (...))

  // registers user
  router.post

  router.post("/register/:id", (req, res) => {
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

  router.get("/:id/favourites", (req, res) => {
    db.query(`
    SELECT maps.title
    FROM maps
    JOIN favourite_maps ON favourite_maps.user_id = maps.viewer_id
    JOIN users ON favourite_maps.user_id = users.id
    WHERE users.id = ${req.params}
    `, )
  })

  router.get("/:id/owned", (req, res) => {
    db.query(`
    SELECT maps.title
    FROM maps
    JOIN favourite_maps ON favourite_maps.user_id = maps.owner_id
    JOIN users ON favourite_maps.user_id = users.id
    WHERE users.id = ${req.params}
    `, )
  })
  return router;
};
