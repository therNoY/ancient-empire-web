// 记录和攻击有关的数据

const store = {
  state:{
    beAttachUnit: {}, // 记录被攻击的单位
    attachArea: [], // 攻击范围
    attachPoint:{}, // 攻击的点
    attachResult: {}, // 攻击结果
    attachTimer: null, // 辅助展示攻击特效的定时器
    attachSpark: 0, // 辅助展示攻击火花
    selfAttachSpark: 0, // 辅助展示反击火花 一共有七张火花图
    beAttachDeadTimer: null, //辅助让单位变成坟墓 的定时器
    attachDeadTimer: null, //辅助让单位变成坟墓 的定时器
    beAttachDustNum: 0, // 辅助让单位变成坟墓
    attachDustNum: 0, // 辅助让反击击杀 的单位变成坟墓
  },
  getters:{
  },
  mutations:{
    setAttachArea(state, attachArea) {
      state.attachArea = attachArea;
    },
    setAttachPoint(state, attachPoint) {
      state.attachPoint = attachPoint;
    }
  },
  actions:{

  }
}

export default store;