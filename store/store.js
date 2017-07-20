import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {
    username: "seth"
  }
}

const getters = {
  getUserData: state => return state.user
}

export default new Vuex.Store({
  state,
  getters
});
