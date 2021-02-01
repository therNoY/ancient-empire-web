import { gameCoreUrl } from '@/api/env'
import { Message } from 'element-ui'
import commendDispatcher from '../../manger/commendDispather.js'

// 前端游戏的核心控制器
const gameCore = {
  state: {
    // 连接的socket
    socket: null,
    // 当前连接的游戏信息
    game: {},
    // 当前游戏的模板
    template: {},
    // 单位等级信息
    levelInfo: {},
    // 地图状态是1的时候不能点击其他的
    mapState: "0",
    // 是否展示购买单位弹框
    buyUnitDialog:false,
    // 游戏信息
    gameMessage:null,
  },

  mutations: {
    setSocket(state, ws) {
      state.socket = ws;
    },
    setGame(state, game) {
      state.game = game;
    },
    setTemplate(state, template) {
      state.template = template;
    },
    setMapState(state, mapState) {
      state.mapState = mapState;
    },
    setUnitLevelInfo(state, levelInfo) {
      state.levelInfo = levelInfo;
    },
    removeTomb(state, removeTomb) {
      for (let i = 0; i < state.game.tomb_list.length; i++) {
        const tomb = state.game.tomb_list[i];
        if (tomb.row == removeTomb.row && tomb.column == removeTomb.column) {
          state.game.tomb_list.splice(i, 1);
          break;
        }
      }
    },
    setBuyUnitDialog(state, dialog) {
      state.buyUnitDialog = dialog;
    },
    addUnit(state, addUnit){
      console.log("准备添加单位", addUnit);
      state.game.army_list[addUnit.army_index].units.push(addUnit.unit);
    },
    changeRegion(state, changeRegion) {
      console.log("准备改变地形", changeRegion);
      state.game.game_map.regions.splice(changeRegion.region_index, 1, changeRegion.region)
    },
    addGameMessage(state, message) {
      state.gameMessage = message;
    }
  },

  actions: {
    // 连接一局游戏的socket 使用websocket
    connectGameSocket(store, recordId, type = "stand") {
      return new Promise((resolve, reject) => {
        let token = store.getters.token;
        if (!token) {
          reject("用户未登录");
        }
        // 首次登陆 需要验证token
        let url = gameCoreUrl + "/ae/" + type + "/" + recordId + "/" + token;
        let socket = new WebSocket(url);
        store.commit("setSocket", socket);
        socket.onopen = () => {
          console.log("ws 连接成功", socket);
          this.commit("setAttachArea", []);
          this.commit("setAttachPoint", {});
          this.commit("setMoveArea", []);
          this.commit("setMoveLine", []);
          this.commit("setAction", []);
          resolve();
        };
        socket.onmessage = (e) => {
          let data = JSON.parse(e.data);
          console.log("收到服务发出的指令", data);
          if (data instanceof Array && data.length > 0) {
            commendDispatcher.dispatchOrder(data);
          } else {
            commendDispatcher.dispatch(data);
          }
        };

        socket.onclose = (e) => {
          console.log("ws 连接关闭", e);
          reject();
        }
      });
    },

    // 发送 事件
    sendEvent({ state }, mes) {
      console.log("发送mes:", mes);
      state.socket.send(JSON.stringify(mes));
    },

    // 测试是否连接
    testConnect({ state }) {
      /**
       * ebSocket的 readyState 属性用来定义连接状态，该属性的值有下面几种：
        * 0 ：对应常量CONNECTING (numeric value 0)，
        正在建立连接连接，还没有完成。The connection has not yet been established.
        1 ：对应常量OPEN (numeric value 1)，
        连接成功建立，可以进行通信。The WebSocket connection is established and communication is possible.
        2 ：对应常量CLOSING (numeric value 2)
        连接正在进行关闭握手，即将关闭。The connection is going through the closing handshake.
        3 : 对应常量CLOSED (numeric value 3)
        连接已经关闭或者根本没有建立。The connection has been closed or could not be opened.
       */
      return state.socket.readyState == 1;
    }

  }
}

export default gameCore;
