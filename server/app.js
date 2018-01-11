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
var CronJob = require("cron").CronJob;


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
var returnObj = { raceStarted: false, raceFinished: false, raceData: '', broadcast: true, lastBroadcast: false, raceDetails: '' };

app.use(session({
  store: store,
  secret: config.sessions.secret,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: IsDevelopment },
  resave: false,
  saveUninitialized: false
}))
app.use(bodyParser.json());
app.use("/build", express.static(path.join(__dirname, "..", "build")));

//Weekly job that saves race results.
var SaveRaceResults = new CronJob('00 00 23 * 0-4 6', () => {
    fetch('http://live.amasupercross.com/xml/sx/RaceResults.json')
    .then(res => {
      return res.json();
    })
    .then(async (results) => {
      console.log("JSON", results);
      var arrayNames = StatTrackerVMCreator.GetRacerNamesInRaceResults(results.B);
      var racerRecords = await knex.select("riderid").from("riders").whereIn("name", arrayNames);
      console.log("racer records", racerRecords)
      var week = api.GetCurrentWeekForCron();
      var raceResultsObjects = StatTrackerVMCreator.GetRaceResultsObjects(racerRecords, results.B);
      var sql = api.SaveResults(raceResultsObjects, 5);
      console.log("sql", sql)
      pool.query(sql);
    })
}, true, 'America/Denver');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "..", "index.html"))
})

