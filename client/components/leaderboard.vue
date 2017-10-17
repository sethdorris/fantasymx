<template>
  <div>
    <div class="columns leaderboard">
      <div class="column is-half is-offset-one-quarter">
        <table class="leaderboard-table" v-if="doneLoading">
          <thead>
            <tr class="title">
              <th colspan="4">2018 Fantasy SX: {{CurrentLeague.name}} Standings</th>
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
            <tr v-for="(user, index) in standings">
              <td>{{ index + 1 }}.</td>
              <td>{{user.totalpoints}}</td>
              <td>{{user.weeklyteams[0].username}}</td>
              <td v-bind:class="{ 'pointsback': index > 0 }">{{ pointsbehind(user) }}</td>
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
      ...mapGetters([
        'getUserData'
      ])
    },
    created() {
      console.log("environment", process.env.NODE_ENV)
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
          return user.totalpoints - this.standings[0].totalpoints;
        }
        return '-'
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
    url('https://images.pexels.com/photos/37527/sports-games-fun-holiday-37527.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb');
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
</style>
