<template>
  <div>
    <div v-if="winCondition" class="showConditionStyle" @click="$appHelper.sendEvent('CLICK_TOP')">
      <div class="showConditionTitle">游戏目标</div>
      <div class="showConditionContent">
        {{message}}
      </div>
    </div>
    <div v-if="dialog" @click="$appHelper.sendEvent('CLICK_TOP');">
      <div  class="showDialogStyle">
      <div class="showDialogTitle">{{message}}</div>
      <div class="showDialogContent">
        <img :src="img" alt />
      </div>
    </div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      winCondition: false,
      dialog: false,
      message: "",
      img: "",
    };
  },
  methods: {
    showWinCondition(message) {
      console.log("展示胜利条件");
      this.winCondition = true;
      this.message = message;
    },
    disShowDialog(data) {
      console.log("不展示弹框");
      this.winCondition = false;
      this.dialog = false;
    },
    showDialog(data) {
      console.log("展示对话框", data);
      this.dialog = true;
      this.img = require("../../assets/images/dialog/" +
        data.dialog_type +
        ".png");
      this.message = data.message;
    },
    gameWin(message) {
      this.$appHelper.showTip(message, () => {
        this.$router.push("/");
      }, ["返回主页", "继续游戏"]);
    },
    gameOver(message) {
      this.$appHelper.showTip(message, () => {
        this.$router.push("/");
      }, ["返回主页"]);
    }
  },
  created() {
    window.GameDialogVue = this;
    this.$eventBus.regist(this, "showWinCondition");
    this.$eventBus.regist(this, "disShowDialog");
    this.$eventBus.regist(this, "gameWin");
    this.$eventBus.regist(this, "gameOver");
    this.$eventBus.regist(this, "showDialog");
  },
  destroyed() {
    this.$eventBus.unRegist(this, "showWinCondition");
    this.$eventBus.unRegist(this, "disShowDialog");
    this.$eventBus.unRegist(this, "gameWin");
    this.$eventBus.unRegist(this, "gameOver");
    this.$eventBus.unRegist(this, "showDialog");
  },
};
</script>

<style  lang="scss" scoped>
.showConditionStyle {
  width: 100%;
  height: 25%;
  margin-top: 35%;
  position: absolute;
  background-color: #242b44;
  color: white;

  .showConditionTitle {
    text-align: center;
    border-bottom: 1.5px #c9c9c9 solid;
    padding: 2.5%;
  }
  .showConditionContent {
    padding-top: 6%;
    padding-left: 3%;
  }
  border-top: 2px #c9c9c9 solid;
  border-bottom: 2px #c9c9c9 solid;
}
.showDialogStyle {
  width: 100%;
  height: 30%;
  position: absolute;
  bottom: 0px;
  color: white;
  background-color: #242b44;
  border-top: 2px #c9c9c9 solid;
  border-bottom: 2px #c9c9c9 solid;
  .showDialogTitle {
    width: 60%;
    float: right;
    padding-top: 7%;
  }
  .showDialogContent {
    width: 40%;
    float: right;
  }
}
</style>