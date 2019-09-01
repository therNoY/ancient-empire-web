import ws from './ws'

const app = {
  state: {
    recordId: null,
    // 和地图有关的公共属性
    mapSt: {
      currentUnitIndex: -1,
      currentPoint: {row: 1, column:1},// 当前点的位置
      currentUnit: {},
      showMoveArea: false, // 是否展示移动区域
      showAttachArea: false, // 是否展示攻击区域
      moveLength: -1, // 将要移动的距离
    },
    // 和地图有关的数据
    mapDt: {
      moveAreas: [],
      pathPoints: [],
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
    changeShowMoveArea(state, status) {
      state.mapSt.showMoveArea = status;
    },
    changeMoveArea(state, areas){
      state.mapDt.moveAreas = areas;
    },
    // 改变当前点
    changePathPoints(state, path) {
      state.mapDt.pathPoints = path;  
    },
    // 改变当前单位
    changeCurrentUnit(state, unit) {
      state.mapSt.currentUnit = unit; 
    },
    changeCurrntUnitIndex(state, index) {
      state.mapSt.currentUnitIndex = index; 
    },
    // 改变当前单位的位置
    changeCurrentUnitPosition(state, position) {
      state.mapSt.currentUnit.row = position.row; 
      state.mapSt.currentUnit.column = position.column; 
    },
    changeMoveLength(state, length) {
      state.mapSt.moveLength = length;
    }
  },
  actions: {
    // 获取可移动区域
    getMoveArea(state, indexInfo) {
      let args = {};
      args.url = "/ws/getMoveArea"
      args.mes = indexInfo;
      state.dispatch("wsSendMes",  args);
    },
    // 获取移动路线 同时获取 单位能进行的行动
    getMovePath(state, aimPostion) {
      let args = {};
      args.url = "/ws/getMovePath"
      args.mes = aimPostion;
      state.dispatch("wsSendMes",  args);
    },
  }
}

export default app
