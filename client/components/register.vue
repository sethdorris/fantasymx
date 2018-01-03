<template>
  <div class="modal" v-bind:class="{'is-active': ShowRegisterModal}" id="registerModal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New User Registration</p>
        <button class="delete" @click="setRegisterModal({ show: !ShowRegisterModal})"></button>
      </header>
      <section class="modal-card-body">
        <div class="content">
            <div class="field">
              <label class="label">Username: </label>
              <div class="control has-icons-left">
                <input type="text" class="input" v-bind:class="{ 'is-danger': invalidUsername }" id="reg-username" v-model="username" placeholder="Username" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-user"></i>
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Email: </label>
              <div class="control has-icons-left">
                <input type="email" class="input" v-bind:class="{ 'is-danger': invalidEmail }"  id="reg-email" v-model="email" placeholder="Email" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-envelope"></i>
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Password: </label>
              <div class="control has-icons-left">
                <input type="password" class="input" v-bind:class="{ 'is-danger': blankPassword }" v-model="password" placeholder="Password" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
              </div>
            </div>
            <div class="field">
              <div id="register-recaptcha"></div>
            </div>
            <div class="errorMessage" v-for="error in errorMessage" v-if="errorMessage != ''">
              {{ error }}
            </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="Register" v-bind:class="{ 'is-loading': isLoading }">Register</button>
        <button class="button" @click="setRegisterModal({ show: !ShowRegisterModal })">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        errorMessage: [],
        invalidUsername: false,
        invalidEmail: false,
        blankPassword: false,
        isLoading: false
      }
    },
    computed: mapGetters([
      'ShowRegisterModal',
      'getUserData'
    ]),
    methods: {
      ...mapMutations([
        'setRegisterModal',
        'setUserData',
        'setLoggedIn'
      ]),
      Register() {
        this.isLoading = true;
        this.errorMessage = [];
        this.invalidEmail = false;
        this.blankPassword = false;
        this.invalidUsername = false;
        if (this.RegistrationIsValid()) {
          axios.post('/register', {
            username: this.username,
            email: this.email,
            password: this.password,
            captcha: grecaptcha.getResponse(1)
          }).then(data => {
            console.log(data);
            this.isLoading = false;
            var isFalse = !data.data.ErrorMessage;
            console.log("isFalse", isFalse)
            if (!data.data.ErrorMessage) {
              this.setUserData({ userData: data.data })
              console.log("getUserData", this.getUserData)
              this.setRegisterModal({ show: false })
              this.setLoggedIn({ loggedIn: true })
              console.log(this.$store.state);
            } else {
              this.errorMessage.push(data.data.ErrorMessage);
              this.errorMessage.forEach(msg => {
                if (msg.indexOf("Username") > -1) {
                  this.invalidUsername = true;
                }
                if (msg.indexOf("Email") >-1) {
                  this.invalidEmail = true;
                }
              })
              grecaptcha.reset(1);
            }
            this.username = '';
            this.email = '';
            this.password = ''
            this.isLoading = false;
          })
          .catch(e => {
            this.errorMessage.push(e.response.data.error);
            grecaptcha.reset(1);
            this.username = '';
            this.email = '';
            this.password = ''
            this.isLoading = false;
          })

        }
      },
      RegistrationIsValid() {
        var emailValidation = this.email.match(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), "i");
        console.log(emailValidation);
        if (this.email == "") {
          this.errorMessage.push("Username cannot be left empty.")
          this.invalidUsername = true;
        }
        if (emailValidation == null) {
          this.errorMessage.push("Please enter a valid email.")
          this.invalidEmail = true;
        }
        if (this.password == '' || this.password.length < 6) {
          this.errorMessage.push("Password cannot be left empty and must be at least 6 characters.")
          this.blankPassword = true;
        }
        if (this.errorMessage.length > 0) {
          this.isLoading = false;
          return false;
        }
        return true;
      }
    }
  }
</script>
<style>
  .errorMessage {
    color: #ff3860;
  }
</style>
