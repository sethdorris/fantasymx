var _find = require('lodash/find')
exports.Create = function (racedata, leaguedata) {
  //Find out the placings of each racer.
  leaguedata.forEach(user => {
    user.riders.forEach(rider => {
      console.log(rider)
      var riderplace = _find(racedata.raceData.B, o => { return o.F.indexOf(rider.name) > -1 })
      console.log("rider place", riderplace)
      if (riderplace != undefined) {
        rider.points = riderplace.A
      } else {
        rider.points = 45;
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
