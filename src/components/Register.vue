<template>
  <div class="container">
    <div class="popup">
      <header class="popup-header">
        <slot name="header">
          <span class="title">注册</span>
          <button type="button" class="btn-close" @click="close">x</button>
        </slot>
      </header>
      <section class="popup-body">
          <input type="email" v-model="user.email" placeholder="邮箱">
          <input type="text" v-model="user.user_name" placeholder="用户名">
          <input type="password" v-model="user.password" placeholder="密码">
          <input type="password" v-model="user.rePassword" placeholder="确认密码">
      </section>
      <footer>
        <slot name="footer">
          <button type="button" class="reg_but" @click="doRegister">确 定</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
import {Register} from '../api'
export default {
  data() {
    return {
      user:{},
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async doRegister() {
      if (this.user.email == null || this.user.email == "") {
        this.$message.error("邮箱不能为空");
        return;
      }else if (this.user.user_name == null || this.user.user_name == "") {
        this.$message.error("用户名不能为空");
        return;
      }else if (this.user.password == null || this.user.password == "") {
        this.$message.error("密码不能为空");
        return;
      }else if (this.user.rePassword == null || this.user.rePassword == "") {
        this.$message.error("确认密码不能为空");
        return;
      }else if (this.user.password.length < 5) {
        this.$message.error("密码少于五位");
        return;
      }else if (this.user.password != this.user.rePassword) {
        this.$message.error("密码不一致");
        return;
      }
      const resp = await Register(this.user);
      if (resp.res_code == 0) {
        this.$message("确认邮件已发出 请确认查收");
        this.close();
      }else {
        this.$message.error(resp.res_mes);
      }
    },
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
.popup-header {
  color: #b0b8ac;
  justify-content: space-between;
}
.popup-body {
  color: rgb(255, 255, 255);
  font-size: 17px;
  font-weight: 530;
  -webkit-text-stroke: 0.4px #000000;
  position: relative;
}
.popup-body input {
  float: left;
  width: 100%;
  height: 20px;
  margin-top: 10px;
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
.reg_but {
  float: right;
  margin-right: 15%;
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