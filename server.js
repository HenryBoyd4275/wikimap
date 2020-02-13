// load .env data into process.env
require('dotenv').config();

const database = require('./routes/db_queries');

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./routes/maps");

// Mount all resource routes
app.use("/user", usersRoutes(db));
app.use("/maps", mapsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  let currentUserId = req.session.userId; //capitalize?
  let currentUser = req.session.username



  const mapsQuery =
  `SELECT * FROM maps`;

  const favouriteMapsQuery = `
  SELECT maps.title, maps.id
  FROM maps
  JOIN favourite_maps ON favourite_maps.map_id = maps.id
  WHERE favourite_maps.user_id = ${currentUserId}
  `;
  const ownedMapsQuery = `
  SELECT maps.*
  FROM maps
  JOIN users ON owner_id = users.id
  WHERE users.id = ${currentUserId};
  `;

  let queries = [db.query(mapsQuery)]
  if (currentUser) {
    queries.push(db.query(favouriteMapsQuery), db.query(ownedMapsQuery))
  }

  Promise.all(queries)
  .then( results => {

    let mapList = results[0].rows
    let favouriteMapList;
    let ownedMapList;
    if (currentUser){
      favouriteMapList = results[1].rows
      ownedMapList = results[2].rows
    }
    res.render("index", {mapList, favouriteMapList, ownedMapList, currentUser, currentUserId});   // pass to front end.
  })
  .catch((error) => console.log("error:", error))


 })


app.listen(PORT, () => {
  console.log(`Wikimap listening on port ${PORT}`);
});
