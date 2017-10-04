<template>
  <div>
    <div class="flex-center fl live-header" v-if="!isLoading">
      <div class="live-header-box">
        <div>Session Event: <span class="text-highlight fl-right">{{raceData.raceData.S}}</span></div>
        <div>Season Event:<span class="text-highlight fl-right"> {{raceData.raceData.E}}</span></div>
        <div>Session Status:<span class="text-highlight fl-right"> {{raceData.raceDetails.B}}</span></div>
      </div>
    </div>
    <div class="columns leaderboard">
      <div class="column is-half is-offset-one-quarter">
        <table class="table-live" v-if="!isLoading">
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
            <tr v-for="(user, index) in standings" v-bind:class="[ user.username == getUserData.username ? 'myRow' : '']">
              <td>{{ index + 1 }}.</td>
              <td>{{user.total}}</td>
              <td>{{user.username}}</td>
              <td class="pointsback">{{ pointsbehind(user) }}</td>
            </tr>
          </tbody>
        </table>
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
        leagueData: [],
        raceData: [],
        isLoading: true,
        ws: null
      }
    },
    computed: {
      ...mapGetters([
        'getUserData'
      ]),
      standings: function() {
        return this.leagueData.sort((a, b) => {
          return a.total - b.total;
        })
      }
    },
    created() {
      console.log(process.env.NODE_ENV)
      this.ws = process.env.NODE_ENV == 'production'
        ? new WebSocket("wss://fantasysx.herokuapp.com/tracker")
        : new WebSocket("wss://localhost:3000/tracker");

      var v = this;
      this.ws.onmessage = function (e) {
        var data = JSON.parse(e.data);
        v.isLoading = false;
        v.leagueData = data.LeagueData;
        v.raceData = data.RaceData;
        console.log(data)
      }
      this.ws.onerror = function (e) {
        console.log("Error", e)
      }
    },
    methods:  {
      pointsbehind: function(user) {
        var objIndex = this.leagueData.indexOf(user);
        if (objIndex != 0) {
          return user.total - this.leagueData[0].total;
        }
        return '-'
      }
    },
    beforeDestroy() {
      this.ws.close();
    }
  }
</script>
<style>
.flex-center {
  display:flex;
  justify-content:center;
}
.live-header-box {
  min-width: 360px;
}
.live-header {
  color: white;
  font-size: 12pt;
  margin-top: 3rem;
  font-weight: 700;
}
.text-highlight {
    font-size: 12pt;
    font-weight: 700;
    color: #fffc7f;
}
.fl-right {
  float: right;
}
  .myRow {
    background-color:rgba(255, 233, 120, .35) !important;
  }
  .table-live table td {
    border: none;
  }
  .table-live {
    background-color: rgba(255, 255, 255, .8);
    color: #7b7b7b;
    box-shadow: 1px 1px 10px #222;
  }
  .table-live thead, tfoot {
    background: linear-gradient(rgba(255, 106, 0, 1)0%, rgba(156, 52, 0, 1)100%);
  }
  .table-live thead th, tfoot th {
    color: #fff;
    font-size: 12pt;
  }
  .table-live tr:hover {
    background: rgba(255, 233, 120, .2);
  }
</style>
