<template>
    <div class="container myaccount-container">
      <ul class="ul">
        <li><router-link to="/myaccount/createleague">Create League</router-link></li>
        <li><router-link to="/myaccount/joinleague">Join League</router-link></li>
        <li><router-link to="/myaccount/deleteaccount">Delete Account</router-link></li>
        <li><router-link to="/myaccount/upgradeaccount">Upgrade Account</router-link></li>
      </ul>
      <router-view></router-view>
    </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    }
  }
</script>
<style>
  .myaccount-container {
    display:flex;
    flex-direction:column;
    width: 45%;
    color: white;
    margin-top: 2rem;
  }
  .ul {
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    margin-bottom: 2rem;
  }
  .ul > li {
    display: inline;
  }
  label {
    color: white;
    font-size: 1rem;
    font-weight: 600;
  }
  input[type='radio'] {
    margin-left: 2rem;
  }
</style>
