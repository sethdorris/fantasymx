<template>
  <div>
  <div v-if="getUserData.accounttype > 0" class="column is-half is-offset-one-quarter">
    <div class="field">
      <label>League Name</label>
      <div class="control has-icons-left">
        <input class="input" type="text" placeholder="League ID">
        <span class="icon is-small is-left">
          <i class="fa fa-trophy"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <label>League Password</label>
      <div class="control has-icons-left">
        <input class="input" type="text" placeholder="League Password">
        <span class="icon is-small is-left">
          <i class="fa fa-lock"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <button class="button">Submit</button>
    </div>
  </div>
  <div v-if="getUserData.accounttype == 0">
    <p class="bold-message">This feature requires at least a Basic account. Please upgrade your account in order to activate this feature.</p>
  </div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
  export default {
    data() {
      return {

      }
    },
    computed: mapGetters([
      'getUserData'
    ]),
    methods: {
      ...mapMutations([
      ]),
    }
  }
</script>
<style>
.bold-message {
  text-align: center;
  font-size: 18pt;
  color: #fffc7f;
  font-weight: 800;
}
</style>
