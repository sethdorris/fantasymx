var _ = require("lodash");
exports.Create = function (data) {
    var currentTeamids = [];
    var availRidersId = [];
    var availRidersModel = [];

    var availableRiders = _.pullAllBy(data.AvailableRiders, data.CurrentTeam, 'riderid')

    availableRiders.forEach(rider => {
      data.Stats.forEach(riderStat => {
        if (rider.riderid == riderStat.riderid) {
          availRidersModel.push({
            active: rider.active,
            avatar_url: rider.avatar_url,
            cost: rider.cost,
            riderid: rider.riderid,
            name: rider.name,
            number: rider.number,
            highestFinish: riderStat.min,
            lowestFinish: riderStat.max,
            averageFinish: riderStat.round
          })
        }
      })
    })

    data.CurrentTeam.forEach(rider => {
      data.Stats.forEach(riderStat => {
        if (rider.riderid == riderStat.riderid) {
          rider.highestFinish = riderStat.min,
          rider.lowestFinish = riderStat.max,
          rider.averageFinish = riderStat.round
        }
      })
    })

    var ridersWithNoResults = _.differenceBy(availableRiders, availRidersModel, 'riderid');

    ridersWithNoResults.forEach(rider => {
      availRidersModel.push(
        {
          active: rider.active,
          avatar_url: rider.avatar_url,
          cost: rider.cost,
          riderid: rider.riderid,
          name: rider.name,
          number: rider.number,
          highestFinish: '-',
          lowestFinish: '-',
          averageFinish: '-'
        })
    });
    if (data.CurrentTeam.length < 4) {
      for (var i = data.CurrentTeam.length; i < 4; i++) {
        data.CurrentTeam.push({
          active: '',
          avatar_url: 'http://www.shopaardvark.com/media/catalog/product/W/S/WS-18655.jpg',
          cost: 0,
          riderid: '-',
          name: 'OPEN SLOT',
          rider_number: 0,
          highestFinish: '-',
          lowestFinish: '-',
          averageFinish: '-'
        })
      }
    }

    return { CurrentTeam: data.CurrentTeam, AvailableRiders: availRidersModel };
  }