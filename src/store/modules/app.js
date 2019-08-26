import ws from './ws'

const app = {
  state: {
    recordId: null,
    // 和地图有关的公共属性
    mapSt: {
      currentPoint: {row: 1, column:1},// 当前点的位置
      showMoveArea: false, // 是否展示移动区域
      showAttachArea: false, // 是否展示攻击区域
    },
    // 和地图有关的数据
    mapDt: {
      moveAreas: [],
    }
  },
  mutations: {
    SET_RECORD_ID: (state, id) => {
      console.log("设置记录ID");
      state.recordId = id;
    },
    // 改变当前点的位置
    changeCurrentPoint(state, point){
      state.mapSt.currentPoint = point;
    },
    // 改变是否展示移动区域
    changeShowMoveArea(state) {
      state.mapSt.showMoveArea = !state.mapSt.showMoveArea;
    },
    changeShowMoveArea(state, status) {
      state.mapSt.showMoveArea = status;
    }
  },
  actions: {
    getMoveArea(state, indexInfo) {
      let args = {};
      args.url = "/getMoveArea"
      args.mes = indexInfo;
      state.dispatch("wsSendMes",  args);
    }
  }
}

export default app
