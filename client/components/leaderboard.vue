<template>
  <div>
  <div>
    LEADERBOARDS
  </div>
  <table class="table" v-if="doneLoading">
    <thead>
      <tr>
        <th>Total Points</th>
        <th>Username</th>
        <th>W1</th>
        <th>W2</th>
        <th>W3</th>
        <th>W4</th>
        <th>W5</th>
        <th>W6</th>
        <th>W7</th>
        <th>W8</th>
        <th>W9</th>
        <th>W10</th>
        <th>W11</th>
        <th>W12</th>
        <th>W13</th>
        <th>W14</th>
        <th>W15</th>
        <th>W16</th>
        <th>W17</th>
        <th>Points Back</th>
      </tr>
    </thead>
    <tfoot>Fantasy SX</tfoot>
    <tbody>
      <tr v-for="user in standings">
        <td>{{user.totalpoints}}</td>
        <td>{{user.weeklyteams[0].username}}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td class="pointsback">{{ pointsbehind(user) }}</td>
      </tr>
    </tbody>
  </table>
  <div v-if="!doneLoading">
    <p>"This data doesn't fetch itself.. Loading Race Tracker."</p>
  </div>
</div>
</template>
<script>
import axios from 'axios';
  export default {
    data() {
      return {
        doneLoading: false,
        results: [],
        mainLeagueUsers: [],
        weeklyteams: []
      }
    },
    computed: {
      standings: function() {
        return this.mainLeagueUsers.sort((a, b) => {
          var aPoints = 0;
          var bPoints = 0;
          a.weeklyteams.forEach(team => { aPoints += team.place })
          b.weeklyteams.forEach(team => { bPoints += team.place })
          return aPoints - bPoints;
        })
      },
      newstandings: function() {

      }
    },
    created() {
      axios.get('/MainLeagueStandings')
      .then(data => {
        this.mainLeagueUsers = data.data;
        this.mainLeagueUsers.forEach((user) => {
          user.totalpoints = 0
          user.weeklypoints = []
          user.weeklyteams.forEach(wt => { user.totalpoints += wt.place })
          user.weeklyteams.sort((a, b) => {
            return a - b;
          })
        })
        this.doneLoading = true;
        console.log("sorted", this.mainLeagueUsers)
      })
    },
    methods: {
      pointsbehind: function(user) {
        var objIndex = this.standings.indexOf(user);
        if (objIndex != 0) {
          return user.totalpoints - this.standings[objIndex - 1].totalpoints;
        }
        return '-'
      }
    }
    // beforeCreate() {
    //    setTimeout(() => {
    //      axios.get('/RaceResults')
    //      .then(data => {
    //        console.time();
    //        var results = data.data.B;
    //        console.log(results);
    //        this.mainLeagueUsers.forEach(user => {
    //          user.totalpoints = 0;
    //          user.riders.forEach(rider => {
    //            results.forEach(result => {
    //              if (result.F.slice(0, -1) == rider.name) {
    //                rider.points = result.A;
    //              }
    //            })
    //            user.totalpoints += rider.points;
    //          })
    //        })
    //       console.timeEnd();
    //       this.doneLoading = true;
    //       console.log(this.mainLeagueUsers)
    //     })
    //    }, 3000);
    //   axios.get('/getMainLeagueInfo')
    //   .then(data => {
    //     console.log(data.data);
    //     data.data.forEach(user => {
    //       this.mainLeagueUsers.push(user)
    //     })
    //   })
    // }
  }
</script>
<style>
  .pointsback {
    font-weight: bolder;
    color: #ff3860;
  }
</style>
