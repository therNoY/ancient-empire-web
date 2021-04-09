// 存放和用户身份验证有关的
import { removeToken } from '@/utils/auth'

const user = {
  state: {
    admin_token: null,
    token: '', // 普通token
    user: {}, // 保存登录的用户
  },

  mutations: {
    setToken: (state, token) => {
      console.log("设置token" + token);
      state.token = token
    },
    setUser: (state, user) => {
      console.log("设置User");
      state.user = user
    },
    setAdminToken: (state, token) => {
      console.log("设置AdminToken");
      state.admin_token = token
    },
  },

  actions: {
    // 登出
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        console.log("用户登出");
        commit('setToken', '');
        commit('setUser', {});
        removeToken();
        resolve();
      })
    },
  }
}

export default user
