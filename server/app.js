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
var api  = require('./api');
var fetch = require('node-fetch');

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
  return Promise.try(() => {
    return UserAlreadyExists(req.body.email, req.body.username)
  }).then(exists => {
    console.log("exists",exists);
    if (!exists) {
      console.log("inside exists if")
      Promise.try(() => {
        return scrypt.hash(req.body.password);
      }).then(hash => {
         return knex("users")
        .returning('id')
        .insert({
          username: req.body.username,
          password: hash,
          email: req.body.email
        });
        console.log("INSERT COMPLETE", userId)
      }).then(row => {
        console.log("row", row)
        req.session.userId = row;
        res.json({ username: req.body.username, userId: row});
      }).catch(err => {
        res.send(err);
      })
    } else {
      res.json(exists);
    }
  })
});

app.get('/loginrefresh', function (req, res) {
  console.log(req.session)
  console.log(req.session.userId);
  var isUndefined = typeof req.session.userId == 'undefined';
  console.log("is userId undefined", isUndefined)
  if (typeof req.session.userId == 'undefined') {
    console.log("session undefined")
    return res.sendStatus(200);
  }
  pool.query('SELECT * FROM users WHERE id = $1', [parseInt(req.session.userId)]).then(users => {
    console.log("why is this hit?")
    if (users.length === 0) {
      return res.send("User was not found.");
    } else {
      return res.json({username: users.rows[0].username, userId: users.rows[0].id});
    }
  })
})

app.post('/login', function (req, res) {
  let user;
    pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [req.body.username]).then( (users) => {
      if (users.length === 0) {
        res.send("User does not exist")
      } else {
        user = users.rows[0];
        console.log(user)
        return Promise.try(() => {
          return scrypt.verifyHash(req.body.password, user.password);
        }).then(() => {
          return GetMostRecentTeam(user.id).then(data => {
            req.session.userId = user.id;
            console.log(data)
            return res.json( {username: user.username, recentteam: data.rows })
          })
        }).catch(scrypt.PasswordError, (err) => {
          res.status(401).send("User password did not match");
        }).catch((err) => {
          res.status(500).send("An error occured with the authentication server.");
        })
      }
    })
  });

  app.get('/logout', function (req, res) {
    req.session.destroy();
    res.sendStatus(200);
  })

  app.get('/getMainLeagueInfo', function (req, res) {
    var leagueInfo = [];
    pool.query(api.mainLeagueInfoSql)
    .then(data => {
      res.send(data.rows);
    });
  })

  app.get('/StatTracker', function (req, res) {
   fetch('http://live.amasupercross.com/xml/sx/RaceResults.json?R=1494731612736')
    .then(apires => {
      return apires.json();
    })
    .then(data => {
     res.send(data)
    })
  })

  app.get('/MainLeagueStandings', function (req, res) {
    pool.query(api.getMainLeagueTotalStandings)
    .then(data => {
      res.send(data.rows)
    })
  })

  app.get('RaceResults', function (req, res) {
    res.sendStatus(200);
  })

  app.get('/GetAllAvailableRiders', function (req, res) {
    pool.query(api.getAllAvailableRiders)
    .then(data => {
      res.send(data.rows)
    })
  })

  app.get('/GetCurrentWeek', function (req, res) {
    var currentdate = Date.now();
    if (currentdate < new Date(2018, 00, 06, 03)) {
      return res.json({ week: 1 })
    }
    if (currentdate < new Date(2018, 00, 13, 03)) {
      return res.json({ week: 2 })
    }
    if (currentdate < new Date(2018, 00, 20, 03)) {
      return res.json({ week: 3 })
    }
    if (currentdate < new Date(2018, 00, 27, 03)) {
      return res.json({ week: 4 })
    }
    if (currentdate < new Date(2018, 01, 3, 03)) {
      return res.json({ week: 5 })
    }
    if (currentdate < new Date(2018, 01, 10, 03)) {
      return res.json({ week: 6 })
    }
    if (currentdate < new Date(2018, 01, 17, 03)) {
      return res.json({ week: 7 })
    }
    if (currentdate < new Date(2018, 01, 24, 03)) {
      return res.json({ week: 8 })
    }
    if (currentdate < new Date(2018, 02, 03, 03)) {
      return res.json({ week: 9 })
    }
    if (currentdate < new Date(2018, 02, 10, 03)) {
      return res.json({ week: 10 })
    }
    if (currentdate < new Date(2018, 02, 17, 03)) {
      return res.json({ week: 11 })
    }
    if (currentdate < new Date(2018, 02, 24, 03)) {
      return res.json({ week: 12 })
    }
    if (currentdate < new Date(2018, 03, 07, 03)) {
      return res.json({ week: 13 })
    }
    if (currentdate < new Date(2018, 03, 14, 03)) {
      return res.json({ week: 14 })
    }
    if (currentdate < new Date(2018, 03, 21, 03)) {
      return res.json({ week: 15 })
    }
    if (currentdate < new Date(2018, 03, 28, 03)) {
      return res.json({ week: 16 })
    }
    if (currentdate < new Date(2018, 04, 05, 03)) {
      return res.json({ week: 17 })
    }
  })

  function UserAlreadyExists(email, username) {
    return pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)', [email, username])
    .then( data => {
      console.log("data", data)
      if (data.rowCount > 0 && data.rows[0].username.toLowerCase() == username.toLowerCase()) {
        return { ErrorMessage: "Username is not available."}
      } else if (data.rowCount > 0 && data.rows[0].email.toLowerCase() == email.toLowerCase()) {
        return { ErrorMessage: "Email is already in use." }
      } else {
        return false;
      }
    })
  }

  function GetMostRecentTeam(userid) {
    return pool.query(api.getCurrentWeeksRiders, [userid]);
  }

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
