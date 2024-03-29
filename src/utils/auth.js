// 管理身份验证的js
import Cookies from 'js-cookie'
import store from '../store'

// 为了保存本地记录
const userNameKey = 'AEUserName' // cookie中保存name的Key
const userIdKey = 'AEUserId' // cookie 中保存pwd的key
const userPwdKey = 'AEPwd' // cookie 中保存pwd的key

const TokenKey = 'AEToken' // cookie 中保存token的key
// 挂载cookie到window下面
window.cookies = Cookies;

export function getCookieToken() {
  return Cookies.get(TokenKey)
}

/**
 * 
 * @param {更新token同时更新 store} token 
 */
export function setToken(token) {
  console.log("更新缓存的token"+ token);
  store.commit("setToken", token);
  return Cookies.set(TokenKey, token);
}
/**
 * 从Cookie中获取用户
 */
export function getUser() {
  if (Cookies.get(userNameKey) && Cookies.get(userPwdKey) && Cookies.get(userIdKey)) {
    let user = {};
    user.user_name = Cookies.get(userNameKey);
    user.password = Cookies.get(userPwdKey);
    user.user_id = Cookies.get(userIdKey);
    return user;
  }
  return null;
}

export function setUser(user) {
  Cookies.set(userNameKey, user.user_name);
  Cookies.set(userPwdKey, user.password);
  Cookies.set(userIdKey, user.user_id);
  store.commit("setUser", user);
}

export function removeToken() {
  console.log("清除Cookie");
  Cookies.remove(userNameKey);
  Cookies.remove(userPwdKey);
  Cookies.remove(userIdKey);
  Cookies.remove(TokenKey)
}
/**
 * 
 * @param {更新token同时更新 store} token 
*/
export function Logout() {
  
  Cookies.remove(TokenKey);
}
