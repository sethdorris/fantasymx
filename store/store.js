import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {
    username: "seth"
  }
}

const getters = {
  getUserData: function () {
    return state.user
  }
}

const mutations = {
  changeTeam (state, riderArray) {
    state.user.riders = riderArray
  }
}

const actions = {

}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
