<template>
  <div class="content">
    <div class="page-title">MY TEAM - TEAM SELECTION FOR WEEK {{ currentweek }}</div>
    <p class="page-subheader">Week {{ currentweek }} Balance: ${{dollars}}</p>
    <div class="riders-container">
      <div class="card rider-block" v-for="rider in selectedriders">
        <header class="card-header">
          <p class="card-header-title">
            {{rider.name}} - {{rider.rider_number}}
              <span class="icon" v-if="rider.name !== 'OPEN SLOT'" @click="removeRacer(rider.riderid)">
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
            <td><a href="#!" v-if="showSelect && rider.cost <= dollars" @click="addRacer(rider)">SELECT</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import _findIndex from 'lodash/findIndex';
import _sortBy from 'lodash/sortBy';
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
      showSelect() {
        var openSlots = this.selectedriders.some((rider) => {return rider.name == "OPEN SLOT"});
        var lowestCostAvailable = _sortBy(this.availableRiders, o => { return o.cost });
        if (this.dollars >= lowestCostAvailable[0].cost && openSlots) {
          return true;
        }
        return false;
      }
    },
    methods: {
      removeRacer(racerid) {
        var selectedRacerIndex = _findIndex(this.selectedriders, o => { return o.riderid === racerid });
        //Return removed racer back to available pool
        this.selectedriders[selectedRacerIndex].avatar_url = 'http://www.shopaardvark.com/media/catalog/product/W/S/WS-18655.jpg';
        this.selectedriders[selectedRacerIndex].cost = 0;
        this.selectedriders[selectedRacerIndex].highestFinish = '-';
        this.selectedriders[selectedRacerIndex].averageFinish = '-';
        this.selectedriders[selectedRacerIndex].lowestFinish = '-';
        this.selectedriders[selectedRacerIndex].name = "OPEN SLOT";
        this.selectedriders[selectedRacerIndex].rider_number = 0;
        this.selectedriders[selectedRacerIndex].riderid = 0;
        //call to save to DB;
      },
      addRacer(racer) {
        var openSlotIndex = _findIndex(this.selectedriders, o => { return o.name == "OPEN SLOT" });
        //Remove selected racer from available pool.
        this.selectedriders[openSlotIndex].avatar_url = racer.avatar_url;
        this.selectedriders[openSlotIndex].cost = racer.cost;
        this.selectedriders[openSlotIndex].highestFinish = racer.highestFinish;
        this.selectedriders[openSlotIndex].lowestFinish = racer.lowestFinish;
        this.selectedriders[openSlotIndex].averageFinish = racer.averageFinish;
        this.selectedriders[openSlotIndex].name = racer.name;
        this.selectedriders[openSlotIndex].riderid = racer.riderid;
        this.selectedriders[openSlotIndex].leagueid = 1
        this.selectedriders[openSlotIndex].season_weeksid = this.currentweek;
        console.log(this.selectedriders[openSlotIndex]);
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
