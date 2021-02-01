// 记录和攻击有关的数据

const store = {
  state:{
    attachArea: [], // 攻击范围
    attachPoint:{}, // 攻击的点
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