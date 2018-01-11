exports.mainLeagueInfoSql = `
WITH riders_json AS (
SELECT userid, ARRAY_AGG(row_to_json(json_rows)) AS riders
FROM
(SELECT weekly_team.userid, users.username, name, points
FROM riders
INNER JOIN weekly_team
ON riders.riderid = weekly_team.riderid
INNER JOIN users
ON weekly_team.userid = users.id) AS json_rows
GROUP BY userid
WHERE weekly_team.leagueid = $1)
SELECT wt.userid, riders_json.riders::jsonb[]
FROM weekly_team AS wt
INNER JOIN riders_json
ON riders_json.userid = wt.userid
GROUP BY wt.userid, riders_json.riders::jsonb[]
`;

exports.getAllAvailableRiders = `
SELECT riders.riderid, riders.name, riders.avatar_url, riders.rider_number, riders.active, riders.cost AS cost, price_history.price AS lastprice FROM riders
JOIN price_history ON riders.riderid = price_history.riderid
WHERE season_weekid = (
	SELECT MAX(season_weekid) FROM price_history
) AND riders.active = true
`;

exports.GetUsersLeagues = `SELECT DISTINCT(leagueid), leagues.name FROM league_users
JOIN leagues ON leagues.id = league_users.leagueid
WHERE userid = $1`

exports.getMostRecentRiderAdds = `
SELECT *
FROM weekly_team a
WHERE last_transaction = (
    SELECT MAX(last_transaction)
    FROM weekly_team
)`;

exports.SaveFeedback = `
INSERT INTO feedback (username, report_type, registered, feature, bugreport, feedback) VALUES ($1, $2, $3, $4, $5, $6)`

exports.MainLeagueStatTrackerData = `
WITH riders_json AS (
SELECT userid, ARRAY_AGG(row_to_json(json_rows)) AS riders
FROM
(SELECT weekly_team.userid, users.username, weekly_team.leagueid, weekly_team.seasonid, weekly_team.season_weeksid, riders.name, riders.riderid AS riderid
FROM riders
INNER JOIN weekly_team
ON riders.riderid = weekly_team.riderid
INNER JOIN users
ON weekly_team.userid = users.id
WHERE weekly_team.leagueid = 1 AND weekly_team.seasonid = 1 AND weekly_team.season_weeksid = $1) AS json_rows
GROUP BY userid)
SELECT wt.userid, users.username, riders_json.riders::jsonb[]
FROM weekly_team AS wt
INNER JOIN riders_json
ON riders_json.userid = wt.userid
JOIN users ON wt.userid = users.id
GROUP BY wt.userid, users.username, riders_json.riders::jsonb[]`

exports.getCurrentWeeksRiders =
`SELECT wt.id AS weeklyteamid, wt.riderid, r.name, r.avatar_url, r.cost, r.rider_number, r.active, s.currentseason, s.season_name, sw.currentweek  FROM weekly_team AS wt
JOIN riders AS r ON r.riderid = wt.riderid
JOIN (SELECT MAX(seasonid) AS currentseason, season_name FROM seasons GROUP BY season_name) AS s ON wt.seasonid = s.currentseason
JOIN (SELECT MAX(week_number) AS currentweek FROM season_weeks) AS sw ON wt.season_weeksid = sw.currentweek
WHERE userid = $1`;

exports.getLatestRaceResult = '';

// exports.getMainLeagueTotalStandings = `SELECT DISTINCT(wt.id) AS weeklyteamid, u.username, wt.riderid, wt.userid, wt.season_weeksid, r.name, r.avatar_url, r.active, rr.place, s.currentseason, s.season_name, wt.leagueid  FROM weekly_team AS wt
// JOIN users AS u ON wt.userid = u.id
// JOIN riders AS r ON r.id = wt.riderid
// JOIN (SELECT MAX(seasonid) AS currentseason, season_name FROM seasons GROUP BY season_name) AS s ON wt.seasonid = s.currentseason
// JOIN (SELECT season_weeksid, seasonid FROM season_weeks) AS wn ON wt.season_weeksid = wn.season_weeksid
// JOIN raceresults AS rr ON wt.riderid = rr.riderid
// WHERE wt.leagueid = 1
// ORDER BY wt.userid`;

