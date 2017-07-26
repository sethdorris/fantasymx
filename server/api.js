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
`

exports.getCurrentWeeksRiders =
`SELECT wt.id AS weeklyteamid, wt.riderid, r.name, r.avatar_url, r.active, s.currentseason, s.season_name, sw.currentweek  FROM weekly_team AS wt
JOIN riders AS r ON r.id = wt.riderid
JOIN (SELECT MAX(seasonid) AS currentseason, season_name FROM seasons GROUP BY season_name) AS s ON wt.seasonid = s.currentseason
JOIN (SELECT MAX(week_number) AS currentweek FROM season_weeks) AS sw ON wt.season_weeksid = sw.currentweek
WHERE userid = $1`
