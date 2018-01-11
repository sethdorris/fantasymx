<template>
    <div class="container myaccount-container">
     <p>We wanted to roll this feature out ASAP; bare with us as we are working on making this more presentable. </p>
     <div v-for="(pick, index) in picks">
       <p v-show="week_index.indexOf(index) > -1">Week {{pick.season_weeksid}}</p>
       <p>{{pick.name}} at ${{pick.previous_price}} scored {{pick.points}} by finishing {{pick.place}}</p>
       <hr v-show="hrs.indexOf(index) > -1">
     </div>
    </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        picks: [],
        hrs: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63, 67],
        week_index: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68]
      }
    },
    created() {

    },
    beforeCreate() {
      axios.post('/GetUserTeams', {
        userid: this.$route.params.id
      })
      .then(data => {
        console.log(data.data);
        this.picks = data.data;
      })
    }
  }
</script>
<style>
  .myaccount-container {
    display:flex;
    flex-direction:column;
    width: 45%;
    color: white;
    margin-top: 2rem;
  }
</style>
