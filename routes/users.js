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
  /*
  router.get("/login", (req, res) => {
    if (req.session.user_id) {
      //case where user is already logged in
    } else {
      let templateVars = { user: users[req.session.user_id]};
      res.render("login", templateVars);
    }
  });*/

  const loginCheck = function (username) {
    return db.query(`
    SELECT name
    FROM users
    WHERE name = '${username}'
    `)
    .then (user => {
      console.log("user: ", user);
      return user;})
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

    loginCheck(username)
    .then( user => {
      if(!user) {
        res.send({error: "login failed"});
        return;
      }
    req.session.username = username;
    } )

    console.log("Req.body: ", req.body);
    console.log("username: ", username);
    console.log("req.session.username: ", req.session.user_id);

  });

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
