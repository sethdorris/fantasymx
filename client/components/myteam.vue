<template>
  <div class="content">
    <div class="page-title">MY TEAM - TEAM SELECTION FOR WEEK {{ currentweek }}</div>
    <p class="page-subheader">Week {{ currentweek }} Balance: ${{dollars}}</p>
    <div class="riders-container">
      <div class="card rider-block" v-for="rider in selectedriders">
        <header class="card-header">
          <p class="card-header-title">
            {{rider.name}} - {{rider.rider_number}}
              <span class="icon" v-if="rider.name !== 'OPEN SLOT'">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
          </p>
        </header>
        <div class="card-content">
          <div class="content">
            <img :src="rider.avatar_url" />
            <!-- <img src="http://motocross.transworld.net/wp-content/blogs.dir/441/files/2013/11/Jason_Anderson_TWMX_735-600x399.jpg" /> -->
          </div>
        </div>
        <footer class="card-footer">
          <div class="footer-row">
            Cost: <span>${{rider.cost}}</span>
          </div>
          <div class="footer-row">
            Avg Finish: <span>{{rider.averageFinish}}</span>
          </div>
          <div class="footer-row">
            Highest Finish: <span>{{rider.highestFinish}}</span>
          </div>
          <div class="footer-row">
            Lowest Finish: <span>{{rider.lowestFinish}}</span>
          </div>
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
          <tr v-for="rider in availableRiders">
            <td>${{rider.cost}}</td>
            <td>{{rider.name}}</td>
            <td>{{rider.rider_number}}</td>
            <td>{{rider.highestFinish}}</td>
            <td>{{rider.lowestFinish}}</td>
            <td>{{rider.averageFinish}}</td>
            <td><a href="/#" v-if="openSlots">SELECT</a></td>
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
        currentweek: 0,
        availableRiders: [],
        selectedriders: []
      }
    },
    computed: {
      ...mapGetters([
        'getUserData'
      ]),
      dollars() {
        var total = 8;
        if (this.selectedriders.length == 0) {
          return total;
        }
        this.selectedriders.forEach(rider => {
          total -= rider.cost;
        })
        return total;
      },
      openSlots() {
        return this.selectedriders.some((rider) => {return rider.name == "OPEN SLOT"})
      }
    },
    beforeCreate() {
      axios.get('/CurrentMyTeamModel')
      .then(data => {
        console.log("data", data.data);
        this.currentweek = data.data.CurrentTeam[0].season_weeksid;
        this.availableRiders = data.data.AvailableRiders;
        this.selectedriders = data.data.CurrentTeam;
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
  .card-footer {
    flex-direction: column;
    border: 1px solid #eee;
  }
  .card-content {
    min-height: 11rem;
    max-height: 11rem;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  .card-footer div:nth-child(even) {
    background-color: #eee;
  }
  .footer-row {
    display:flex;
    justify-content: space-between;
  }
  p.card-header-title {
    display:flex;
    justify-content: space-around;
  }
  p span.icon {
    color: #ff3860;
  }
</style>
