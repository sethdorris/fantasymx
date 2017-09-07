var MockResults = require('./MockData');
exports.GetRaceResults = function (index) {
  return MockResults.RaceResults[index];
}
exports.GetRaceData = function (index) {
  return MockResults.RaceData[index]
}
