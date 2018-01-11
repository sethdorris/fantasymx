var _find = require('lodash/find')
exports.Create = function (racedata, leaguedata) {
  //Find out the placings of each racer.
  leaguedata.forEach(user => {
    user.riders.forEach(rider => {
      console.log(rider)
      var riderplace = _find(racedata.raceData.B, o => { return o.F.indexOf(rider.name) > -1 })
      console.log("rider place", riderplace)
      if (riderplace != undefined && riderplace.A <= 22) {
        var place = riderplace.A;
        rider.points = pointstable[place];
        console.log("Points Table", pointstable[place])
      } else {
        rider.points = 0;
      }
    })
    var total = 0;
    user.riders.forEach(rider => {
      total += rider.points;
    })
    user.total = total;
  })
  return { RaceData: racedata, LeagueData: leaguedata }
}

exports.GetRacerNamesInRaceResults = function (racerarray) {
  var results = []
  racerarray.forEach(racer => {
    results.push(racer.F.slice(0, -1))
  })
  return results;
}

exports.GetRaceResultsObjects = function (racerIdArray, resultsArray) {
  var results = []
  console.log("racerIdArray", racerIdArray);
  console.log("resultsArray", resultsArray);
  resultsArray.forEach((racer, index) => {
    if (racerIdArray[index]) {
      var score = pointstable[racer.A];
        var racerObj = {
          id: racerIdArray[index].riderid,
          name: racer.F.slice(0, -1),
          place: racer.A,
          points: pointstable[racer.A]
        }
        results.push(racerObj);
      }
  })
  console.log("statrackervm 47", results)
  return results;
}

var pointstable = {
  1: 26,
  2: 23,
  3: 21,
  4: 19,
  5: 18,
  6: 17,
  7: 16,
  8: 15,
  9: 14,
  10: 13,
  11: 12,
  12: 11,
  13: 10,
  14: 9,
  15: 8,
  16: 7,
  17: 6,
  18: 5,
  19: 4,
  20: 3,
  21: 2,
  22: 1
}
