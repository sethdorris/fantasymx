import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Assume we have a universal API that returns Promises
// and ignore the implementation details
import { fetchItem } from '../server/api'

export function createStore () {
  return new Vuex.Store({
    state: {
      userdata: {
        username: '',
        isLoggedIn: false,
        role: '',
      },
      leagues: [
        {
          leagueId: 0,
          leagueName: '',
          team: {
            rider1: '',
            rider2: '',
            rider3: '',
            rider4: ''
          }
        }
      ]
    },
    actions: {
      fetchItem ({ commit }, id) {
        // return the Promise via store.dispatch() so that we know
        // when the data has been fetched
        return fetchItem(id).then(item => {
          commit('setItem', { id, item })
        })
      },
      setUsername(value) {
        commit('setUsername', value)
      }
    },
    mutations: {
      setItem (state, { id, item }) {
        Vue.set(state.items, id, item)
      },
      setUsername (state, value) {
        Vue.set(state.test, value)
      }

    }
  })
}
