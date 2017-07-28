<template>
  <div>
  <div class="leaderboard-title">
    2018 FantasySX Main League
  </div>
  <div class="columns leaderboard">
    <div class="column is-half is-offset-one-quarter">
      <table class="table is-striped" v-if="doneLoading">
        <thead>
          <tr>
            <th>Position</th>
            <th>Total Points</th>
            <th>Username</th>
            <th>Points Back</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>Position</th>
            <th>Total Points</th>
            <th>Username</th>
            <th>Points Back</th>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="(user, index) in standings">
            <td>{{ index + 1 }}.</td>
            <td>{{user.totalpoints}}</td>
            <td>{{user.weeklyteams[0].username}}</td>
            <td class="pointsback">{{ pointsbehind(user) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!doneLoading">
        <p>"This data doesn't fetch itself.. Loading Race Tracker."</p>
      </div>
    </div>
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
          user.weeklyteams.forEach(wt => { user.totalpoints += wt.place })
          user.weeklyteams.sort((a, b) => {
            return a - b;
          })
        })
        this.doneLoading = true;
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
  .pointsback: {
    font-weight: bolder;
    color: #ff3860;
  }
  .leaderboard {
    margin-top: 50px;
  }
  table td, th {
    text-align: center !important;
  }
  .leaderboard-main {
    margin-top: 25px;
  }
  .leaderboard-title {
    text-align: center;
    text-decoration: underline;
    font-weight: 700;
  }
</style>
