var express = require("express");
var Knex = require("knex");
var pg = require("pg");
var path = require("path");
var pool = require("./db");
var bodyParser = require("body-parser");
var https = require("https");
var fs = require("fs");
var scrypt = require("scrypt-for-humans");
var Promise = require("bluebird");
var config = require("./session-config");
var session = require ("express-session");
var KnexSessionStore = require("connect-session-knex")(session);
var app = express();
var api  = require('./db');

var knex = Knex({
  client: 'pg',
  connection: {
    user: "postgres",
    password: "Seth42276",
    database: "fantasymx",
    host: "localhost",
    port: 5432
  }
})

var store = new KnexSessionStore({
  knex: knex
})

app.use(session({
  store: store,
  secret: config.sessions.secret,
  cookie: { maxage: 30 * 24 * 60 * 60 * 1000, secure: true },
  resave: false,
  saveUninitialized: false
}))
app.use(bodyParser.json());
app.use("/build", express.static(path.join(__dirname, "..", "build")));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "..", "index.html"))
})

app.post('/register', function (req, res) {
  Promise.try(() => {
    return scrypt.hash(req.body.password);
  }).then(hash => {
    return knex("users")
    .insert({
      username: req.body.username,
      password: hash,
      email: req.body.email
    }).returning("id")
  }).then(row => {
    req.session.userId = row;
    res.send();
  }).catch(err => {
    res.send(err);
  })
});

app.post('/login', function (req, res) {
  console.log("hit")
    pool.query('SELECT * FROM users WHERE username = $1', [req.body.username]).then( (users) => {
      if (users.length === 0) {
        throw new AuthenticationError("User does not exist");
      } else {
        let user = users.rows[0];
        console.log(user)
        return Promise.try(() => {
          return scrypt.verifyHash(req.body.password, user.password);
        }).then(() => {
          req.session.userId = user.id;
          res.redirect("/");
        }).catch(scrypt.PasswordError, (err) => {
          throw new AuthenticationError("Invalid Password");
        })
      }
    })
  })

  https.createServer({
    key: fs.readFileSync(path.join(__dirname, "./key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "./cert.pem"))
  }, app).listen(3000);

// pool.query('SELECT * FROM riders').then(function (res, err) {
//   console.log(res.rows[0]);
//   if (err) {
//     console.log("error");
//   }
// });
// pool.query('INSERT into users (email, username, password) VALUES ($1, $2, $3)', [req.body.email, req.body.username, hash])
