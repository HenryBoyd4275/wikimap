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
    WHERE map_id = ${req.body.currentMap}
    `).then(
        req.body.markerArray.forEach( element => {
        db.query(`
        INSERT INTO points (map_id, title, description, image_url, lat, lng)
        VALUES (${req.body.currentMap}, '${element.title}', '${element.description}', 'image_url', ${element.lat}, ${element.lng})`);
      })
    )
  });

  router.get("/queryPoints", (req, res) => {

    database.getMapPoints(2)    // arg is the ID of the map
    .then(coords=> {
      res.send(coords)
    })
  })

  router.post("/update", (req, res) => {

    console.log(req.body)

  })

  router.get("/:id", (req, res) => {
    let query = `
    SELECT *
    FROM 'maps'
    JOIN
    WHERE maps.id = '${req.params}'`;
    console.log(query);
    db.query(query)
      .then(data => {
        const widgets = data.rows;
        res.json({ widgets });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/new/:id", (req, res) => {
    if (user) {     //this will define user login for now
    db.query(`
    INSERT INTO 'maps' (owner_id, title)
    VALUES ($1, $2)
    `, [owner_id, title])    // $1 being the user_id from cookie
    }
  })

  router.post("/:id/destroy", (req, res) => {
    db.query(`
    DELETE from 'maps'
    WHERE id = '${req.params}'
    `)
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
