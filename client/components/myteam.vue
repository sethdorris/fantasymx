<template>
  <div class="content">
    <div class="page-title">MY TEAM - TEAM SELECTION FOR WEEK {{ currentweek }}</div>
    <p class="page-subheader">Week {{ currentweek }} Balance: ${{dollars}}</p>
    <div class="riders-container">
      <article class="rider-block" v-for="rider in getUserData.recentteam">
        <p class="title">{{rider.name}} - #{{rider.rider_number}}</p>
        <p class="subtitle footer">Cost: ${{rider.cost}}</p>
      </article>
    </div>
    <div class="riders-container">
      <article class="rider-block" v-for="rider in filteredAvailable">
        <p class="title">{{rider.name}} - #{{rider.rider_number}}</p>
        <p class="subtitle footer">Cost: ${{rider.cost}}</p>
      </article>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        dollars: 8,
        currentweek: 0,
        allriders: []
      }
    },
    computed: {
      ...mapGetters([
        'getUserData'
      ]),
      filteredAvailable() {
        return this.allriders.filter(rider => {
          var ids = []
          this.getUserData.recentteam.forEach(obj => {
            ids.push(obj.riderid);
          })
          return ids.indexOf(rider.id) == -1;
        })
      }
    },
    beforeCreate() {
      axios.get('/GetAllAvailableRiders')
      .then(data => {
        this.allriders = data.data;
      })
      axios.get('/GetCurrentWeek')
      .then(data => {
        this.currentweek = data.data.week;
      })
    }
  }
</script>
<style>
  .riders-container {
    display: flex;
    flex-wrap: wrap;
    margin: 2rem 15rem;
  }
  .rider-block {
    min-width: 17rem;
    border: 1px solid #dedede;
    margin: 1em;
    box-shadow: 1px 1px 1px #cecece;
    padding: 1rem;
    width: 18rem;
  }
  .page-title {
    text-align: center;
    text-decoration: underline;
    font-weight: 700;
  }
  .page-title {
    text-align: center;
    text-decoration: underline;
    font-weight: 700;
  }
  .page-subheader {
    text-align:center;
  }
</style>
