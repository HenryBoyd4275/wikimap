

//install postgreSQL and connect
const { Pool } = require("pg");
const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm"
});



const getMapPoints = function (mapID){
  return pool
    .query(
      `
      SELECT *
      FROM points
      WHERE map_id=${mapID}
  `
  ).then(res=>{
    // console.log(res.rows)
    return res.rows;
  })
  .catch(err => console.error("not found"));


}

exports.getMapPoints=getMapPoints;
