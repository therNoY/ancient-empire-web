import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import ws from './modules/ws'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    ws
  },
  getters
})

export default store
