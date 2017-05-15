<template>
  <div>
  <div>
    LEADERBOARDS
  </div>
  <div v-for="user in standings" v-if="doneLoading">
      {{user.user}} - {{user.currentPoints}}
  </div>
  <div v-if="!doneLoading">
    <p>"This data doesn't fetch itself.. Loading Race Tracker."</p>
    <img src="https://m.popkey.co/163fce/Llgbv_s-200x150.gif" />
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
        mainLeagueUsers: []
      }
    },
    computed: {
      standings: function() {
        return this.mainLeagueUsers.sort((a, b) => {
          return a.currentPoints - b.currentPoints;
        })
      }
    },
    mounted() {
       setTimeout(() => {
         axios.get('https://live.amasupercross.com/xml/sx/RaceResults.json?R=1494731612736')
         .then(data => {
           console.time();
           var results = data.data.B;
           console.log(results);
           this.mainLeagueUsers.forEach(user => {
             var actualResults = results.filter(o => {
               return user.riders.indexOf(o.F.slice(0, -1)) > -1;
             });
             console.log("actualResults", actualResults);
             actualResults.forEach(result => {
               console.log("currentpoints", this.mainLeagueUsers);
               user.currentPoints.push(result.A);
             })
             user.currentPoints = user.currentPoints.reduce((prev, next) => {
               return prev + next;
             })
             console.timeEnd();
             this.doneLoading = true;
           })
         })
       }, 3000);
      axios.get('/getMainLeagueInfo')
      .then(data => {
        for (var user in data.data) {
          var obj = {};
          obj.user = user;
          obj.riders = data.data[user];
          obj.currentPoints = [];
          this.mainLeagueUsers.push(obj);
        }
      })
    }
  }
</script>
