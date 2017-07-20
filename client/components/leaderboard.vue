<template>
  <div>
  <div>
    LEADERBOARDS
  </div>
  <div v-for="user in standings" v-if="doneLoading">
      {{user.riders[0].username}} - {{user.totalpoints}} -
      <span v-for="rider in user.riders">
        {{rider.name}} - {{rider.points}}pts 
      </span>
  </div>
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
        mainLeagueUsers: []
      }
    },
    computed: {
      standings: function() {
        return this.mainLeagueUsers.sort((a, b) => {
          var aPoints = 0;
          var bPoints = 0;
          a.riders.forEach(rider => { aPoints += rider.points })
          b.riders.forEach(rider => { bPoints += rider.points })
          return aPoints - bPoints;
        })
      },
    },
    beforeCreate() {
       setTimeout(() => {
         axios.get('/RaceResults')
         .then(data => {
           console.time();
           var results = data.data.B;
           console.log(results);
           this.mainLeagueUsers.forEach(user => {
             user.totalpoints = 0;
             user.riders.forEach(rider => {
               results.forEach(result => {
                 if (result.F.slice(0, -1) == rider.name) {
                   rider.points = result.A;
                 }
               })
               user.totalpoints += rider.points;
             })
           })
          console.timeEnd();
          this.doneLoading = true;
          console.log(this.mainLeagueUsers)
        })
       }, 3000);
      axios.get('/getMainLeagueInfo')
      .then(data => {
        console.log(data.data);
        data.data.forEach(user => {
          this.mainLeagueUsers.push(user)
        })
      })
    }
  }
</script>
