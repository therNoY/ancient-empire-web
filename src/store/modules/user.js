import { removeToken } from '@/utils/auth'

const user = {
  state: {
    admin_token: null,
    token: '',
    user: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      console.log("设置token");
      state.token = token
    },
    SET_USER: (state, user) => {
      console.log("设置User");
      state.user = user
    },
    SET_ADMIN_TOKEN:(state, token) => {
      console.log("设置AdminToken");
      state.admin_token = token
    },
    LOGOUT: (state) => {
      console.log("清除state");
      state.user = {};
      state.token = null
    },
  },

  actions: {

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USER', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
