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
              <label for="reg-username" class="label">Username: </label>
              <div class="control">
                <input type="text" class="input" id="reg-username" v-model="username"/>
              </div>
            </div>
            <div class="field">
              <label for="reg-email" class="label">Email: </label>
              <div class="control">
                <input type="email" class="input" id="reg-email" v-model="email"/>
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
        <a class="button is-success">Register</a>
        <a class="button" @click="setRegisterModal({ show: !ShowRegisterModal })">Cancel</a>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      }
    },
    computed: mapGetters([
      'ShowRegisterModal'
    ]),
    methods: {
      ...mapMutations([
        'setRegisterModal'
      ])
    }
  }
</script>
