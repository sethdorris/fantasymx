exports.mainLeagueInfoSql = `
WITH riders_json AS (
SELECT userid, ARRAY_AGG(row_to_json(json_rows)) AS riders
FROM
(SELECT weekly_team.userid, users.username, name, points
FROM riders
INNER JOIN weekly_team
ON riders.id = weekly_team.riderid
INNER JOIN users
ON weekly_team.userid = users.id) AS json_rows
GROUP BY userid)
SELECT wt.userid, riders_json.riders::jsonb[]
FROM weekly_team AS wt
INNER JOIN riders_json
ON riders_json.userid = wt.userid
GROUP BY wt.userid, riders_json.riders::jsonb[]
`;

exports.getAllAvailableRiders = `
SELECT * FROM riders
ORDER BY name
`

exports.getCurrentWeeksRiders =
`SELECT wt.id AS weeklyteamid, wt.riderid, r.name, r.avatar_url, r.cost, r.rider_number, r.active, s.currentseason, s.season_name, sw.currentweek  FROM weekly_team AS wt
JOIN riders AS r ON r.id = wt.riderid
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
(SELECT weekly_team.userid, users.username, name, raceresults.place, weekly_team.season_weeksid, weekly_team.seasonid, weekly_team.leagueid
FROM riders
INNER JOIN weekly_team
ON riders.id = weekly_team.riderid
INNER JOIN users
ON weekly_team.userid = users.id
INNER JOIN raceresults
ON riders.id = raceresults.riderid) AS json_rows
WHERE json_rows.leagueid = 1
GROUP BY userid)
SELECT wt.userid, riders_json.WeeklyTeams::jsonb[]
FROM weekly_team AS wt
INNER JOIN riders_json
ON riders_json.userid = wt.userid
INNER JOIN users
ON users.id = wt.userid
GROUP BY wt.userid, riders_json.WeeklyTeams::jsonb[]`

exports.getMainLeagueLeader = `SELECT DISTINCT(wt.id) AS weeklyteamid, wt.riderid, wt.userid, wt.season_weeksid, r.name, r.avatar_url, r.active, rr.place, s.currentseason, s.season_name, wt.leagueid  FROM weekly_team AS wt
JOIN riders AS r ON r.id = wt.riderid
JOIN (SELECT MAX(seasonid) AS currentseason, season_name FROM seasons GROUP BY season_name) AS s ON wt.seasonid = s.currentseason
JOIN (SELECT season_weeksid, seasonid FROM season_weeks) AS wn ON wt.season_weeksid = wn.season_weeksid
JOIN raceresults AS rr ON wt.riderid = rr.riderid
WHERE wt.leagueid = $1
ORDER BY wt.userid`

exports.getAllRaceResults = `SELECT riders.id, riders.name, ROUND(AVG(place),2), MAX(place), MIN(place) FROM raceresults
JOIN riders ON raceresults.riderid = riders.id
GROUP BY riders.id, riders.name`;

exports.getRaceResultStatsForCurrentYear = `SELECT riders.id, riders.name, ROUND(AVG(place),2), MAX(place), MIN(place) FROM raceresults
JOIN riders ON raceresults.riderid = riders.id
JOIN seasons ON raceresults.seasonid = seasons.seasonid
WHERE seasons.end_date < $1 AND seasons.start_date > $2
GROUP BY riders.id, riders.name`

exports.getMainLeagueTeamByWeekAndUserId = `SELECT * FROM weekly_team
JOIN riders ON weekly_team.riderid = riders.id
WHERE userid = $1 AND season_weeksid = $2 AND leagueid = 1`

exports.GetCurrentWeek = function () {
  var currentdate = Date.now();
  if (currentdate < new Date(2018, 00, 06, 03)) {
    return 1
  }
  if (currentdate < new Date(2018, 00, 13, 03)) {
    return 2
  }
  if (currentdate < new Date(2018, 00, 20, 03)) {
    return 3
  }
  if (currentdate < new Date(2018, 00, 27, 03)) {
    return 4
  }
  if (currentdate < new Date(2018, 01, 3, 03)) {
    return 5
  }
  if (currentdate < new Date(2018, 01, 10, 03)) {
    return 6
  }
  if (currentdate < new Date(2018, 01, 17, 03)) {
    return 7
  }
  if (currentdate < new Date(2018, 01, 24, 03)) {
    return 8
  }
  if (currentdate < new Date(2018, 02, 03, 03)) {
    return 9
  }
  if (currentdate < new Date(2018, 02, 10, 03)) {
    return 10
  }
  if (currentdate < new Date(2018, 02, 17, 03)) {
    return 11
  }
  if (currentdate < new Date(2018, 02, 24, 03)) {
    return 12
  }
  if (currentdate < new Date(2018, 03, 07, 03)) {
    return 13
  }
  if (currentdate < new Date(2018, 03, 14, 03)) {
    return 14
  }
  if (currentdate < new Date(2018, 03, 21, 03)) {
    return 15
  }
  if (currentdate < new Date(2018, 03, 28, 03)) {
    return 16
  }
  if (currentdate < new Date(2018, 04, 05, 03)) {
    return 17
  }
}

// potential query - grabs the users and total points for a league
// SELECT res.userid, SUM(res.place) FROM (
// SELECT weekly_team.*, raceresults.place FROM weekly_team
// INNER JOIN raceresults ON weekly_team.seasonid = raceresults.seasonid AND weekly_team.riderid = raceresults.riderid
// WHERE leagueid = 1) AS res
// GROUP BY res.userid