exports.getMainLeagueTotalStandings = `WITH riders_json AS (
SELECT userid, ARRAY_AGG(row_to_json(json_rows)) AS WeeklyTeams
FROM
(SELECT weekly_team.userid, users.username, name, raceresults.points, weekly_team.season_weeksid, weekly_team.seasonid, weekly_team.leagueid
FROM riders
INNER JOIN weekly_team
ON riders.riderid = weekly_team.riderid
INNER JOIN users
ON weekly_team.userid = users.id
INNER JOIN raceresults
ON riders.riderid = raceresults.riderid) AS json_rows
WHERE json_rows.leagueid = 1
GROUP BY userid)
SELECT wt.userid, riders_json.WeeklyTeams::jsonb[]
FROM weekly_team AS wt
INNER JOIN riders_json
ON riders_json.userid = wt.userid
INNER JOIN users
ON users.id = wt.userid
GROUP BY wt.userid, riders_json.WeeklyTeams::jsonb[]`

// exports.getMainLeagueTotalStandings = `SELECT ARRAY_AGG(p.username) AS username, ARRAY_AGG(wt.id) AS weekly_ids, ARRAY_AGG(wt.riderid) AS selectedracerids, ARRAY_AGG(riders.name) AS selectedracers, wt.season_weeksid AS season_weeks, raceresults.weekid AS raceweeks, raceresults.seasonid as raceseasons, ARRAY_AGG(raceresults.points) AS points FROM users AS p
// LEFT OUTER JOIN (SELECT * FROM weekly_team ) AS wt ON (wt.userid = p.id)
// LEFT OUTER JOIN riders ON (wt.riderid = riders.riderid)
// LEFT outer JOIN raceresults ON wt.seasonid = raceresults.seasonid AND raceresults.weekid = wt.season_weeksid AND raceresults.riderid = riders.riderid
// GROUP BY p.id, season_weeks, raceweeks, raceseasons `

exports.getMainLeagueLeader = `SELECT DISTINCT(wt.id) AS weeklyteamid, wt.riderid, wt.userid, wt.season_weeksid, r.name, r.avatar_url, r.active, rr.place, s.currentseason, s.season_name, wt.leagueid  FROM weekly_team AS wt
JOIN riders AS r ON r.riderid = wt.riderid
JOIN (SELECT MAX(seasonid) AS currentseason, season_name FROM seasons GROUP BY season_name) AS s ON wt.seasonid = s.currentseason
JOIN (SELECT season_weeksid, seasonid FROM season_weeks) AS wn ON wt.season_weeksid = wn.season_weeksid
JOIN raceresults AS rr ON wt.riderid = rr.riderid
WHERE wt.leagueid = $1
ORDER BY wt.userid`;

exports.getUsersWeeklyTeams = `SELECT weekly_team.id, weekly_team.leagueid, weekly_team.season_weeksid, riders.riderid, riders.name, riders.avatar_url, riders.cost as currentcost, riders.rider_number, riders.active, price_history.price as previous_price, price_history.season_weekid, raceresults.place, raceresults.points FROM weekly_team
JOIN riders ON weekly_team.riderid = riders.riderid
JOIN price_history ON weekly_team.riderid = price_history.riderid
LEFT OUTER JOIN raceresults ON weekly_team.riderid = raceresults.riderid AND weekly_team.season_weeksid = raceresults.weekid
WHERE price_history.season_weekid >= 1 AND price_history.season_weekid <= $1
AND weekly_team.userid = $2`

exports.getAllRaceResults = `SELECT riders.riderid, riders.rider_number, riders.name, ROUND(AVG(place),2), MAX(place), MIN(place) FROM raceresults
JOIN riders ON raceresults.riderid = riders.riderid
GROUP BY riders.riderid, riders.name`;

