import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user'))
  },
  mutations: {
    setUser (state, user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {

  }
})
