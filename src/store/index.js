import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import info from './modules/info'
import gameCore from './modules/gameCore'
import room from './modules/room'
import action from './modules/actionState'
import attach from './modules/attachState'
import getters from './getters'
import move from './modules/moveState'
import frame from './modules/frame'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    frame,
    user,
    info,
    action,
    attach,
    room,
    move, // 移动区域 移动相关的
    gameCore // 游戏核心先关的
  },
  getters
})

export default store
