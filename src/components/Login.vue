<template>
  <div class="container">
    <div class="popup">
      <header class="login-popup-header">
        <slot name="header">
          <span class="title">登录</span>
          <button type="button" class="btn-close" @click="close">x</button>
        </slot>
      </header>
      <section class="login-popup-body">
          <input type="text"  v-model="user.user_name" placeholder="用户名/邮箱">
          <input type="password"  v-model="user.password" placeholder="密码">
          <a>找回密码</a>
      </section>
      <footer>
        <slot name="footer">
          <button type="button" class="log_but" @click="doLogin">确 定</button>
          <button type="button" class="log_but" @click="register">注 册</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
import {setUser, setToken} from '../utils/auth'
import {Login} from '../api';
export default {
  props: ["user"],
  data() {
    return {
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async doLogin() {
      // 验证
      if (this.user.user_name == null || this.user.user_name == ''){
        this.$message.error("用户名/邮箱 不能为空");
        return;
      }
      if(this.user.password == null || this.user.password.length < 5){
        this.$message.error("密码必须大于5位");
        return;
      }
      const resp = await Login(this.user);
      console.log(resp);
      if (resp.res_code == 0){
        let loginUser = {};
        loginUser.user_name = resp.res_val.user_name;
        loginUser.password = resp.res_val.password;
        setUser(loginUser);
        let token = resp.res_val.token;
        console.log(token);
        setToken(token);
        this.close();
      }else{
        this.$message.error(resp.res_mes);
      }
    },
    register() {
      this.$emit("register");
    }
  }
};
</script>

<style lang="scss" scope>
.container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(167, 167, 167, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup {
  background: #242a43;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}
.login-popup-header {
  color: #b0b8ac;
  justify-content: space-between;
}
.login-popup-body {
  color: rgb(255, 255, 255);
  font-size: 17px;
  font-weight: 530;
  -webkit-text-stroke: 0.4px #000000;
  position: relative;
}
.login-popup-body input {
  float: left;
  width: 100%;
  height: 20px;
  margin-top: 10px;
}
.login-popup-body span{
  float: left;
  font-size: 14px;
  color: red;
}
.login-popup-body a{
  font-size: 14px;
  float: right;
}
.login-popup-body a:hover{
  cursor: pointer;
  color: #b0b8ac;
  text-decoration: underline;
}
.btn-close {
  border: none;
  font-size: 20px;
  cursor: pointer;
  float: right;
  font-weight: bold;
  color: #b0b8ac;
  background: transparent;
}
.log_but {
  float: right;
  margin-right: 20%;
  margin-bottom: 10px;
  height: 30px;
  width:20%;
  color: rgb(255, 255, 255);
  font-size: 16px;
  cursor: pointer;
  -webkit-text-stroke: 0.4px #000000;
  background-color: #5a5c59;
  border-top: 2px #818181 solid;
  border-left: 2px #818181 solid;
  border-right: 2px #494949 solid;
  border-bottom: 2px #494949 solid;
}
</style>