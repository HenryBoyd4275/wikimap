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
    db.query(`
    DELETE FROM points
    WHERE map_id = ${req.body.currentMap};
    `).then(
        req.body.markerArray.forEach( element => {
        db.query(`
        INSERT INTO points (map_id, title, description, image_url, lat, lng)
        VALUES (${req.body.currentMap}, '${element.title}', '${element.description}', 'image_url', ${element.lat}, ${element.lng})`);
      })
    )
  });

  router.post("/getTitle", (req, res) => {
    console.log("req", req.body.currentMap)
    return db.query(`
      SELECT title
      FROM maps
      WHERE id = ${req.body.currentMap}
    `).then( responce => {
      res.send(responce);
    })
  });

  router.post("/favourite", (req, res) => {
    currentUser = req.session.username

    if (currentUser) {
      db.query(`
      SELECT id
      FROM users
      WHERE name = '${currentUser}';
      `).then((id) => {
        const currentUserId = id.rows[0].id
        return currentUserId
      }).then(currentUserId => {
        db.query(`
        INSERT INTO favourite_maps (user_id, map_id)
        VALUES (${currentUserId}, ${req.body.currentMap});
        `)}).then(() => res.send())
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
                WHERE name = '${currentUser}';
      `).then(id =>{
        return id.rows[0].id
      }).then(userID =>{
        db.query(`INSERT INTO maps(owner_id, title)
                       VALUES
                       (${userID}, '${req.body.title}');
      `
      )}).then(()=>{
        res.send()
      })
    }
  })


  router.post("/:id/destroy", (req, res) => {
    db.query(`
    DELETE from 'maps'
    WHERE id = '${req.params}'
    `)
  })

  router.get("/id/:id", (req, res) => {
    database.getMapPoints(req.params.id)
    .then(results => res.render("index", results))
  })

  router.post("/point/add", (req, res) => {
    db.query(`
    INSERT INTO 'points' (map_id, title, description, image_url, lat, lng)
    VALUES ($1, $2, $3, $4, $5, $6)
    `, map_id, title, description, image_url, lat, lng)        //$1 being the map_id from a cookie?
  })

  router.post("/point/:id/remove", (req, res) => {
    db.query(`
    DELETE from 'points'
    WHERE id = '${req.params}'
    `)
  })

  // this assumes that users can only modify title, description and url
  router.post("/point/:id/edit", (req, res) => {
    const queryParams = [];
    let queryString = `
    UPDATE 'points'
    `;
    if (form.title) {
      queryParams.push(`${form.title}`)
      if (queryParams.length = 1) {
        queryString += `SET title = $${queryParams.length}`
      } else {
        queryString += `, title = $${queryParams.length}`
      }
    }

    if (form.description) {
      queryParams.push(`${form.description}`)
      if (queryParams.length = 1) {
        queryString += `SET description = $${queryParams.length}`
      } else {
      queryString += `, description = $${queryParams.length}`
      }
    }

    if (form.image_url) {
      queryParams.push(`${form.image_url}`)
      if (queryParams.length = 1) {
        queryString += `SET image_url = $${queryParams.length}`
      } else {
      queryString += `, image_url = $${queryParams.length}`
      }
    }

    queryString += `
    WHERE id = ${req.params}`

    db.query(queryString, queryParams)
  }) // we need to alter "form" --> will be ejs input
  return router;
};