exports.getRaceResultStatsForCurrentYear = `SELECT riders.riderid, riders.name, ROUND(AVG(place),2), MAX(place), MIN(place) FROM raceresults
JOIN riders ON raceresults.riderid = riders.riderid
JOIN seasons ON raceresults.seasonid = seasons.seasonid
GROUP BY riders.riderid, riders.name`

exports.getMainLeagueTeamByWeekAndUserId = `SELECT wt.id, wt.userid, wt.riderid, wt.season_weeksid, wt.points, wt.last_transaction, riders.name, riders.avatar_url, riders.cost as cost, riders.rider_number, riders.active, price_history.price as lastprice  FROM weekly_team AS wt
JOIN riders ON wt.riderid = riders.riderid
JOIN price_history ON riders.riderid = price_history.riderid
WHERE userid = $1 AND wt.season_weeksid = $2 AND leagueid = 1`

exports.saveTeam = `
UPDATE weekly_team SET riderid = $2 WHERE id = $1;
`;

exports.createRosterSlots = `
INSERT INTO weekly_team (id, userid, seasonid, leagueid, riderid, season_weeksid) VALUES (nextval('weekly_team_id_seq'), $1, 1, 1, $3, $2);`

exports.SaveResults = function (raceResults, week) {
	var statement = "";
	raceResults.forEach(racer => {
		var line = `INSERT INTO raceresults (seasonid, weekid, riderid, place, points) VALUES (1, ${week}, ${racer.id}, ${racer.place}, ${racer.points}); \n`;
		statement += line;
	})
	return statement;
}

exports.GetCurrentMyTeamWeek = function () {
	if (Date.now() < new Date(2018, 00, 06, 19, 59).getTime()) {
		return 1
	}
	if (Date.now() < new Date(2018, 00, 13, 17, 59).getTime()) {
		return 2
	}
	if (Date.now() < new Date(2018, 00, 20, 19, 59).getTime()) {
		return 3
	}
	if (Date.now() < new Date(2018, 00, 27, 17, 59).getTime()) {
		return 4
	}
	if (Date.now() < new Date(2018, 01, 03, 16, 59).getTime()) {
		return 5
	}
	if (Date.now() < new Date(2018, 01, 10, 19, 59).getTime()) {
		return 6
	}
	if (Date.now() < new Date(2018, 01, 17, 17, 59).getTime()) {
		return 7
	}
	if (Date.now() < new Date(2018, 01, 24, 16, 59).getTime()) {
		return 8
	}
	if (Date.now() < new Date(2018, 02, 03, 16, 59).getTime()) {
		return 9
	}
	if (Date.now() < new Date(2018, 02, 10, 16, 59).getTime()) {
		return 10
	}
	if (Date.now() < new Date(2018, 02, 17, 16, 59).getTime()) {
		return 11
	}
	if (Date.now() < new Date(2018, 02, 24, 15, 59).getTime()) {
		return 12
	}
	if (Date.now() < new Date(2018, 03, 07, 18, 59).getTime()) {
		return 13
	}
	if (Date.now() < new Date(2018, 03, 14, 16, 59).getTime()) {
		return 14
	}
	if (Date.now() < new Date(2018, 03, 21, 11, 59).getTime()) {
		return 15
	}
	if (Date.now() < new Date(2018, 03, 28, 13, 29).getTime()) {
		return 16
	}
	if (Date.now() < new Date(2018, 04, 05, 18, 59).getTime()) {
		return 17
	}
}

