<template>
  <div>
    <div class="columns leaderboard">
      <div class="column is-half is-offset-one-quarter">
        <table class="table is-striped" v-if="!isLoading">
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
              <td class="pointsback">-</td>
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
var ws = new WebSocket("wss://localhost:3000/tracker");
  export default {
    data() {
      return {
        leagueData: [],
        raceData: [],
        isLoading: true,

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
    },
    methods:  {
    },
    beforeCreate() {
      var v = this;
      ws.onopen = function () {
        ws.send("Hi")
      }
      ws.onmessage = function (e) {
        var data = JSON.parse(e.data);
        v.isLoading = false;
        console.log(data.LeagueData)
        v.leagueData = data.LeagueData;
      }
      ws.onerror = function (e) {
        console.log("Error", e)
      }
    },
    beforeDestroy() {
      ws.close();
    }
  }
</script>
<style>
  .myRow {
    background-color: rgba(0, 209, 178, 0.35) !important;
  }
</style>
