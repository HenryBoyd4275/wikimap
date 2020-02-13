/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/Maps,
 *   these routes are mounted onto /Maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const database = require('./db_queries');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.post("/save", (req, res) => {
    if(req.body.markerArray){
      db.query(`
      DELETE FROM points
      WHERE map_id = ${req.body.currentMap};
      `).then(
          req.body.markerArray.forEach( element => {
          db.query(`
          INSERT INTO points (map_id, title, description, image_url, lat, lng)
          VALUES ($1, $2, $3, $4, $5, $6)`
          , [`${req.body.currentMap}`, `${element.title}`, `${element.description}`, `${element.image_url}`, `${element.lat}`, `${element.lng}`]);
        })
      )
    }
  });

  router.get("/initalmap", (req, res) => {

    database.getMapPoints(1)  // arg = ID of the map
    .then(coords=> {
      res.send(coords);
    })
  });

  router.post("/getTitle", (req, res) => {
    return db.query(`
      SELECT title
      FROM maps
      WHERE id = $1;
    `, [`${req.body.currentMap}`]).then( responce => {
      res.send(responce);
    }).catch(error => console.log("error: ", error))
  });

  router.post("/favourite", (req, res) => {
    currentUser = req.session.username

    if (currentUser) {
      db.query(`
      SELECT id
      FROM users
      WHERE name = $1;
      `, [`${currentUser}`]).then((id) => {
        const currentUserId = id.rows[0].id
        return currentUserId
      }).then(currentUserId => {
        db.query(`
        INSERT INTO favourite_maps (user_id, map_id)
        VALUES ($1,$2);
        `, [`${currentUserId}`, `${req.body.currentMap}`])}).then(() => res.send())
    .catch(error => console.log(error))
    }
  })

  router.post("/queryPoints", (req, res) => {


    database.getMapPoints(req.body.map)    // arg is the ID of the map
    .then(coords=> {
      res.send(coords)
    })
  })

  router.post("/new/", (req, res) => {
    currentUser=req.session.username
    if (currentUser) {
      db.query(`SELECT users.id
                FROM users
                WHERE name = $1;
      `, [`${currentUser}`]).then(id =>{
        return id.rows[0].id
      }).then(userID =>{
        db.query(`INSERT INTO maps(owner_id, title)
                  VALUES ($1,$2)
                  RETURNING id;
                `, [`${userID}`, `${req.body.title}`]).then(()=>{
                  db.query(`
                  SELECT id
                  FROM maps
                  ORDER BY id DESC
                  LIMIT 1
                  `).then(response => {
                    res.send({id:response.rows[0].id})
                  }).catch(error => console.log("error: ", error))
                })
      }).catch(error => console.log("error: ", error))
    }
  })

  // should this stay?
  router.get("/id/:id", (req, res) => {
    database.getMapPoints(req.params.id)
    .then(results => res.render("index", results))
  })

  return router;
};
