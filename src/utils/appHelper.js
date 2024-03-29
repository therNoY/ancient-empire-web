import { imgUrl } from "../api/env"
import store from "../store";
import eventBus from "../manger/EventBus";

const appHelper = {

  store: store,

  dp: [],

  setWidthBack: function () {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#f7f7f7");
  },

  setLoading: function () {
    this.store.commit("setLoading");
    return this.store.getters.gloadLoading;
  },

  infoMsg: function (mes) {
    let message = {};
    message.type = "info";
    message.mes = mes;
    eventBus.publish("showMessage", message)
  },

  successMsg: function (mes) {
    let message = {};
    message.type = "sucess";
    message.mes = mes;
    eventBus.publish("showMessage", message)
  },

  warningMsg: function (mes) {
    let message = {};
    message.type = "warning";
    message.mes = mes;
    eventBus.publish("showMessage", message)
  },

  errorMsg: function (mes) {
    let message = {};
    message.type = "error";
    message.mes = mes;
    eventBus.publish("showMessage", message)
  },

  showTip: function (message, fun, buttonList) {
    let mes = {
      message: message,
      callback: fun,
      buttonList: buttonList,
    }
    eventBus.publish("showTip", mes)
  },

  showInputDialog: function (title, label, fun, placeholder) {
    let mes = {
      title: title,
      label: label,
      callback: fun,
      placeholder: placeholder,
    }
    eventBus.publish("showInputDialog", mes)
  },

  /**
   * 获取登录用户的角色
   */
  getLoginRole:function(){
    return store.user.role;
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
  getTemplateImg: function (img) {
    return imgUrl + "template/" + img;
  },

  // 返回单位的图片位置
  getUnitDoneImg: function (typeId, color) {
    return imgUrl + "unit/" + color + "/" + typeId + "_3.png";
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
  mapCanClick: function () {
    return (store.getters.user.user_id == store.getters.game.curr_player)
      && store.getters.mapState == 0;
  },


  /**
   * 发送事件
   * @param {*} event
   * @param {*} initiateSite
   * @param {*} aimSite
   * @param {*} regionIndex
   * @param {*} unitId
   */
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
