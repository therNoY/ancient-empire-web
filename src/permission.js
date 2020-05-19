// 路由拦截
import router from './router'
import store from './store'

import { Login } from './api'
import { setToken, getCookieToken, getUser, } from '@/utils/auth' // 验权

var isFrist = true;
// 路由的拦截 根据路径对两个token 进行封装
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
        // 没有管理员token 访问管理员登录界面
        next({ path: '/admin/login' });
      }
      // hava token go next
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
        store.commit("setUser", user);
        getToken(user);
      }
    }
    isFrist = false;
    next();
  }
})

function getToken(user) {
  Login(user).then(resp => {
    // 如果成功设置
    console.log(resp);
    if (resp.res_code == "0") {
      console.log("成功获取token 刷新token");
      // 向Cookie 中设置Cookie
      setToken(resp.res_val.token);
    }else{
      console.warn("TODO ... 错误的用户信息 需要重新登录");
    }
  })

}
