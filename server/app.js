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
    console.log("users", users)
    if (users.length === 0) {
      return res.send("User was not found.");
    } else {
      var userData = {
        username: users.rows[0].username,
        userId: users.rows[0].id
      }
      GetMostRecentTeam(users.rows[0].id)
      .then(function (data) {
        userData.recentteam = data.rows;
        console.log("data rows")
        return res.json(userData);
      })
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
        console.log("USER DATA", user)
        return Promise.try(() => {
          return scrypt.verifyHash(req.body.password, user.password);
        }).then(() => {
          return GetMostRecentTeam(user.id).then(data => {
            req.session.userId = user.id;
            if (data.rows.length == 0) {
              return res.json({ username: user.username, userId: user.Id, recentteam: []})
            }
            console.log("Get most recent team", data)
            return res.json( {username: user.username, userId: user.Id, recentteam: data.rows })
          }).catch(e => {
            console.log("error", e)
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

  app.get('/RaceResultsHistory', function (req, res) {
    pool.query(api.getAllRaceResults)
    .then(data => {
      res.send(data.rows);
    })
  })

  app.get('/GetAllAvailableRiders', function (req, res) {
    pool.query(api.getAllAvailableRiders)
    .then(data => {
      res.send(data.rows)
    })
  })

  app.get('/CurrentMyTeamModel', function (req, res) {
    //For development added a year for the future season. In production, remove that +1
    var seasonEndYear = new Date().getFullYear() + 1;
    var seasonStartYear = seasonEndYear - 1;
    var seasonEnd = `${seasonEndYear}-12-31`;
    var seasonStart = `${seasonStartYear}-12-31`;
    var currentWeek = api.GetCurrentWeek();
    var myCurrentTeam = [];
    var allAvail = [];
    var p1 = pool.query(api.getAllAvailableRiders).then((data) => { return data.rows });
    var p2 = pool.query(api.getMainLeagueTeamByWeekAndUserId, [req.session.userId, currentWeek]).then(data => { return data.rows })
    var p3 = pool.query(api.getRaceResultStatsForCurrentYear, [seasonEnd, seasonStart]).then(data => { return data.rows })
    Promise.all([p1, p2, p3]).then(([AvailRiders, CurrentWeekTeam, Stats]) => {
      console.log("all avail", AvailRiders);
      console.log("currentTeam", CurrentWeekTeam);
      console.log("stats", Stats)
      var model = MyTeamModelCreator({AvailableRiders: AvailRiders, CurrentTeam: CurrentWeekTeam, Stats: Stats})
      res.json(model);
    })
  })

  app.get('/myteam', (req, res) => {
    res.redirect(301, '/')
  })

  app.get('/GetCurrentWeek', function (req, res) {
    var currentWeek = api.GetCurrentWeek();
    res.json({ week: currentWeek });
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

  function MyTeamModelCreator(data) {
    var currentTeamids = [];
    var availRidersId = [];
    var availRidersModel = [];
    data.CurrentTeam.forEach(roster => {
      currentTeamids.push(roster.riderid);
    })
    var availableRiders = data.AvailableRiders.filter(riders => {
      if (currentTeamids.indexOf(riders.id) == -1) {
          availRidersId.push(riders.id);
      }
      return currentTeamids.indexOf(riders.id) == -1;
    })

    console.log(availableRiders)

    availableRiders.forEach(rider => {
      data.Stats.forEach(riderStat => {
        if (rider.id == riderStat.id) {
          availRidersModel.push({
            active: rider.active,
            avatar_url: rider.avatar_url,
            cost: rider.cost,
            riderid: rider.id,
            name: rider.name,
            number: rider.number,
            highestFinish: riderStat.min,
            lowestFinish: riderStat.max,
            averageFinish: riderStat.round
          })
        } else {
          availRidersModel.push({
            active: rider.active,
            avatar_url: rider.avatar_url,
            cost: rider.cost,
            riderid: rider.id,
            name: rider.name,
            number: rider.number,
            highestFinish: '-',
            lowestFinish: '-',
            averageFinish: '-'
          })
        }
      })
    })

    return { CurrentTeam: data.CurrentTeam, AvailableRiders: availRidersModel };
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
