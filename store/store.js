import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {
    username: "seth",
  },
  isLoggedIn: false,
  modalControl: {
    showLoginModal: false,
    showRegisterModal: false
  }
}

const getters = {
  getUserData: function () {
    return state.user
  },
  ShowLoginModal: function () {
    return state.modalControl.showLoginModal
  },
  ShowRegisterModal: function () {
    return state.modalControl.showRegisterModal
  },
  GetAuthStatus: function () {
    return state.isLoggedIn;
  }
}

const mutations = {
  changeTeam (state, riderArray) {
    state.user.riders = riderArray
  },
  setLoginModal (state, { show }) {
    state.modalControl.showLoginModal = show;
  },
  setRegisterModal(state, { show }) {
    state.modalControl.showRegisterModal = show
  },
  setUserData(state, { userData }) {
    state.user = userData;
  },
  setLoggedIn(state, { loggedIn }) {
    state.isLoggedIn = loggedIn;
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations
});
