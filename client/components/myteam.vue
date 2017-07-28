<template>
  <div class="content">
    <div>MY TEAM - TEAM SELECTION FOR WEEK {{ currentweek }}</div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical" v-for="rider in allriders">
        <article class="tile is-child box">
          <p class="title">#{{rider.number}} - {{rider.name}}</p>
          <p class="subtitle">${{rider.cost}}</p>
        </article>
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
        dollars: 8,
        selectedriders: [],
        currentweek: 0,
        allriders: []
      }
    },
    computed: {
      ...mapGetters([
        'getUserData'
      ])
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
