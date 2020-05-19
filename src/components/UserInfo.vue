<template>
  <div class="container">
    <div class="popup">
      <header class="popup-header">
        <slot name="header">
          <span class="title">用户信息</span>
          <button type="button" class="btn-close" @click="close">x</button>
        </slot>
      </header>
      <section class="popup-body">
        <div style="width:100%" v-show="willChange">请输入原密码</div>
        <input type="password" v-show="willChange" placeholder="原密码" v-model="user.old_password" />
        <input type="text" v-show="!willChange" :disabled="isDisable" v-model="user.user_name" />
        <input type="password" v-show="!willChange" :disabled="isDisable" v-model="user.password" />
      </section>
      <footer>
        <slot name="footer">
          <button v-if="user" v-show="!willChange && isDisable" class="info_but" @click="logout">登出</button>
          <button v-show="!willChange && isDisable" class="info_but" @click="changeInfo">修改信息</button>
          <button v-show="willChange || !isDisable" class="info_but" @click="makeSure">确定</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
import { CheckPwd, changeUserInfo } from "../api";
import { setToken, setUser } from '../utils/auth'
import { Logout } from "../utils/auth";
export default {
  props: ["isDisable", "user"],
  data() {
    return {
      willChange: false
    };
  },

  methods: {
    close() {
      this.$emit("close");
    },
    logout() {
      if (this.user) {
        this.$store.dispatch("logout");
        this.$emit("logout");
      }
    },
    async makeSure() {
      if (this.willChange) {
        if (
          this.user.old_password == null ||
          this.user.old_password != this.user.password
        ) {
          this.$message.error("原密码错误");
          return;
        } else {
          // 验证密码
          const resp = await CheckPwd(this.user);
          if (resp.res_code == 0) {
            this.user.id = resp.res_val;
            this.willChange = false;
            this.isDisable = false;
          } else {
            this.$message.error(resp.res_mes);
          }
        }
      } else {
        // 修改信息
        const resp = await changeUserInfo(this.user);
        if (resp.res_code == 0) {
          this.$message("修改成功");
          // 重新设置token 和 用户信息
          setToken(resp.res_val);
          setUser(this.user);
          this.close();
        } else {
          this.$message.error(resp.res_mes);
        }
      }
    },
    changeInfo() {
      this.user.old_password = null;
      this.willChange = true;
    }
  }
};
</script>

<style>
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

.popup-body span {
  float: left;
  font-size: 14px;
  color: red;
}
.popup-body a {
  font-size: 14px;
  float: right;
}
.popup-body a:hover {
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
.info_but {
  float: right;
  margin-right: 20%;
  margin-bottom: 10px;
  height: 30px;
  width: 20%;
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