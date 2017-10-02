var IsDevelopment = process.env.NODE_ENV == 'development';

var express = require("express");
var Knex = require("knex");
var pg = require("pg");
var path = require("path");
var pool = require("./db");
var bodyParser = require("body-parser");
var fs = require("fs");
var scrypt = require("scrypt-for-humans");
var Promise = require("bluebird");
var config = require("./session-config");
var session = require ("express-session");
var KnexSessionStore = require("connect-session-knex")(session);
var app = express();
var api  = require('./api');
var MyTeamVMCreator = require('./ViewModelCreators/MyTeamViewModelCreator');
var StatTrackerVMCreator = require('./ViewModelCreators/StatTrackerVMCreator');
var fetch = require('node-fetch');

if (IsDevelopment) {
  var https = require("https");
  var theServer = https.createServer({
      key: fs.readFileSync(path.join(__dirname, "./key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "./cert.pem"))
     }, app);
} else {
  var http = require("http");
  var theServer = http.createServer(app);
}

var expressWs = require('express-ws')(app, theServer);
var mockAPI = require('./MockAPI');
var wss = expressWs.getWss('/tracker');
var dbConnectionConfig = require('./server-config');


console.log("Development Environment: ", process.env.NODE_ENV)
console.log("IsDevelopment", IsDevelopment)

var dbConnection = IsDevelopment ? dbConnectionConfig.development : dbConnectionConfig.production;
console.log("Database Connection", dbConnection)

var knex = Knex({
  client: 'pg',
  connection: dbConnection
})

var store = new KnexSessionStore({
  knex: knex
})

//For live stat tracker
var oldObj;
//lastBroadcast is used to determine if we have broadcast session complete results at least 1 time and then stopped.
var returnObj = { raceStarted: false, raceFinished: false, raceData: '', broadcast: true, lastBroadcast: false };

app.use(session({
  store: store,
  secret: config.sessions.secret,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: IsDevelopment },
  resave: false,
  saveUninitialized: false
}))
app.use(bodyParser.json());
app.use("/build", express.static(path.join(__dirname, "..", "build")));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "..", "index.html"))
})

