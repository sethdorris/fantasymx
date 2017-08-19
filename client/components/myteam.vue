<template>
  <div class="content">
    <div class="page-title">MY TEAM - TEAM SELECTION FOR WEEK {{ currentweek }}</div>
    <a class="button is-success save-button" @click="SaveTeam">Save Team</a>
    <p class="page-subheader">Week {{ currentweek }} Balance: ${{dollars}}</p>
    <!-- <div class="riders-container">
      <div class="card rider-block" v-for="rider in selectedriders">
        <header class="card-header">
          <p class="card-header-title">
            {{rider.name}} - {{rider.rider_number}}
              <span class="icon" v-if="rider.name !== 'OPEN SLOT'" @click="removeRacer(rider)">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
          </p>
        </header>
        <div class="card-content">
          <div class="content">
            <img :src="rider.avatar_url" />
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
    <p class="page-title">AVAILABLE RIDERS</p> -->
    <div class="container">
      <table class="table is-striped">
        <thead>
          <tr>
            <th @click="sortByPrice">Price
              <span class="icon">
                <i class="fa fa-caret-up" v-if="CostSortByAsc" aria-hidden="true"></i>
                <i class="fa fa-caret-down" v-else aria-hidden="true"></i>
              </span>
            </th>
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
          <tr v-for="rider in paginatedRiders">
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
      <div class="custom-pagination">
        <div>
          <a class="pagination-previous" @click="page--" v-bind:class="{ 'hide-pagination-button' : hidePrevious }">Previous</a>
        </div>
        <div>
          <a class="pagination-number">{{page}}/{{paginationPages}}</a>
        </div>
        <div>
          <a class="pagination-next" @click="page++" v-bind:class="{ 'hide-pagination-button' : hideNext }">Next page</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import _findIndex from 'lodash/findIndex';
import _sortBy from 'lodash/sortBy';
import _remove from 'lodash/remove';
  export default {
    data() {
      return {
        currentweek: 0,
        selectedriders: [],
        availableRiders: [],
        CostSortByAsc: true,
        page: 1
      }
    },
    computed: {
      ...mapGetters([
        'getUserData'
      ]),
      dollars() {
        var total = 8;
        this.selectedriders.forEach(rider => {
          total -= rider.cost;
        })
        return total;
      },
      hidePrevious() {
        return this.page <= 1;
      },
      hideNext() {
        return this.page >= this.paginationPages;
      },
      paginatedRiders() {
        if (this.page == 1) {
          console.log("entire array", this.availableRiders)
          console.log(this.availableRiders.slice(0, 10));
          return this.availableRiders.slice(0, 10);
        } else {
          var beginSlice = this.page * 10 - 9;
          var endSlice = beginSlice + 10;
          console.log(this.availableRiders)
          console.log(this.availableRiders.slice(beginSlice, endSlice))
          return this.availableRiders.slice(beginSlice, endSlice);
        }
      },
      paginationPages() {
        return Math.ceil(this.availableRiders.length / 10);
      },
      showSelect() {
        var openSlots = this.selectedriders.some((rider) => {return rider.name == "OPEN SLOT"});
        var lowestCostAvailable = _sortBy(this.availableRiders, o => { return o.cost });
        console.log("showSelect", lowestCostAvailable[0])
        if ((this.dollars >= lowestCostAvailable[0].cost) && openSlots) {
          return true;
        }
        return false;
      }
    },
    methods: {
      removeRacer(racer) {
        console.log("removed racers", racer);
        var selectedRacerIndex = _findIndex(this.selectedriders, o => { return o.riderid === racer.riderid });
        var openSpace = {
          avatar_url: 'http://www.shopaardvark.com/media/catalog/product/W/S/WS-18655.jpg',
          cost: 0,
          highestFinish: '-',
          lowestFinish: '-',
          name: 'OPEN SLOT',
          rider_number: 0,
          riderid: 0,
          leagueid: 1,
          season_weeksid: this.currentweek
        }
        this.availableRiders.push(racer);
        this.$set(this.selectedriders, selectedRacerIndex, openSpace)
        //call to save to DB;
      },
      addRacer(racer) {
        var openSlotIndex = _findIndex(this.selectedriders, o => { return o.name == "OPEN SLOT" });
        _remove(this.availableRiders, o => { return o.riderid == racer.riderid })
        this.$set(this.selectedriders, openSlotIndex, racer);
      },
      sortByPrice() {
        if (this.CostSortByAsc) {
          this.CostSortByAsc = false;
          this.paginatedRiders = this.paginatedRiders.sort((a, b) => {
            if (a.cost > b.cost) {
              return -1
            }
            if (a.cost < b.cost) {
              return 1
            }
            return 0
          })
        } else {
          this.CostSortByAsc = true;
          this.paginatedRiders = this.paginatedRiders.sort((a, b) => {
            if (a.cost > b.cost) {
              return 1
            }
            if (a.cost < b.cost) {
              return -1
            }
            return 0
          })
        }
      },
      SaveTeam() {
        axios.post("/SaveTeam", this.selectedriders)
        .then(data => {
          console.log(data);
        })
      }
    },
    beforeCreate() {
      axios.get('/CurrentMyTeamModel')
      .then(data => {
        console.log("data", data.data);
        this.currentweek = data.data.CurrentTeam[0].season_weeksid;
        this.availableRiders = _sortBy(data.data.AvailableRiders, o => { return o.cost });
        this.selectedriders = data.data.CurrentTeam;
      })
    },
    mounted() {
      console.log("mounted", this.getUserData)
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
  th:hover {
    cursor: pointer;
  }
  .save-button {
    position: fixed;
  }
  .hide-pagination-button {
    visibility: hidden;
  }
  .custom-pagination {
    display: flex;
    justify-content: space-between;
  }
</style>
