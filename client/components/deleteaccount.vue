<template>
  <div class="column is-half is-offset-one-quarter">
    <div class="field">
      <div class="control">
        <label class="radio">Are you sure you want to delete your account?
          <input type="radio" name="question">
          Yes
        </label>
        <label class="radio">
          <input type="radio" name="question">
          No
        </label>
      </div>
    </div>
    <div class="field">
      <button class="button">Submit</button>
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

</style>