app.post('/register', function (req, res) {
  console.log("RECAPTCHA", req.body)
  console.log("RECAPTCHA", req)
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
        console.log("row", row[0])
        req.session.userId = row[0];
        res.json({ username: req.body.username, userId: row[0] });
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
  .catch(err => console.log(err))
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
    console.log(req)
  })

  app.get('/getMainLeagueInfo', function (req, res) {
    var leagueInfo = [];
    pool.query(api.mainLeagueInfoSql)
    .then(data => {
      res.send(data.rows);
    });
  })

  app.get('/StatTracker', function (req, res) {
   fetch('http://live.amasupercross.com/xml/sx/RaceResults.json')
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
    var currentWeek = IsDevelopment ? api.GetCurrentWeekForTest() : api.GetCurrentWeek();
    var myCurrentTeam = [];
    var allAvail = [];
    console.log("req session id: ", req.session.Userid)
    var p1 = pool.query(api.getAllAvailableRiders).then((data) => { return data.rows });
    var p2 = pool.query(api.getMainLeagueTeamByWeekAndUserId, [req.session.userId, currentWeek]).then(data => { return data.rows })
    var p3 = pool.query(api.getRaceResultStatsForCurrentYear, [seasonEnd, seasonStart]).then(data => { return data.rows })
    Promise.all([p1, p2, p3]).then(([AvailRiders, CurrentWeekTeam, Stats]) => {
      console.log("all avail", AvailRiders);
      console.log("currentTeam", CurrentWeekTeam);
      console.log("stats", Stats)
      var model = MyTeamVMCreator.Create({AvailableRiders: AvailRiders, CurrentTeam: CurrentWeekTeam, Stats: Stats, CurrentWeek: currentWeek})
      res.json(model);
    })
  })

  app.get('/myteam', (req, res) => {
    res.redirect(301, '/')
  })
  app.get('/rules', (req, res) => res.redirect(301, '/'))

  app.get('/GetCurrentWeek', function (req, res) {
    var currentWeek = IsDevelopment ? api.GetCurrentWeekForTest() : api.GetCurrentWeek();
    res.json({ week: currentWeek });
  })

  app.post("/SaveTeam", async (req, res) => {
    var currentweek = IsDevelopment ? api.GetCurrentWeekForTest() : api.GetCurrentWeek();
    var weeklyteam_ids = [];
    var CurrentTeam = await pool.query(api.getMainLeagueTeamByWeekAndUserId, [req.session.userId, currentweek]);

    CurrentTeam.rows.forEach(team => { weeklyteam_ids.push(team.id) });
    console.log(req.session.userId)
    console.log(req.body)
    try {
      if (weeklyteam_ids.length == 4) {
        await pool.query(api.saveTeam, [weeklyteam_ids[0], req.body[0].riderid])
        await pool.query(api.saveTeam, [weeklyteam_ids[1], req.body[1].riderid])
        await pool.query(api.saveTeam, [weeklyteam_ids[2], req.body[2].riderid])
        await pool.query(api.saveTeam, [weeklyteam_ids[3], req.body[3].riderid])
      } else {
        await pool.query(api.createRosterSlots, [req.session.userId, currentweek, req.body[0].riderid])
        await pool.query(api.createRosterSlots, [req.session.userId, currentweek, req.body[1].riderid])
        await pool.query(api.createRosterSlots, [req.session.userId, currentweek, req.body[2].riderid])
        await pool.query(api.createRosterSlots, [req.session.userId, currentweek, req.body[3].riderid])
      }
    } catch (e) {
      console.log("Fucking error", e)
      res.status(500).send("Save Failed")
    }
    res.status(200).send("Successful Save")
  })

  app.ws('/tracker', function(ws, req) {
    var currentWeek = IsDevelopment ? api.GetCurrentWeekForTest() : api.GetCurrentWeek();
    var indexOfMock = 0;
    //Send current week's team to only the connected client;
    function nextPoll() {
      var p1 = MockAPIPolling(indexOfMock).then(apires => { return apires; })
      var p2 = pool.query(api.MainLeagueStatTrackerData, [currentWeek]).then(data => { return data.rows })
      return Promise.all([p1, p2]).then(([results, league]) => {
        if (returnObj.broadcast) {
          var model = StatTrackerVMCreator.Create(results, league);
          wss.clients.forEach(client => {
            client.send(JSON.stringify(model))
          })
        }
        if (!returnObj.raceFinished) {
          indexOfMock++;
          return setTimeout(nextPoll, 5000)
        }
      })
    }
    nextPoll();
  })

  app.post('/feedback', (req, res) => {
    pool.query(api.SaveFeedback, [req.body.Username, req.body.ReportType, req.body.Registered, req.body.Feature, req.body.BugReport, req.body.Feedback])
    .then(data => res.sendStatus(200));
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

  function APIPolling() {
    var p1 = fetch('http://live.amasupercross.com/xml/sx/RaceResults.json').then(results => { return results.json() });
    var p2 = fetch('http://live.amasupercross.com/xml/sx/RaceData.json').then(data => { return data.json(); }).catch(err => console.log("error with data", err));
    Promise.all([p1, p2]).then(([results, info]) => {
      if (returnObj.info.B == 'Session Complete') {
        returnObj.raceFinished = true;
        return returnObj;
      }
      if (results.S.indexOf("450SX Main") < 0) {
        return returnObj;
      }
      if (returnObj.raceData == '') {
        returnObj.raceData = results;
        returnObj.raceStarted = true;
        returnObj.broadcast = true;
        return returnObj;
      }
      if (returnObj.raceData == results) {
        returnObj.raceData = results;
        returnObj.raceStarted = true;
        returnObj.broadcast = false;
        return returnObj;
      }
      returnObj.raceData = results;
      return returnObj;
    })
  }

  function MockAPIPolling(index) {
    console.log("hit")
    var p1 = Promise.try(function () {
      return mockAPI.GetRaceResults(index);
    }).then(results => { return results });
    var p2 = Promise.try(function () {
      return mockAPI.GetRaceData(index);
    }).then(results => { return results });
    return Promise.all([p1, p2]).then(([results, info]) => {
      console.log("Mock Results", results)
      console.log("Mock Data", info);
      if (info.B == 'Session Complete' && !returnObj.lastBroadcast) {
        returnObj.raceFinished = true;
        returnObj.broadcast = false;
        returnObj.lastBroadcast = true;
        return returnObj;
      }
      if (results.S.indexOf("450SX Main") < 0) {
        return returnObj;
      }
      if (returnObj.raceData == '') {
        returnObj.raceData = results;
        returnObj.raceStarted = true;
        returnObj.broadcast = true;
        return returnObj;
      }
      if (returnObj.raceData == results) {
        returnObj.raceData = results;
        returnObj.raceStarted = true;
        returnObj.broadcast = false;
        return returnObj;
      }
      returnObj.raceData = results;
      return returnObj;
    })
  }

theServer.listen(process.env.PORT || 3000);
