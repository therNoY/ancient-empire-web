import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import info from './modules/info'
import ws from './modules/ws'
import ai from './modules/ai'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    ws,
    info,
    ai
  },
  getters
})

export default store
