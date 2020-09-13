// 都会用到的一些 common

import { GetUnitInfoList } from '../../api'

const mapStatus = ["noAction", "showMoveArea", "move", "showAction",
  "willAttach", "attachIng", "levelUp", "attachDone", "actionDone", "secendMove", "lifeChange",
  "willSummon", "summonIng", "willEnd"];

const unitStatus = ["noAction", "moveIng", "moveDone"];

const app = {
  state: {
    recordId: null,
    record: {},
    // 和地图有关的公共属性
    mapSt: {
      mapStatus: "noAction", // 一个重要的 状态变量 控制前端界面的状态
      unitStatus: "noActon", // 当前单位的状态 
      currentUnitIndex: -1, // 当前单位所处的index
      currentPoint: { row: 1, column: 1 },// 当前点的位置
      currentUnit: null, // 记录当前单位
      currentColor: null, // 记录当前军队颜色
      beAttachUnit: {}, // 记录被攻击的单位
      
      moveLength: -1, // 将要移动的距离
      lastPositon: {}, // 用于记录单位移动以前 的位置 便于回退
      secendMove: false,
      beSummonTomb: {}, // 准备被召唤的单位
      buyUnitDialog: false, // 购买军队的开关
      currentRegionColor: "",
    },
    // 和地图有关的数据
    mapDt: {
      moveAreas: [], // 移动区域
      attachArea: [], // 攻击范围
      pathPoints: [], // 移动的点
      unitActions: [], // 单位可以有的action
      unitMoveActions: [], // 辅助显示action时动态效果
      attachResult: {},
      lifeChangeUnit: [],
      buyUnitsInfo: [], // 可以购买的单位信息
    },
    // 和展示有关的辅助数据
    mapAs: {
      beAttachUnitBak: {},  // 用于记录当前的被攻击的位置 辅助展示特效
      attachTimer: null, // 辅助展示攻击特效的定时器
      attachSpark: 0, // 辅助展示攻击火花
      selfAttachSpark: 0, // 辅助展示反击火花 一共有七张火花图
      beAttachDeadTimer: null, //辅助让单位变成坟墓 的定时器
      attachDeadTimer: null, //辅助让单位变成坟墓 的定时器
      beAttachDustNum: 0, // 辅助让单位变成坟墓
      attachDustNum: 0, // 辅助让反击击杀 的单位变成坟墓
      leveupImg: {}, // 辅助单位升级
      summonSpark: 0, // 辅助展示召唤特效
      lordWillBuy: false, // 标记是否是从领主查看招募信息
      lordBuy: false, // 标记为领主招募
    },

  },
  mutations: {
    changeArmyList(state, armys) {
      state.record.army_list = armys;
    },
    // 设置可以购买的军队的信息
    changeBuyUnitsInfo(state, unitsInfo) {
      state.mapDt.buyUnitsInfo = unitsInfo;
    },
    // 是否是领主购买的 是的话购买的棋子要立马移动
    changeLordWillBuy(state, flag) {
      state.mapAs.lordWillBuy = flag;
    },
    // 是否是领主购买的 是的话购买的棋子要立马移动
    changeLordBuy(state, flag) {
      state.mapAs.lordBuy = flag;
    },
    // 关闭购买提示框
    changeBuyUnitDialog(state, flag) {
      state.mapSt.buyUnitDialog = flag;
    },
    // 修改当前地形的color
    setCurrentRegionColor(state, color) {
      state.mapSt.currentRegionColor = color;
    },
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
    setRecord(state, record) {
      state.record = record;
    },
    // 改变当前点的位置
    changeCurrentPoint(state, point) {
      state.mapSt.currentPoint = point;
    },
    changeMoveArea(state, areas) {
      state.mapDt.moveAreas = areas;
    },
    // 是否二次移动
    changeSecendMove(state, flag) {
      state.mapSt.secendMove = flag;
    },
    changeAttachArea(state, areas) {
      state.mapDt.attachArea = areas;
    },
    // 改变移动路径
    changePathPoints(state, path) {
      state.mapDt.pathPoints = path;
    },
    // 改变当前单位
    changeCurrentUnit(state, unit) {
      state.mapSt.currentUnit = unit;
      // 同时修改当前单位信息
      const key = unit.type + "_" + unit.level;
      let currentUnitInfo = this.getters.unitInfo[key];
      if (currentUnitInfo == null) {
        this.dispatch("getUnitInfo", key).then(res => {
          console.log("没有缓存");
          this.commit("currentUnitInfo", res);
        });
      } else {
        console.log("有缓存");
        this.commit("currentUnitInfo", currentUnitInfo);
      }

    },
    changeBeSummonTomb(state, tomb) {
      state.mapSt.beSummonTomb = tomb;
    },
    changeCurrentColor(state, color) {
      state.mapSt.currentColor = color;
    },
    // 改变被攻击的单位
    changeBeAttachUnit(state, unit) {
      state.mapSt.beAttachUnit = unit;
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
    changeLastPosition(state, position) {
      state.mapSt.lastPositon.row = position.row;
      state.mapSt.lastPositon.column = position.column;
    },
    // 回退
    moveBack(state) {
      state.mapSt.moveLength = 0;
      if (state.mapSt.lastPositon.row) {
        state.mapSt.currentUnit.row = state.mapSt.lastPositon.row;
        state.mapSt.currentUnit.column = state.mapSt.lastPositon.column;
      }
      state.mapSt.lastPositon = {}
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
    },
    // 动态移动图标 
    moveAction(state) {
      state.mapDt.unitActions = state.mapDt.unitMoveActions;
    },
    changeAttachResult(state, result) {
      state.mapDt.attachResult = result;
    },
    // 改变单位等级
    changeLevelImg(state) {
      console.log("改变单位等级");
      let row = state.mapAs.leveupImg.row - 0.5;
      state.mapAs.leveupImg = { row: row, column: state.mapAs.leveupImg.column };
    },
    // 展示攻击特效 主要是有抖动效果
    setAttachTimer(state) {
      state.mapSt.mapStatus = 'attachIng';
      state.mapAs.beAttachUnitBak = JSON.parse(JSON.stringify(state.mapSt.beAttachUnit));
      console.log("展示攻击特效");
      state.mapAs.attachTimer = setInterval(() => {
        if (state.mapAs.attachSpark == 0) {
          state.mapSt.beAttachUnit.row = state.mapSt.beAttachUnit.row - 0.5;
          state.mapAs.attachSpark++;
        } else if (state.mapAs.attachSpark == 1) {
          state.mapSt.beAttachUnit.row = state.mapSt.beAttachUnit.row + 0.5;
          state.mapAs.attachSpark++;
        } else if (state.mapAs.attachSpark == 2) {
          state.mapSt.beAttachUnit.row = state.mapSt.beAttachUnit.row + 0.5;
          state.mapAs.attachSpark++;
        } else if (state.mapAs.attachSpark == 3) {
          state.mapSt.beAttachUnit.row = state.mapSt.beAttachUnit.row - 0.5;
          state.mapAs.attachSpark++;
        } else if (state.mapAs.attachSpark == 4) {
          state.mapSt.beAttachUnit.column = state.mapSt.beAttachUnit.column - 0.5;
          state.mapAs.attachSpark++;
        } else if (state.mapAs.attachSpark == 5) {
          state.mapSt.beAttachUnit.column = state.mapSt.beAttachUnit.column + 0.5;
          state.mapAs.attachSpark++;
        } else if (state.mapAs.attachSpark == 6) {
          state.mapSt.beAttachUnit.column = state.mapSt.beAttachUnit.column + 0.5;
          state.mapAs.attachSpark++;
        } else if (state.mapAs.attachSpark == 7) {
          state.mapSt.beAttachUnit.column = state.mapSt.beAttachUnit.column - 0.5;
          state.mapAs.attachSpark = 0;
          clearInterval(state.mapAs.attachTimer);
          // attachEvent3. 如果有被反击展示反击特效 否则直接处理结果
          if (state.mapDt.attachResult.counterattack) {
            state.mapAs.attachTimer = null;
            console.log("展示反击特效");
            // 备份上一个被攻击的单位
            state.mapAs.beAttachUnitBak = JSON.parse(JSON.stringify(state.mapSt.currentUnit));

            state.mapAs.attachTimer = setInterval(() => {
              if (state.mapAs.selfAttachSpark == 0) {
                state.mapSt.currentUnit.row = state.mapSt.currentUnit.row - 0.5;
                state.mapAs.selfAttachSpark++;
              } else if (state.mapAs.selfAttachSpark == 1) {
                state.mapSt.currentUnit.row = state.mapSt.currentUnit.row + 0.5;
                state.mapAs.selfAttachSpark++;
              } else if (state.mapAs.selfAttachSpark == 2) {
                state.mapSt.currentUnit.row = state.mapSt.currentUnit.row + 0.5;
                state.mapAs.selfAttachSpark++;
              } else if (state.mapAs.selfAttachSpark == 3) {
                state.mapSt.currentUnit.row = state.mapSt.currentUnit.row - 0.5;
                state.mapAs.selfAttachSpark++;
              } else if (state.mapAs.selfAttachSpark == 4) {
                state.mapSt.currentUnit.column = state.mapSt.currentUnit.column - 0.5;
                state.mapAs.selfAttachSpark++;
              } else if (state.mapAs.selfAttachSpark == 5) {
                state.mapSt.currentUnit.column = state.mapSt.currentUnit.column + 0.5;
                state.mapAs.selfAttachSpark++;
              } else if (state.mapAs.selfAttachSpark == 6) {
                state.mapSt.currentUnit.column = state.mapSt.currentUnit.column + 0.5;
                state.mapAs.selfAttachSpark++;
              } else if (state.mapAs.selfAttachSpark == 7) {
                state.mapSt.currentUnit.column = state.mapSt.currentUnit.column - 0.5;
                state.mapAs.selfAttachSpark = 0;
                clearInterval(state.mapAs.attachTimer);
                state.mapAs.attachTimer = null;
                this.commit("handleAttachResult");
              }
            }, 50);
          } else {
            this.commit("handleAttachResult");
          }
        }
      }, 50);
    },
    // 处理攻击后的结果
    handleAttachResult(state) {
      console.log("处理攻击结果");
      const attachResult = state.mapDt.attachResult;
      // attachEvent 1 判断被攻击的单位的状态
      if (attachResult.attach_result.dead) {
        state.mapSt.beAttachUnit.isDead = true;
        // 将单位转换成坟墓
        state.mapAs.beAttachDeadTimer = setInterval(() => {
          if (state.mapAs.beAttachDustNum == 4) {
            clearInterval(state.mapAs.beAttachDeadTimer);
            // 判断单位死了之后是否有坟墓
            if (attachResult.attach_result.have_tomb) {
              console.log("单位死亡有墓碑");
              let tomb = {};
              tomb.row = state.mapSt.beAttachUnit.row;
              tomb.column = state.mapSt.beAttachUnit.column;
              state.record.tomb.push(tomb);
            }
            state.mapAs.beAttachDustNum = 0;
            state.mapAs.beAttachDeadTimer = null;
          } else {
            state.mapAs.beAttachDustNum++;
          }
        }, 100);
      } else {
        // 改变单位的剩余的血量
        state.mapSt.beAttachUnit.life = attachResult.attach_result.last_life;
        if (attachResult.attach_result.end_status != null) {
          // 改变单位的经验
          state.mapSt.beAttachUnit.status = attachResult.attach_result.end_status;
        }
        // 改变单位的经验
        state.mapSt.currentUnit.experience = attachResult.attach_result.end_experience;
      }
      // attachEvent4.2 判断攻击单位的状态
      console.log("判断是否反击");
      if (attachResult.counterattack) {
        // 只有当有反击发生的时候才有的逻辑
        if (attachResult.counterattack_result.dead) {
          // 去掉死掉的单位
          state.mapSt.currentUnit.isDead = true;
          // 将单位转换成坟墓
          state.mapAs.attachDeadTimer = setInterval(() => {
            if (state.mapAs.attachDustNum == 4) {
              clearInterval(state.mapAs.attachDeadTimer);
              // 判断单位死了之后是否有坟墓
              if (attachResult.attach_result.have_tomb) {
                console.log("单位死亡有墓碑");
                let tomb = {};
                tomb.row = state.mapSt.currentUnit.row;
                tomb.column = state.mapSt.currentUnit.column;
                state.record.tomb.push(tomb);
              }
              state.mapAs.attachDustNum = 0;
              state.mapAs.attachDeadTimer = null;
            } else {
              state.mapAs.attachDustNum++;
            }
          }, 100);

        } else {
          // 改变单位的剩余的血量
          state.mapSt.currentUnit.life = attachResult.counterattack_result.last_life;

          if (attachResult.counterattack_result.end_status != null) {
            // 改变单位的经验
            state.mapSt.currentUnit.status = attachResult.counterattack_result.end_status;
          }
          // 改变单位的经验
          state.mapSt.beAttachUnit.experience = attachResult.counterattack_result.end_experience;
        }
      }
      // attachEvent4.3 判断主动攻击是否升级
      if (attachResult.attach_result.leave_up) {
        console.log("攻击者升级");
        setTimeout(this.commit("changeLevelUnit", state.mapSt.currentUnit), 1);
        setTimeout(() => {
          if (attachResult.counterattack && attachResult.counterattack_result.leave_up) {
            console.log("反击者升级");
            setTimeout(this.commit("changeLevelUnit", state.mapSt.beAttachUnit), 1);
          } else {
            this.commit("doEndAction");
          }
        }, 850);
      } else if (attachResult.counterattack && attachResult.counterattack_result.leave_up) {
        console.log("反击者升级");
        setTimeout(this.commit("changeLevelUnit", state.mapSt.beAttachUnit), 1);
      } else {
        this.commit("doEndAction");
      }
    },
    // 改变升级图片的位置
    changeLevelUnit(state, unit) {
      state.mapAs.leveupImg.row = unit.row;
      state.mapAs.leveupImg.column = unit.column;
      this.commit("setMapStatus", "levelUp");
      setTimeout(() => {
        this.commit("changeLevelImg");
      }, 100);
      setTimeout(() => {
        state.mapAs.leveupImg = {};
        this.commit("setMapStatus", "attachDone");
        unit.level++;
        if (unit.row == state.mapSt.beAttachUnit.row && unit.column == state.mapSt.beAttachUnit.column) {
          this.commit("doEndAction");
        }
      }, 600);
    },
    doEndAction(state) {
      if (state.mapSt.secendMove) {
        this.commit("setMapStatus", "secendMove");
      } else {
        this.dispatch("getEndResult", "getEndResult");
      }
      state.mapDt.pathPoints = [];
    },
    // 改变当前状态
    endCurrentUnit(state) {
      state.mapSt.currentUnit.done = true;
      state.mapSt.mapStatus = 'noAction';
      state.mapSt.lastPositon = {};
    },
    // 实现结束的状态改变
    setEndResult(state, lifeChanges) {
      // 准备进行改变单位状态操作
      console.log(lifeChanges);
      let isChangeLife = false;
      if (lifeChanges != null) {
        state.mapDt.lifeChangeUnit = [];
        // 每个单位查看
        for (var armyIndex in lifeChanges) {

          if (lifeChanges[armyIndex] != null) {
            const lifeChange = lifeChanges[armyIndex];
            console.log(lifeChange);
            const army = state.record.army_list[armyIndex];
            const units = army.units;

            for (let index = 0; index < lifeChange.length; index++) {
              const unitChange = lifeChange[index];
              let unit = units[unitChange.index];
              if (unitChange.dead) {
                console.log("惨死");
              } else {
                console.log("还存活");
                if (unitChange.last_life != null) {
                  unit.life = unitChange.last_life;
                  let changeUnit = {};
                  changeUnit.row = unit.row;
                  changeUnit.column = unit.column;
                  changeUnit.change = unitChange.change;
                  state.mapDt.lifeChangeUnit.push(changeUnit);
                  isChangeLife = true;
                }
                if (unitChange.state != null) {
                  if (unitChange.state == 'normal') {
                    unit.status = null;
                  } else {
                    unit.status = unitChange.state;
                  }
                }
              }
            }

          }
        }

        console.log(state.mapDt.lifeChangeUnit);
        console.log(state.mapDt.lifeChangeUnit.length);

        if (state.mapDt.lifeChangeUnit.length > 0 && isChangeLife) {
          state.mapSt.mapStatus = 'lifeChange';
          state.mapSt.currentUnit.done = true;
          setTimeout(() => {
            state.mapDt.lifeChangeUnit = [];
            state.mapSt.mapStatus = 'noAction';
          }, 1100);
        } else {
          state.mapSt.currentUnit.done = true;
          state.mapSt.mapStatus = 'noAction';
        }
      }
    },
    // 召唤
    doSummon(state, result) {
      console.log("准备召唤");
      // 清除tomb
      for (let index = 0; index < state.record.tomb.length; index++) {
        const tomb = state.record.tomb[index];
        console.log(tomb);
        console.log(state.mapSt.beSummonTomb);
        if (tomb.row == state.mapSt.beSummonTomb.row && tomb.column == state.mapSt.beSummonTomb.column) {
          console.log("准备清除tomb" + index);
          state.record.tomb.splice(index, 1);
          console.log(state.record.tomb);
        }
      }
      state.mapSt.mapStatus = 'summonIng';
      state.mapAs.summonSpark++;
      state.mapAs.attachTimer = setInterval(() => {
        if (state.mapAs.summonSpark >= 6) {
          state.mapAs.summonSpark = 0;
          state.mapSt.currentUnit.experience = result.end_experience;
          clearInterval(state.mapAs.attachTimer);
          // 展示单位
          let army = state.record.army_list[result.army_index];
          army.units.push(result.bone);
          this.commit("doEndAction");
        } else {
          state.mapAs.summonSpark++;
        }
      }, 100);
    },
    //购买军队
    doBuyUnit(state, unitIno) {
      // 增加单位 改变人口和金币
      for (let i = 0; i < state.record.army_list.length; i++) {
        let army = state.record.army_list[i];
        if (army.color == state.record.curr_color) {
          army.units.push(unitIno.unit);
          army.money = unitIno.last_money;
          army.pop = unitIno.end_pop;
          this.commit("changeCurrentUnit", unitIno.unit);
          this.commit("changeCurrntUnitIndex", army.units.length - 1);
          break;
        }
      }
    },
    // 修改地形
    updateRegion(state, result) {
      state.record.game_map.regions[result.region_index] = result.square;
      console.log(state.record.game_map.regions[result.region_index]);
    },
    // 新回合
    newRound(state, record) {
      state.record.curr_color = record.curr_color;
      state.record.army_list = record.army_list;
      state.record.current_round = record.current_round;
      state.record.curr_camp = record.curr_camp;
      state.mapSt.mapStatus = 'noAction'
      state.mapSt.currentUnitIndex = -1;
      state.mapSt.currentUnit = null;
      state.mapSt.moveLength = -1;
      state.mapSt.currentPoint = {row: 1, column: 1};
      // 新的回合 判断是不是电脑 如果是电脑就主动发起robot 选择请求
    }
  },
  actions: {
    // 获取可移动区域
    getMoveArea(store, indexInfo) {
      let args = {};
      args.url = "/ws/getMoveArea"
      args.mes = indexInfo;
      store.dispatch("wsSendMes", args);
    },
    // 获取移动路线 同时获取 单位能进行的行动
    getMovePath(store, aimPostion) {
      let args = {};
      args.url = "/ws/getMovePath"
      args.mes = aimPostion;
      store.dispatch("wsSendMes", args);
    },
    // 获取单位的可选行为
    getActions(store, aimPostion) {
      let args = {};
      args.url = "/ws/getActions"
      args.mes = aimPostion;
      store.dispatch("wsSendMes", args);
    },
    // 获取攻击范围 
    getAttachArea(store) {
      let args = {};
      args.url = "/ws/getAttachArea"
      let mes = {};
      mes.index = store.getters.mapSt.currentUnitIndex;
      mes.position = store.getters.mapSt.currentPoint;
      args.mes = mes;
      store.dispatch("wsSendMes", args);
    },
    // 获取攻击结果
    getAttachResult(store) {
      let args = {};
      args.url = "/ws/getAttachResult"
      let mes = {};
      mes.attachUnit = store.getters.mapSt.currentUnit;
      mes.beAttachUnit = store.getters.mapSt.beAttachUnit;
      mes.path = store.getters.mapDt.pathPoints;
      args.mes = mes;
      store.dispatch("wsSendMes", args);
    },
    // 获取结束移动
    getEndResult(store) {
      store.commit("changeSecendMove", false);
      store.commit("setMapStatus", 'actionDone');

      let args = {};
      args.url = "/ws/getEndResult"
      let mes = {};
      mes = store.getters.mapSt.currentUnit;
      args.mes = mes;
      store.dispatch("wsSendMes", args);
    },
    // 获取召唤结果
    getSummonResult(store) {
      let args = {};
      args.url = "/ws/getSummonResult"
      let mes = {};
      mes.index = store.getters.mapSt.currentUnitIndex;
      mes.tomb = store.getters.mapSt.beSummonTomb;
      args.mes = mes;
      store.dispatch("wsSendMes", args);
    },
    // 获取修复结果
    getRepairResult(store) {
      let args = {};
      args.url = "/ws/getRepairResult"
      let mes = {};
      mes.index = store.getters.mapSt.currentUnitIndex;
      mes.region = store.getters.mapSt.currentPoint;
      args.mes = mes;
      store.dispatch("wsSendMes", args);
    },
    // 获取占领结果
    getOccupiedResult(store) {
      let args = {};
      args.url = "/ws/getOccupiedResult"
      let mes = {};
      mes.index = store.getters.mapSt.currentUnitIndex;
      mes.region = store.getters.mapSt.currentPoint;
      args.mes = mes;
      store.dispatch("wsSendMes", args);
    },
    // 获取可购买单位信息
    getCanByUnit(store) {
      let args = {};
      args.uuid = this.getters.record.uuid;
      GetUnitInfoList(args).then((resp) => {
        console.log("得到的结果");
        store.commit("changeBuyUnitsInfo", resp.res_val);
        store.commit("changeBuyUnitDialog", true);
      });
    },
    // 购买单位
    byUnit(store, type) {
      let args = {};
      args.url = "/ws/buyUnit"
      let mes = {};
      mes.type = type;
      mes.site = this.getters.mapSt.currentPoint;
      args.mes = mes;
      store.dispatch("wsSendMes", args);
    },
    getNewRound(store) {
      let args = {};
      args.url = "/ws/getNewRound"
      store.dispatch("wsSendMes", args);
    }

  }
}


export default app