app.post('/register', async (req, res) => {
  console.log("RECAPTCHA", req.body.captcha);
  try {
    var captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=6LcSfDIUAAAAAHPG4nE1_P3v7QMw_ebraIrcyhbs&response=${req.body.captcha}`, { method: "POST" })
    var data = await captchaResponse.json();
    console.log("recaptcha", data)
    if (!data.success) {
      return res.status(401).send({ error: "Recaptcha Failed" })
    }
    var userExists = await UserAlreadyExists(req.body.email, req.body.username);
    if (!userExists) {
      var hashedPw = await scrypt.hash(req.body.password);
      var createdId = await knex("users").returning("id").insert({ username: req.body.username, password: hashedPw, email: req.body.email })
      req.session.userId = createdId;
      console.log("Here is the session Id", req.session.userId);
      return res.json({ username: req.body.username, userId: createdId[0], accounttype: 0 })
    }
    return res.json(userExists);
  } catch (e) {
    //log e
    console.error(e);
    return res.sendStatus(500);
  }
});

app.get('/loginrefresh', async (req, res) => {
  console.log(req.session)
  console.log(req.session.userId);
  var isUndefined = typeof req.session.userId == 'undefined';
  console.log("is userId undefined", isUndefined)
  if (typeof req.session.userId == 'undefined') {
    console.log("session undefined")
    return res.sendStatus(200);
  }
  var users = await pool.query('SELECT * FROM users WHERE id = $1', [parseInt(req.session.userId)]);
  if (users.length === 0) {
    return res.send("User was not found.");
  } else {
    var userData = {
      username: users.rows[0].username,
      userId: users.rows[0].id,
      accounttype: users.rows[0].account_type,
      currentLeague: { leagueid: 1, name: "MainLeague" }
    }
    var leagues = await pool.query(api.GetUsersLeagues, [users.rows[0].id]);
    userData.leagues = leagues.rows;
      return res.json(userData);
    }
})

app.post('/login', async (req, res) => {
  let user;
  var captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=6LcSfDIUAAAAAHPG4nE1_P3v7QMw_ebraIrcyhbs&response=${req.body.captcha}`
    , { method: "POST" })
  var data = await captchaResponse.json();
  if (!data.success) {
    return res.status(401).send({ error: "Recaptcha Failed" })
  }
  try {
    var userQuery = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [req.body.username]);
    user = userQuery.rows[0];
    if (userQuery.rows.length == 0) {
      return res.status(401).send({ error: "User does not exist" })
    } else {
      var correctPassword = await scrypt.verifyHash(req.body.password, user.password)
      if (correctPassword) {
        req.session.userId = user.id;
        var leagues = await pool.query(api.GetUsersLeagues, [user.id]);
        return res.json({ username: user.username, userId: user.userid, accounttype: user.account_type, leagues: leagues.rows, currentLeague: {leagueid: 1, name: "MainLeague"} })
      }
    }
   } catch (e) {
     console.error(e);
     return res.status(500);
   }
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

  // app.get('/StatTracker', function (req, res) {
  //  fetch('http://live.amasupercross.com/xml/sx/RaceResults.json')
  //   .then(apires => {
  //     return apires.json();
  //   })
  //   .then(data => {
  //    res.send(data)
  //   })
  // })

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
    var seasonEndYear = new Date().getFullYear();
    var seasonStartYear = seasonEndYear - 1;
    var seasonEnd = `${seasonEndYear}-12-31`;
    var seasonStart = `${seasonStartYear}-12-31`;
    //For Roster Lock Don't use the stat tracker current week;
    var currentWeek = api.GetCurrentMyTeamWeek();
    var myCurrentTeam = [];
    var allAvail = [];
    var p1 = pool.query(api.getAllAvailableRiders).then((data) => { return data.rows });
    //Might need to edit this query and join on price history
    var p2 = pool.query(api.getMainLeagueTeamByWeekAndUserId, [parseInt(req.session.userId), currentWeek]).then(data => { return data.rows })
    var p3 = pool.query(api.getRaceResultStatsForCurrentYear).then(data => { return data.rows })
    return Promise.all([p1, p2, p3]).then(([AvailRiders, CurrentWeekTeam, Stats]) => {
      console.log("all avail", AvailRiders);
      console.log("currentTeam", CurrentWeekTeam);
      console.log("stats", Stats)
      var model = MyTeamVMCreator.Create({AvailableRiders: AvailRiders, CurrentTeam: CurrentWeekTeam, Stats: Stats, CurrentWeek: currentWeek})
      return res.json(model);
    }).catch(e => {
      console.log(e)
    })
  })

  app.post('/GetUserTeams', async (req, res) => {
    var userid = req.body.userid;
    var week = api.GetUsersTeamWeeks();
    var teams = await pool.query(api.getUsersWeeklyTeams, [week, userid]);
    return res.json(teams.rows);
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
    var currentWeek = api.GetCurrentStatTrackerWeek();
    //Send current week's team to only the connected client;
    function nextPoll() {
      var p1 = LiveAPIPolling().then(apires => { return apires; })
      var p2 = pool.query(api.MainLeagueStatTrackerData, [currentWeek]).then(data => { return data.rows })
      return Promise.all([p1, p2]).then(([results, league]) => {
        if (returnObj.broadcast) {
          var model = StatTrackerVMCreator.Create(results, league);
          wss.clients.forEach(client => {
            client.send(JSON.stringify(model))
          })
        }
        if (!returnObj.raceFinished) {
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

  async function UserAlreadyExists(email, username) {
    return await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)', [email, username])
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

  async function GetMostRecentTeam(userid) {
    return pool.query(api.getCurrentWeeksRiders, [userid]);
  }

  function LiveAPIPolling() {
    var p1 = fetch('http://live.amasupercross.com/xml/sx/RaceResults.json').then(results => { return results.json() });
    var p2 = fetch('http://live.amasupercross.com/xml/sx/RaceData.json').then(data => { return data.json(); }).catch(err => console.log("error with data", err));
    return Promise.all([p1, p2]).then(([results, info]) => {
      console.log("Mock Results", results)
      console.log("Mock Data", info);
      if (info.B == 'Session Complete' && !returnObj.lastBroadcast) {
        returnObj.raceFinished = true;
        returnObj.broadcast = true;
        returnObj.lastBroadcast = true;
        returnObj.raceDetails = info;
        return returnObj;
      }
      if (results.S.indexOf("450SX Main") < 0) {
        return returnObj;
      }
      if (returnObj.raceData == '') {
        returnObj.raceData = results;
        returnObj.raceStarted = true;
        returnObj.broadcast = true;
        returnObj.raceDetails = info;
        return returnObj;
      }
      if (returnObj.raceData == results) {
        returnObj.raceData = results;
        returnObj.raceStarted = true;
        returnObj.broadcast = false;
        returnObj.raceDetails = info;
        return returnObj;
      }
      returnObj.raceData = results;
      returnObj.raceDetails = info;
      return returnObj;
    }).catch(err => {
      console.log("error with api", err)
    })
  }

theServer.listen(process.env.PORT || 3000);
