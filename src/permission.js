import router from './router'
import store from './store'

import { Login } from './api'
import { setToken, getCookieToken, getUser, } from '@/utils/auth' // 验权

var isFrist = true;
// 路由的拦截
router.beforeEach((to, from, next) => {

  console.log("cookie token");
  console.log(getCookieToken());
  console.log("cookie user");
  console.log(getUser());


  if (to.path.indexOf("/admin/") == 0) {
    console.log("访问管理员界面");
    if (to.path.indexOf("/admin/login") == 0) {
      next();
    } else {
      if (store.getters.admin_token == null) {
        console.log("没有管理员token");
        next({ path: '/admin/login' })
      }
      next();
    }
  } else {
    // 如果是cookie 中保存了用户名密码 又是第一次刷新 就获取cookie中的用户名 密码 获取token
    if (isFrist) {
      console.log("第一次准备获取Token");
      // 获取Token
      const user = getUser();
      if (user != null && user.user_name != null && user.password != null) {
        // 有用户信息
        console.log("cookie 中有用户信息");
        // 向store 中保存Cookie
        store.commit("SET_USER", user);
        getToken(user);
      }
    }
    isFrist = false;
    next();
  }
})

async function getToken(user) {
  const resp = await Login(user);
  // 如果成功设置
  console.log(resp);
  if (resp.res_code == "0") {
    console.log("成功获取token");
    // 向Cookie 中设置Cookie
    setToken(resp.res_val.token);
  }
}