exports.GetUsersTeamWeeks = function () {
	if (Date.now() < new Date(2018, 00, 13, 17, 59).getTime() && Date.now() > new Date(2018, 00, 06, 19, 59)) {
		return 1
	}
	if (Date.now() < new Date(2018, 00, 20, 19, 59).getTime() && Date.now() > new Date(2018, 00, 13, 17, 59)) {
		return 2
	}
	if (Date.now() < new Date(2018, 00, 27, 17, 59).getTime() && Date.now() > new Date(2018, 00, 20, 19, 59)) {
		return 3
	}
	if (Date.now() < new Date(2018, 01, 03, 16, 59).getTime() && Date.now() > new Date(2018, 00, 27, 17, 59)) {
		return 4
	}
	if (Date.now() < new Date(2018, 01, 10, 19, 59).getTime() && Date.now() > new Date(2018, 01, 03, 16, 59)) {
		return 5
	}
	if (Date.now() < new Date(2018, 01, 17, 17, 59).getTime() && Date.now() > new Date(2018, 01, 10, 19, 59)) {
		return 6
	}
	if (Date.now() < new Date(2018, 01, 24, 17, 59).getTime() && Date.now() > new Date(2018, 01, 17, 17, 59)) {
		return 7
	}
	if (Date.now() < new Date(2018, 02, 03, 16, 59).getTime() && Date.now() > new Date(2018, 01, 24, 17, 59)) {
		return 8
	}
	if (Date.now() < new Date(2018, 02, 10, 16, 59).getTime() && Date.now() > new Date(2018, 02, 03, 16, 59)) {
		return 9
	}
	if (Date.now() < new Date(2018, 02, 17, 16, 59).getTime() && Date.now() > new Date(2018, 02, 10, 16, 59)) {
		return 10
	}
	if (Date.now() < new Date(2018, 02, 24, 15, 59).getTime() && Date.now() > new Date(2018, 02, 17, 16, 59)) {
		return 12
	}
	if (Date.now() < new Date(2018, 03, 07, 18, 59).getTime() && Date.now() > new Date(2018, 02, 24, 15, 59)) {
		return 12
	}
	if (Date.now() < new Date(2018, 03, 14, 16, 59).getTime()&& Date.now() > new Date(2018, 03, 07, 18, 59)) {
		return 13
	}
	if (Date.now() < new Date(2018, 03, 21, 11, 59).getTime() && Date.now() > new Date(2018, 03, 14, 16, 59)) {
		return 14
	}
	if (Date.now() < new Date(2018, 03, 28, 13, 29).getTime() && Date.now() > new Date(2018, 03, 21, 11, 59)) {
		return 15
	}
	if (Date.now() < new Date(2018, 04, 05, 18, 59).getTime() && Date.now() > new Date(2018, 03, 28, 13, 29)) {
		return 16
	}
	if (Date.now() < new Date(2018, 12, 31, 17, 59).getTime() && Date.now() > new Date(2018, 04, 05, 18, 59)) {
		return 17
	}
}

exports.GetCurrentStatTrackerWeek = function () {
  if (Date.now() < new Date(2018, 00, 06, 23).getTime()) {
    return 1
  }
  if (currentdate < new Date(2018, 00, 13, 23)) {
    return 2
  }
  if (currentdate < new Date(2018, 00, 20, 23)) {
    return 3
  }
  if (currentdate < new Date(2018, 00, 27, 23)) {
    return 4
  }
  if (currentdate < new Date(2018, 01, 3, 23)) {
    return 5
  }
  if (currentdate < new Date(2018, 01, 10, 23)) {
    return 6
  }
  if (currentdate < new Date(2018, 01, 17, 23)) {
    return 7
  }
  if (currentdate < new Date(2018, 01, 24, 23)) {
    return 8
  }
  if (currentdate < new Date(2018, 02, 03, 23)) {
    return 9
  }
  if (currentdate < new Date(2018, 02, 10, 23)) {
    return 10
  }
  if (currentdate < new Date(2018, 02, 17, 23)) {
    return 11
  }
  if (currentdate < new Date(2018, 02, 24, 23)) {
    return 12
  }
  if (currentdate < new Date(2018, 03, 07, 23)) {
    return 13
  }
  if (currentdate < new Date(2018, 03, 14, 23)) {
    return 14
  }
  if (currentdate < new Date(2018, 03, 21, 23)) {
    return 15
  }
  if (currentdate < new Date(2018, 03, 28, 23)) {
    return 16
  }
  if (currentdate < new Date(2018, 04, 05, 23)) {
    return 17
  }
}

