<template>
  <div class="content">
    <div class="page-header-container">
      <div class="page-header-block">
        <div class="lh-4r">Week: <span class="boldest-header right">{{currentweek}}</span></div>
        <div class="lh-4r">Balance Remaining:<span class="boldest-header right"> ${{dollars}}</span></div>
      </div>
    </div>
    <div class="container">
      <transition name="fade" mode="out-in">
        <p v-if="showSaveMessage" class="successful-save">Your team has been successfully saved!</p>
      </transition>
      <table class="table">
        <thead>
          <tr>
            <th>Action</th>
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
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>Action</th>
            <th>Price</th>
            <th>Racer Name</th>
            <th>Racer Number</th>
            <th>Highest Finish</th>
            <th>Lowest Finish</th>
            <th>Average Finish</th>
          </tr>
        </tfoot>
        <tbody>
          <tr class="transparent-background">
            <td colspan="7">My Team</td>
          </tr>
          <tr v-for="(racer, index) in selectedriders">
            <td>
              <a href="#!" v-if="racer.name != 'OPEN SLOT'" @click="removeRacer(racer)">
                <span class="icon minus-icon">
                  <i class="fa fa-minus" aria-hidden="true"></i>
                </span>
              </a>
            </td>
            <td>${{racer.cost}}</td>
            <td>{{racer.name}}</td>
            <td>{{racer.rider_number}}</td>
            <td>{{racer.highestFinish}}</td>
            <td>{{racer.lowestFinish}}</td>
            <td>{{racer.averageFinish}}</td>
          </tr>
          <tr class="lastRow">
            <td colspan="5"></td>
            <td colspan="1">
              <button class="button is-danger" @click="RemoveAll" :disabled="!showRemoveAll">Remove All</button>
            </td>
            <td colspan="1">
              <button class="button is-success" @click="SaveTeam" :disabled="hasOpenSlots" v-bind:class="{'is-loading':isLoading}">Save Team</button>
            </td>
          </tr>
          <tr class="transparent-background">
            <td colspan="7">Available Racers</td>
          </tr>
          <tr v-for="rider in paginatedRiders">
            <td>
              <a href="#!" v-if="showSelect && rider.cost <= dollars" @click="addRacer(rider)">
                <span class="icon">
                  <i class="fa fa-plus" aria-hidden="true"></i>
                </span>
              </a>
            </td>
            <td>${{rider.cost}}</td>
            <td>{{rider.name}}</td>
            <td>{{rider.rider_number}}</td>
            <td>{{rider.highestFinish}}</td>
            <td>{{rider.lowestFinish}}</td>
            <td>{{rider.averageFinish}}</td>
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
        page: 1,
        isLoading: false,
        showSaveMessage: false
      }
    },
    computed: {
      ...mapGetters([
        'getUserData'
      ]),
      dollars() {
        var total = 10000;
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
      hasOpenSlots() {
        return this.selectedriders.some(rider => { return rider.name == "OPEN SLOT" })
      },
      showRemoveAll() {
        return this.selectedriders.some(rider => { return rider.name != "OPEN SLOT" })
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
          id: this.selectedriders[selectedRacerIndex].id,
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
        this.availableRiders.push(racer)
        this.$set(this.selectedriders, selectedRacerIndex, openSpace)
        console.log("My new team", this.selectedriders)
      },
      addRacer(racer) {
        var openSlotIndex = _findIndex(this.selectedriders, o => { return o.name == "OPEN SLOT" });
        _remove(this.paginatedRiders, o => { return o.riderid == racer.riderid })
        _remove(this.availableRiders, o => { return o.riderid == racer.riderid })
        racer.id = this.selectedriders[openSlotIndex].id;
        this.$set(this.selectedriders, openSlotIndex, racer);
        console.log("Racers to Add", this.selectedriders)
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
        this.isLoading = true;
        axios.post("/SaveTeam", this.selectedriders)
        .then(data => {
          this.isLoading = false;
          this.SaveMessage();
          console.log(data);
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        })
      },
      SaveMessage() {
        this.showSaveMessage = true;
        setTimeout(() => { this.showSaveMessage = false }, 7000)
      },
      RemoveAll() {
        this.selectedriders.forEach(racer => {
          if (racer.name != "OPEN SLOT") {
            this.removeRacer(racer)
          }
        })
      }
    },
    beforeCreate() {
      axios.get('/CurrentMyTeamModel')
      .then(data => {
        console.log("data", data.data);
        this.currentweek = data.data.CurrentWeek;
        console.log(this.currentweek);
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
.successful-save {
  text-align: center;
  color: #00d1b2;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.page-header-container {
  display: flex;
  justify-content: center;
}
.page-header-block {
  width: 15%;
  min-width: 260px;
}
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
  .hide-pagination-button {
    visibility: hidden;
  }
  .custom-pagination {
    display: flex;
    justify-content: space-between;
  }
  .lastRow {
    border-bottom: 2px solid #00d1b2;
  }
  .minus-icon {
    color: #ff3860;
  }
  .boldest-header {
    color: #00d1b2;
    font-weight: 700;
    font-size: xx-large;
  }
  .right {
    float: right;
  }
  .lh-4r {
    height: 4rem;
    line-height: 4rem;
  }
  .lh-4r:first-of-type {
    border-bottom: 1px solid #00d1b2;
  }
  .lh-4r:last-of-type {
    margin-bottom: 2rem;
  }
</style>
