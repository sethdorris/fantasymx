var pg = require("pg");
var dbConnectionConfig = require('./server-config');
var IsDevelopment = process.env.NODE_ENV == 'development';
var config = IsDevelopment ? dbConnectionConfig.development : dbConnectionConfig.production;

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

module.exports.getUsernameByUserId = function (userId) {
  return pool.query('SELECT * FROM users WHERE id = $1', [userId]);
}

module.exports.getMainLeagueUserInfo = function () {
  var leagueInfo = [];
  return pool.query("SELECT * FROM weekly_team JOIN riders ON weekly_team.rider1id = riders.id OR weekly_team.rider2id = riders.id OR weekly_team.rider3id = riders.id OR weekly_team.rider4id = riders.id JOIN users ON weekly_team.userid = users.id")
}