exports.GetCurrentWeekForCron = function () {
  if (Date.now() < new Date(2018, 00, 12, 23).getTime()) {
    return 1
  }
  if (currentdate < new Date(2018, 00, 19, 23)) {
    return 2
  }
  if (currentdate < new Date(2018, 00, 26, 23)) {
    return 3
  }
  if (currentdate < new Date(2018, 01, 02, 23)) {
    return 4
  }
  if (currentdate < new Date(2018, 01, 09, 23)) {
    return 5
  }
  if (currentdate < new Date(2018, 01, 16, 23)) {
    return 6
  }
  if (currentdate < new Date(2018, 01, 23, 23)) {
    return 7
  }
  if (currentdate < new Date(2018, 02, 02, 23)) {
    return 8
  }
  if (currentdate < new Date(2018, 02, 09, 23)) {
    return 9
  }
  if (currentdate < new Date(2018, 02, 16, 23)) {
    return 10
  }
  if (currentdate < new Date(2018, 02, 23, 23)) {
    return 11
  }
  if (currentdate < new Date(2018, 03, 06, 23)) {
    return 12
  }
  if (currentdate < new Date(2018, 03, 13, 23)) {
    return 13
  }
  if (currentdate < new Date(2018, 03, 20, 23)) {
    return 14
  }
  if (currentdate < new Date(2018, 03, 27, 23)) {
    return 15
  }
  if (currentdate < new Date(2018, 04, 04, 23)) {
    return 16
  }
  if (currentdate < new Date(2018, 04, 11, 23)) {
    return 17
  }
}

exports.GetCurrentWeekForTest =  function () {
  var currentdate = Date.now();
	if (Date.now() < new Date(2018, 00, 06, 19, 55).getTime()) {
    return 1
  }
  if (Date.now() < new Date(2018, 00, 13, 19, 55).getTime()) {
    return 2
  }
  if (currentdate < new Date(2017, 08, 20, 03)) {
    return 3
  }
  if (currentdate < new Date(2017, 08, 27, 03)) {
    return 4
  }
  if (currentdate < new Date(2017, 09, 3, 03)) {
    return 5
  }
  if (currentdate < new Date(2017, 09, 10, 03)) {
    return 6
  }
  if (currentdate < new Date(2017, 09, 17, 03)) {
    return 7
  }
  if (currentdate < new Date(2017, 09, 24, 03)) {
    return 8
  }
  if (currentdate < new Date(2017, 10, 03, 03)) {
    return 9
  }
  if (currentdate < new Date(2017, 10, 10, 03)) {
    return 10
  }
  if (currentdate < new Date(2017, 10, 17, 03)) {
    return 11
  }
  if (currentdate < new Date(2017, 10, 24, 03)) {
    return 12
  }
  if (currentdate < new Date(2017, 11, 07, 03)) {
    return 13
  }
  if (currentdate < new Date(2017, 11, 14, 03)) {
    return 14
  }
  if (currentdate < new Date(2017, 11, 21, 03)) {
    return 15
  }
  if (currentdate < new Date(2017, 11, 28, 03)) {
    return 16
  }
  if (currentdate < new Date(2017, 00, 05, 03)) {
    return 17
  }
}

exports.getUserStart = `
SELECT username FROM users
WHERE username != 'seth'`



// potential query - grabs the users and total points for a league
// SELECT res.userid, SUM(res.place) FROM (
// SELECT weekly_team.*, raceresults.place FROM weekly_team
// INNER JOIN raceresults ON weekly_team.seasonid = raceresults.seasonid AND weekly_team.riderid = raceresults.riderid
// WHERE leagueid = 1) AS res
// GROUP BY res.userid
