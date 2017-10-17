<template>
  <div class="dropdown" @click="isActive = !isActive" v-bind:class="{ 'is-active': isActive }">
  <div class="dropdown-trigger">
    <h3 aria-haspopup="true" aria-controls="dropdown-menu">
      <span>Currently Managing: {{ ManagedLeague.name }}</span>
      <span class="icon is-small">
        <i class="fa fa-angle-down" aria-hidden="true"></i>
      </span>
    </h3>
  </div>
  <div class="dropdown-menu" id="dropdown-menu" role="menu">
    <div class="dropdown-content" v-for="league in LeagueList">
      <a href="#" class="dropdown-item" @click="changeLeague(league)">
        {{league.name}}
      </a>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios';
import { mapMutations, mapGetters } from 'vuex';
export default {
    data() {
      return {
        isActive: false,
        ManagedLeague: '',
      }
    },
    computed: {
      LeagueList() {
        return this.allLeagues.filter(item => {
          return item.leagueid != this.ManagedLeague.leagueid;
        })
      }
    },
    created() {
      this.ManagedLeague = this.currentLeague;
    },
    props: {
      currentLeague: {
        type: Object,
        required: true
      },
      allLeagues: {
        type: Array,
        required: true
      }
    },
    methods: {
      ...mapMutations([
        'setManagedLeague'
      ]),
      changeLeague(league) {
        this.setManagedLeague(league)
        this.ManagedLeague = league;
      }
    }
}
</script>
<style>
  h3 {
    font-size: 16pt;
    color: white;
  }
  div.dropdown.navbar-item:hover {
    cursor: pointer;
  }
</style>
