<template>
  <div>
    <div class="columns leaderboard">
      <div class="column is-half is-offset-one-quarter">
        <p style="color:white;text-align:center;font-size:16pt;">
          This site is currently in pre-alpha test.
        </p>
        <p style="color:white;margin-bottom:2rem;">
          Server slowdown and minor bugs may be experienced. Please report bugs and your suggestions
          for improvements using the Suggestions link. We will work quickly to correct all issues.
        </p>
        <table class="leaderboard-table" v-if="doneLoading">
          <thead>
            <tr class="title">
              <th colspan="4">2018 Fantasy SX: Main League Standings</th>
            </tr>
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
            <tr v-for="(user, index) in standings" v-bind:class="{ 'Me': IsMe(user) }">
              <td>{{ index + 1 }}.</td>
              <td>{{user.totalpoints}}</td>
              <td>{{user.weeklyteams[0].username}}</td>
              <td v-bind:class="{ 'pointsback': index > 0 }">{{ pointsbehind(user) }}</td>
            </tr>
          </tbody>
        </table>
        <p style="color:white;margin-top:2rem;text-align:center;">Thank you for testing Salarycap SX</p>
        <div v-if="!doneLoading">
          <p>"This data doesn't fetch itself.. Loading Race Tracker."</p>
        </div>
      </div>
    </div>
</div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
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

      },
      ...mapGetters([
        'getUserData'
      ])
    },
    created() {
      axios.get('/MainLeagueStandings')
      .then(data => {
        console.log("league standings", data.data)
        this.mainLeagueUsers = data.data;
        this.mainLeagueUsers.forEach((user) => {
          if (typeof user.weeklyteams != 'undefined') {
            user.totalpoints = 0;
            user.weeklyteams.forEach(wt => { user.totalpoints += wt.points })
            user.weeklyteams.sort((a, b) => {
              return a - b;
            })
          } else {
            user.totalpoints = 0;
          }
        })
        this.doneLoading = true;
      })
    },
    methods: {
      pointsbehind: function(user) {
        var objIndex = this.standings.indexOf(user);
        if (objIndex != 0) {
          return user.totalpoints - this.standings[0].totalpoints;
        }
        return '-'
      },
      IsMe: function (user) {
        if (user.weeklyteams[0].username == this.getUserData.username) {
          console.log("username", this.getUserData.username)
          return true;
        }
        return false;
      }
    }
  }
</script>
<style>
body {
  font-family: "Open Sans Condensed";
  height: 100%;
  min-height: 100vh;
  background:
    linear-gradient(to bottom right, rgba(251, 109, 8, .8)0%, rgba(204, 66, 0, 1)100%),
    url('https://static1.squarespace.com/static/565cb668e4b09e25856888ee/565cd3ade4b0c668da751789/56819b9e841ababe41554bc2/1454944530380/?format=1500w');
  background-size: cover;
  background-position:center;
  background-repeat: no-repeat;
}
.leaderboard-table .title > th {
  border-bottom: 1px solid #f5f5a2;
  font-size: 16pt;
  padding: .5rem;
}
.leaderboard-table {
  background-color: rgba(255, 255, 255, .8);
  color: #7b7b7b;
  box-shadow: 1px 1px 10px #222;
}
.leaderboard-table thead th, tfoot th {
  color: #fff;
  font-size: 12pt;
}
.leaderboard-table thead, tfoot {
  background: linear-gradient(rgba(255, 106, 0, 1)0%, rgba(156, 52, 0, 1)100%);
}
.leaderboard-table td {
  border: none;
}
.leaderboard-table tr:hover {
  background-color: rgba(255, 233, 120, .2);
}
  .pointsback {
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
  .Me {
    background-color: rgba(255, 233, 120, .7);
    color: #d24a00;
    font-weight: 600;
  }
</style>
