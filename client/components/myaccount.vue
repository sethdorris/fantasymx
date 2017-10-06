<template>
    <div class="container myaccount-container">
      <ul class="ul">
        <li>Create League</li>
        <li>Join League</li>
        <li>Delete Account</li>
        <li>Upgrade Account</li>
      </ul>
      <div>
      <div class="field">
        <label class="label">League Name</label>
        <div class="control has-icons-left">
          <input class="input" type="text" placeholder="League Name">
          <span class="icon is-small is-left">
            <i class="fa fa-trophy"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">League Password</label>
        <div class="control has-icons-left">
          <input class="input" type="text" placeholder="League Password">
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">Max Players</label>
        <div class="control has-icons-left">
          <input class="input" type="number" placeholder="League Name">
          <span class="icon is-small is-left">
            <i class="fa fa-hashtag"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
  export default {
    data() {
      return {
        CreateLeagueName: '',
        CreateLeaguePassword: '',
        CreateMaxPlayers: ''
      }
    },
    computed: mapGetters([
      'getUserData'
    ]),
    methods: {
      ...mapMutations([
      ])
    }
  }
</script>
<style>
  .myaccount-container {
    display:flex;
    flex-direction:column;
    width: 45%;
    color: white;
  }
  .ul {
    list-style-type: none;
  }
  .ul li {
    display: inline;
  }
</style>
