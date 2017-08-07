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
          </div>
        </div>
        <footer class="card-footer">
        </footer>
      </div>
    </div>
    <p class="page-title">AVAILABLE RIDERS</p>
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
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>
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
        selectedriders: []
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
            selectedriders.push(obj.riderid);
          })
          return ids.indexOf(rider.id) == -1;
        })
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
    }
  }
</script>
<style>
  .riders-container {
    display: flex;
    flex-wrap: wrap;
    margin: 2rem 8rem;
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
