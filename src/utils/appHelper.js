import { imgUrl } from "../api/env"
import store from "../store";
var appHelper = {

  store: store,

  dp: [],

  setWidthBack: function () {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#f7f7f7");
  },

  setLoading: function(){
    this.store.commit("setLoading");
    return this.store.getters.gloadLoading;
  },

  successMsg: function(){

  },

  warningMsg: function(){

  },

  errorMsg: function(){

  },

  // 获取地形的图片
  getRegionImg: function (type, color) {
    if (!color) {
      return require("@/assets/images/Region/" + type + ".png");
    }
    if (type == "castle" || type == "town") {
      return require("@/assets/images/Region/" +
        color +
        "/" +
        type +
        ".png");
    } else {
      return require("@/assets/images/Region/" + type + ".png");
    }
  },

  getBkColor: function (bg_color) {
    let color = bg_color;
    let bkColor = "#96d9f4";
    if (color) {
      if (color == "blue") {
        bkColor = "#96d9f4";
      } else if (color == "red") {
        bkColor = "#f49e9c";
      } else if (color == "green") {
        bkColor = "#abed5a";
      } else if (color == "black") {
        bkColor = "#007696";
      }
    }
    return { backgroundColor: bkColor };
  },

  // 获取地图的size
  getMapSize: function (num) {
    return num * 24 + "px";
  },

  /**
   * 返回单位的图片位置
   * @param {} typeId 单位Id
   * @param {*} color  单位颜色
   * @param {*} num 单位动作控制
   */
  getUnitImg: function (typeId, color = "blue", num = "") {
    return imgUrl + "unit/" + color + "/" + typeId + num + ".png";
  },

  /**
   * 获取模板图片
   * @param {*} img 
   */
  getTemplateImg: function(img){
    return imgUrl + "temp/" + img;
  },

  // 返回单位的图片位置
  getUnitDoneImg: function (typeId, color) {
    if (color) {
      return imgUrl + "unit/done/" + color + "_" + typeId + ".png";
    } else {
      return imgUrl + "unit/done/" + typeId + ".png";
    }
  },

  // 通过单位的行或者列返回单位的相对布局的位置
  getPosition: function (num, index = 1) {
    return (num - index) * 24 + "px";
  },

  // 通过单位的行或者列返回单位的相对布局的位置
  getUnitPosition: function (num) {
    return (num - 1) * 24 + "px";
  },

  // 获取单位的action 的图
  getActionImg: function (name) {
    return require("@/assets/images/assist/action_" + name + ".png");
  },

  // 判断是否可以点击
  isPlayer: function (that) {
    console.log(that);
    return (that.$store.getters.user.user_id == that.$store.getters.game.curr_player)
      && that.$store.getters.mapState == 0;
  },


  sendEvent: function (event, initiateSite = null, aimSite = null, regionIndex, unitId) {
    this.store.dispatch("sendEvent", {
      event: event, initiateSite, aimSite, regionIndex, unitId
    });
  }

}

function initDp() {
  let dp = new Array(12);
  for (let i = 0; i < 12; i++) {
    if (i == 0) {
      dp[i] = 1;
    } else if (i == 1) {
      dp[i] = 2;
    } else {
      dp[i] = dp[i - 1] + dp[i - 2];
    }
  }
  return dp;
}

appHelper.dp = initDp();

export default appHelper;