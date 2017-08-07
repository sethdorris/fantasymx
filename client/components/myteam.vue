<template>
  <div class="content">
    <div class="page-title">MY TEAM - TEAM SELECTION FOR WEEK {{ currentweek }}</div>
    <p class="page-subheader">Week {{ currentweek }} Balance: ${{dollars}}</p>
    <div class="riders-container">
      <article class="rider-block" v-for="rider in getUserData.recentteam">
        <p class="title is-6">{{rider.name}} - #{{rider.rider_number}}</p>
        <p class="subtitle is-6">Cost: ${{rider.cost}}</p>
      </article>
      <div class="card rider-block" v-for="n in 4">
        <header class="card-header">
          <p class="card-header-title">
            OPEN SLOT
          </p>
        </header>
        <div class="card-content">
          <div class="content">
            <img src="http://www.shopaardvark.com/media/catalog/product/W/S/WS-18655.jpg" />
            <!-- <img src="http://motocross.transworld.net/wp-content/blogs.dir/441/files/2013/11/Jason_Anderson_TWMX_735-600x399.jpg" /> -->
          </div>
        </div>
        <footer class="card-footer">
        </footer>
      </div>
    </div>
    <p class="page-title">AVAILABLE RIDERS</p>
    <div class="container">
      <table class="table is-striped">
        <thead>
          <tr>
            <th>Price</th>
            <th>Racer Name</th>
            <th>Racer Number</th>
            <th>Highest Finish</th>
            <th>Lowest Finish</th>
            <th>Average Finish</th>
            <th>Action</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>Price</th>
            <th>Racer Name</th>
            <th>Racer Number</th>
            <th>Highest Finish</th>
            <th>Lowest Finish</th>
            <th>Average Finish</th>
            <th>Action</th>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="rider in filteredAvailable">
            <td>${{rider.cost}}</td>
            <td>{{rider.name}}</td>
            <td>{{rider.rider_number}}</td>
            <td>{{highestFinish(rider.id)}}</td>
            <td>{{lowestFinish(rider.id)}}</td>
            <td>{{averageFinish(rider.id)}}</td>
            <td><a href="/#" v-if="selectedriders.length < 4">SELECT</a></td>
          </tr>
        </tbody>
      </table>
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
        allriders: [],
        selectedriders: [],
        raceresults: []
      }
    },
    computed: {
      ...mapGetters([
        'getUserData'
      ]),
      filteredAvailable() {
        if (this.getUserData.recentteam.length == 0) {
          return this.allriders;
        }
        return this.allriders.filter(rider => {
          var ids = []
          this.getUserData.recentteam.forEach(obj => {
            ids.push(obj.riderid);
            selectedriders.push(obj.riderid);
          })
          return ids.indexOf(rider.id) == -1;
        })
      }
    },
    methods: {
      highestFinish(riderId) {
        var max = "-";
        this.raceresults.forEach(result => {
          if (result.id == riderId) {
            max = result.max;
          }
        })
        return max;
      },
      lowestFinish(riderId) {
        var min = "-";
        this.raceresults.forEach(result => {
          if (result.id == riderId) {
            min = result.min;
          }
        })
        return min;
      },
      averageFinish(riderId) {
        var avg = "-";
        this.raceresults.forEach(result => {
          if (result.id == riderId) {
            avg = result.round;
          }
        })
        return avg;
      }
    },
    beforeCreate() {
      axios.get('/GetAllAvailableRiders')
      .then(data => {
        console.log("available riders", data.data)
        this.allriders = data.data;
      })
      axios.get('/GetCurrentWeek')
      .then(data => {
        this.currentweek = data.data.week;
      })
      axios.get('/RaceResultsHistory')
      .then(data => {
        console.log("Race results", data.data)
        this.raceresults = data.data;
      })
      axios.get('/CurrentMyTeamModel')
      .then(data => {
        console.log("Current Team", data.data)
      })
    }
  }
</script>
<style>
  .riders-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .rider-block {
    min-width: 15rem;
    border: 1px solid #dedede;
    margin: 1rem;
    box-shadow: 1px 1px 1px #cecece;
    padding: 1rem;
    max-width: 15rem;
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
