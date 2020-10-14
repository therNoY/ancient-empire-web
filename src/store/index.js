import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import info from './modules/info'
import ws from './modules/ws'
import ai from './modules/ai'
import gameCore from './modules/gameCore'
import move from './modules/moveState'
import action from './modules/actionState'
import attach from './modules/attachState'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    ws,
    info,
    ai,
    action,
    attach,
    move, // 移动区域 移动相关的
    gameCore // 游戏核心先关的
  },
  getters
})

export default store
