// 记录渲染单位移动有关的数据

const store = {
  state:{
    moveLength: 0, // 将要移动的距离
    moveAreas: [], // 移动区域
    moveLine: [], // 移动的点
  },
  getters:{

  },
  mutations:{
    setMoveArea(state, moveArea){
      state.moveAreas = moveArea;
    },
    setMoveLine(state, moveLine) {
      state.moveLine = moveLine;
    },
    setMoveLength(state, moveLength){
      state.moveLength = moveLength;
    }
  },
  actions:{

  }
}

export default store;