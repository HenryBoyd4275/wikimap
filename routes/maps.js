/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    let query = `
    SELECT *
    FROM maps
    JOIN
    WHERE maps.id = ${req.params}`;
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
    if (cookie) {
      show this, with edit create
    }
    else {
      just show map
    }
    db.query(`
    INSERT INTO maps (owner_id, title)
    VALUES
    `, [])
  })
  return router;
};
