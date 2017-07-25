import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {
    username: "seth"
  },
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
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations
});
