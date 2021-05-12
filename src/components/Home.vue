<template>
  <!--首页-->
  <div class="home">
    <img class="logo" src="../assets/images/assist/logo.png" alt />
    <div class="buttons">
      <button class="home_button" @click="clickUserInfo">玩家</button>
      <button class="home_button" @click="showChapter = true">战役</button>
      <button class="home_button" @click="showEncounter = true">遭遇战</button>
      <button class="home_button" @click="showNetGameDialog = true">
        多人游戏
      </button>
      <button class="home_button" @click="showUserRecord = true">
        读取游戏
      </button>
      <!-- <button class="home_button" @click="router('setting')">我的设置</button> -->
      <button class="home_button" @click="showUnitMange = true">
        单位管理
      </button>
      <button class="home_button" @click="showTemplatManger = true">
        模板管理
      </button>
      <button class="home_button" @click="showMapManger = true">
        地图管理
      </button>
      <button class="home_button" @click="router('mapEdit/0')">编辑地图</button>
      <!-- <button class="home_button" @click="router('demo')">帮助</button>   -->
      <!-- <button class="home_button" @click="router('monitor')">监控</button> -->
    </div>

    <user-info
      v-model="userInfoDialog"
      :user="loginUser"
      @logout="logout"
      :isDisable="true"
      @close="userInfoDialog = false"
    ></user-info>
    <!-- 多人游戏 房间管理 -->
    <room-index v-model="showNetGameDialog"></room-index>
    <!--遭遇战-->
    <encounter v-model="showEncounter"></encounter>
    <!--模板管理-->
    <template-manger v-model="showTemplatManger"></template-manger>
    <!--单位信息管理-->
    <unit-mes-manger v-model="showUnitMange"></unit-mes-manger>
    <!--用户记录-->
    <user-record v-model="showUserRecord"></user-record>

    <!--章节选择-->
    <chapter-select v-model="showChapter"></chapter-select>

    <map-manger v-model="showMapManger"></map-manger>
  </div>
</template>

<script>
import UserInfo from "./UserInfo.vue";
import RoomIndex from "./net/room/RoomIndex.vue";
import Encounter from "./encounter/Encounter.vue";
import UserRecord from "./encounter/UserRecord.vue";
import TemplateManger from "./template_mange/TemplateManger.vue";
import UnitMesManger from "./template_mange/UnitMesManger.vue";
import MapManger from "./map_manger/MapManger.vue";
import MapEdit from "./map_manger/MapEdit.vue";
import ChapterSelect from "./encounter/ChapterSelect.vue";

export default {
  components: {
    UserInfo,
    RoomIndex,
    Encounter,
    UserRecord,
    TemplateManger,
    UnitMesManger,
    MapEdit,
    ChapterSelect,
    MapManger,
  },
  data() {
    return {
      loginUser: {},
      dialogVisible: false,
      loginVisible: false,
      userInfoDialog: false,
      showNetGameDialog: false,
      showEncounter: false,
      showUserRecord: false,
      showTemplatManger: false,
      showUnitMange: false,
      showMapEdit: false,
      showChapter: false,
      showMapManger: false,
    };
  },
  methods: {
    // 点击玩家时
    clickUserInfo() {
      this.userInfoDialog = !this.userInfoDialog;
    },
    logout() {
      this.userInfoDialog = false;
      this.loginUser = {};
    },
    router(path) {
      this.$router.push("/" + path);
    },
  },
  created() {
    document.querySelector("body").setAttribute("style", "background-color:#464846");
  },
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
  margin-top: 3%;
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
