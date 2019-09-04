
const mapStatus = ["noAction","showMoveArea", "move", "showAction", "willAttach", "willSummon", "willEnd"];

const unitStatus = ["noAction","moveIng", "moveDone"];

const app = {
  state: {
    recordId: null,
    // 和地图有关的公共属性
    mapSt: {
      mapStatus: "noAction", // 一个重要的 状态变量 控制前端界面的状态
      unitStatus: "noActon", // 当前单位的状态 
      currentUnitIndex: -1, // 当前单位所处的index
      currentPoint: { row: 1, column: 1 },// 当前点的位置
      currentUnit: {}, // 记录当前单位
      moveLength: -1, // 将要移动的距离
      lastPositon: {}, // 用于记录单位移动以前 的位置 便于回退
    },
    // 和地图有关的数据
    mapDt: {
      moveAreas: [], // 移动区域
      attachArea: [], // 攻击范围
      pathPoints: [], // 移动的点
      unitActions: [], // 单位可以有的action
      unitMoveActions: [], // 辅助显示action时动态效果
    }
  },
  mutations: {
    // 修改map 状态
    setMapStatus(state, status) {
      state.mapSt.mapStatus = status;
    },
    // 修改unit 状态
    setUnitStatus(state, status) {
      state.mapSt.unitStatus = status;
    },
    setRecordId(state, id) {
      console.log("设置记录ID");
      state.recordId = id;
    },
    // 改变当前点的位置
    changeCurrentPoint(state, point) {
      state.mapSt.currentPoint = point;
    },
    changeMoveArea(state, areas) {
      state.mapDt.moveAreas = areas;
    },
    changeAttachArea(state, areas) {
      state.mapDt.attachArea = areas;
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
    // 记录异动前的位置
    changeLastPosition(state, position){
      state.mapSt.lastPositon.row = position.row;
      state.mapSt.lastPositon.column = position.column;
    },
    moveBack(state){
      state.mapSt.currentUnit.row = state.mapSt.lastPositon.row;
      state.mapSt.currentUnit.column = state.mapSt.lastPositon.column;
    },
    changeMoveLength(state, length) {
      state.mapSt.moveLength = length;
    },
    // 修改单位的行动
    changeUnitAction(state, actions) {
      state.mapDt.unitActions = actions;
    },
    changeUnitMoveActions(state, actions) {
      state.mapDt.unitMoveActions = actions;
      console.log(state.mapDt.unitMoveActions);
    },
    moveAction(state) {
      state.mapDt.unitActions = state.mapDt.unitMoveActions;
    }
  },
  actions: {
    // 获取可移动区域
    getMoveArea(state, indexInfo) {
      let args = {};
      args.url = "/ws/getMoveArea"
      args.mes = indexInfo;
      state.dispatch("wsSendMes", args);
    },
    // 获取移动路线 同时获取 单位能进行的行动
    getMovePath(state, aimPostion) {
      let args = {};
      args.url = "/ws/getMovePath"
      args.mes = aimPostion;
      state.dispatch("wsSendMes", args);
    },
    // 获取攻击范围 
    getAttachArea(state) {
      let args = {};
      args.url = "/ws/getAttachArea"
      let mes = {};
      mes.index = state.getters.mapSt.currentUnitIndex;
      mes.position = state.getters.mapSt.currentPoint;
      args.mes = mes;
      state.dispatch("wsSendMes", args);
    }
  }
}


export default app
