// 路由拦截
import router from './router'
import store from './store'

import { Login } from './api'
import { setToken, getCookieToken, getUser, } from '@/utils/auth' // 验权

var isFristLogin = true;
// 路由的拦截 根据路径对两个token 进行封装
router.beforeEach((to, from, next) => {
  // 如果是cookie 中保存了用户名密码 又是第一次刷新 就获取cookie中的用户名 密码 获取token
  if (isFristLogin) {
    console.log("第一次准备获取Token");
    // 获取Token
    const user = getUser();
    if (user && user.user_name && user.password) {
      // 有用户信息
      console.log("cookie 中有用户信息");
      // 向store 中保存Cookie
      store.commit("setUser", user);
      // 获取新的token
      setNewToken(user);
    }
  }
  isFristLogin = false;
  next();
})

function setNewToken(user) {
  Login(user).then(resp => {
    // 如果成功设置
    if (resp.res_code == "0") {
      console.log("成功获取token 刷新token");
      // 向Cookie 中设置Cookie
      setToken(resp.res_val.token);
    } else {
      console.warn("TODO ... 错误的用户信息 需要重新登录", resp);
    }
  })

}
