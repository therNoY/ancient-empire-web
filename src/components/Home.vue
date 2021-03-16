<template>
  <!--首页-->
  <div class="home">
    <img class="logo" src="../assets/images/assist/logo.png" alt />
    <div class="buttons">
      <button class="home_button" @click="getUserInfo">玩家</button>
      <button class="home_button" @click="get">战役</button>
      <button class="home_button" @click="router('encounter')">遭遇战</button>
      <button class="home_button" @click="clickNetGame">多人游戏</button>
      <button class="home_button" @click="router('setting')">我的设置</button>
      <button class="home_button" @click="router('userRecord')">读取游戏</button>
      <button class="home_button" @click="router('demo')">帮助</button>
      <button class="home_button" @click="router('monitor')">监控</button>
    </div>

    <register v-if="registerVisible" @close="registerVisible = false"></register>
    <my-dialog
      v-if="dialogVisible"
      @login="goLogin"
      @close="dialogVisible = false"
    >由于该功能需要联网，请先登录使用此功能</my-dialog>
    <login
      v-if="loginVisible"
      :user="loginUser"
      @register="register"
      @close="loginVisible = false"
    ></login>
    <user-info
      v-if="userInfoDialog"
      :user="loginUser"
      @logout="logout"
      :isDisable="true"
      @close="userInfoDialog = false"
    ></user-info>
    <room-index v-model="showNetGameDialog"></room-index>
  </div>
</template>

<script>
import myDialog from "./MyDialog";
import login from "./Login";
import register from "./Register";
import UserInfo from "./UserInfo.vue";
import RoomIndex from './net/room/RoomIndex.vue';
export default {
  components: {
    myDialog,
    login,
    register,
    UserInfo,
    RoomIndex
  },
  data() {
    return {
      loginUser: {},
      dialogVisible: false,
      loginVisible: false,
      registerVisible: false,
      userInfoDialog: false,
      showNetGameDialog:false,
    };
  },
  methods: {
    // 点击玩家时
    getUserInfo() {
      if (this.isHaveToken()) {
        this.loginUser = this.$store.getters.user;
        console.log(this.loginUser);
        this.userInfoDialog = true;
      } else {
        this.loginVisible = true;
      }
    },
    clickNetGame(){
      this.showNetGameDialog = true;
    },
    register() {
      this.dialogVisible = false;
      this.loginVisible = false;
      this.registerVisible = true;
    },
    doRegister() {
      console.log("注册");
    },
    logout() {
      this.userInfoDialog = false;
      this.loginUser = {};
    },
    goLogin() {
      this.dialogVisible = false;
      this.loginVisible = true;
    },
    isHaveToken() {
      console.log(this.$store.getters.token);
      if (
        this.$store.getters.token != null &&
        this.$store.getters.token != ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    router(path) {
      if (path == "mapEdit") {
        if (!this.isHaveToken()) {
          this.dialogVisible = true;
        }else {
          this.$router.push("/" + path);
        }
      }else {
        this.$router.push("/" + path);
      }
    },
    async get() {
      let dog = {};
      dog.id = 1;
      dog.name = "小花";
      const rep = await GetTest("api/get");
      console.log(rep);
    }
  },
  created() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#464846");
  }
};
</script>

<style lang="scss" scoped>
.home {
  text-align: center;
}

.logo {
  margin: 0 auto;
}
.buttons {
  width: 40%;
  height: 500px;
  margin: 0 auto;
  background-color: #242b44;
  border: 2px #afb7aa solid;
  box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.692);
}
.home_button {
  float: left;
  width: 80%;
  margin-top: 5%;
  margin-left: 10%;
  color: rgb(255, 255, 255);
  font-size: 20px;
  cursor: pointer;
  -webkit-text-stroke: 0.4px #000000;
  background-color: #5a5c59;
  border-top: 2px #818181 solid;
  border-left: 2px #818181 solid;
  border-right: 2px #494949 solid;
  border-bottom: 2px #494949 solid;
}

.home_button:hover {
  box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.322);
}
</style>