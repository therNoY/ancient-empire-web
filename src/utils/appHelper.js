var appHelper = {

  // 获取地形的图片
  getRegionImg: function (type, color) {
    if (color == "" || typeof color == "undefined") {
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

  // 获取地图的size
  getMapSize: function (num) {
    return num * 24 + "px";
  },

  // 返回单位的图片位置
  getUnitImg: function (type, color, num = "") {
    return require("@/assets/images/unit/" + color + "/" + type + num + ".png");
  },

  // 通过单位的行或者列返回单位的相对布局的位置
  getPosition : function(num, index = 1) {
    return (num - index) * 24 + "px";
  },

  // 通过单位的行或者列返回单位的相对布局的位置
  getUnitPosition : function(num) {
    return (num - 1) * 24 + "px";
  },

  // 获取单位的action 的图
  getActionImg : function(name) {
    return require("@/assets/images/assist/action_" + name + ".png");
  },

}

export default appHelper;