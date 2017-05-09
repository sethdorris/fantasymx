var pg = require("pg");

var config = {
  user: "postgres",
  password: "Seth42276",
  database: "fantasymx",
  host: "localhost",
  port: 5432
};

const pool = new pg.Pool(config);

pool.on("error", function (err) {
  console.log("Error Message: " + err.message + ". Stack Trace: " + err.stack);
})

module.exports.query = function (text, values, callback) {
  console.log('query:', text, values);
  return pool.query(text, values, callback);
};

module.exports.connect = function (callback) {
  return pool.connect(callback);
};
