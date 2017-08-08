<template>
  <div class="modal" v-bind:class="{'is-active': show}" id="loginModal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">User Login</p>
        <button class="delete" @click="setLoginModal({ show: !ShowLoginModal })"></button>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <div class="field">
            <label for="reg-username" class="label">Username: </label>
            <div class="control">
              <input type="text" class="input" v-model="username"/>
            </div>
          </div>
          <div class="field">
            <label for="reg-password" class="label">Password: </label>
            <div class="control">
              <input type="password" class="input" id="reg-password" v-model="password"/>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="field">
          <button class="button is-primary" v-bind:class="{ 'is-loading': isLoading }" v-on:click="submit" type="button" value="Login" id="submit-login">Login</button>
        </div>
        <div class="field">
          <a class="button" @click="setLoginModal({ show: !ShowLoginModal })">Cancel</a>
        </div>
      </footer>
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
          username: '',
          password: '',
          isLoading: false
        }
      },
      computed: mapGetters([
        'ShowLoginModal'
      ]),
      props: {
        show: {
            type: Boolean,
            required: true
        }
      },
      methods: {
        ...mapMutations([
          'setLoginModal',
          'setUserData',
          'setLoggedIn'
        ]),
        submit: function(e) {
          e.preventDefault();
          this.isLoading = true;
          axios.post('/login', {
            username: this.username,
            password: this.password
          }).then(data => {
            this.isLoading = false;
            this.setUserData({ userData: data.data })
            this.setLoggedIn({ loggedIn: true })
            this.setLoginModal({ show: false })
          }).catch(err => {
            this.isLoading = false;
            console.log("Login error: ", err)
          })
        }
      }
  }
</script>
