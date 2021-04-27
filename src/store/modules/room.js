import { gameCoreUrl } from '@/api/env'

import dispatcher from '../../manger/roomDispacther.js'


// 前端游戏的核心控制器
const roomNet = {
  state: {
    // 连接的socket
    roomSocket: null,
    room: {},
    roomMessage:{},
  },

  mutations: {
    setRoomSocket(state, ws) {
      state.roomSocket = ws;
    },
    addRoomMessage(state, message) {
      state.roomMessage = message;
    }
  },

  actions: {
    // 连接一局游戏的socket 使用websocket
    connectRoomSocket(store, {roomId, type}) {
      return new Promise((resolve, reject) => {
        let token = store.getters.token;
        if (!token) {
          reject("用户未登录");
        }
        // 首次登陆 需要验证token
        let url = gameCoreUrl + "/ae/" + type + "/" + roomId + "/" + token;
        let socket = new WebSocket(url);
        store.commit("setRoomSocket", socket);
        socket.onopen = () => {};
        socket.onmessage = (e) => {
          let data = JSON.parse(e.data);
          if (data.open_status && data.open_status == '200') {
            console.log("Room WS 连接成功", socket);
            resolve(data.message);
            return;
          }
          dispatcher.dispath(data);
        };

        socket.onclose = (e) => {
          console.log("Room ws 连接关闭", e);
          store.commit("setRoomSocket", null);
          reject();
        };
        socket.onerror = (e) => {
          console.error(e);
        };
      });
    },

    // 发送 事件
    sendRoomEvent({ state }, mes) {
      console.log("发送mes:", mes);
      state.roomSocket.send(JSON.stringify(mes));
    },

    disconnectRoomScoket({ state }){
      if (state.roomSocket && state.roomSocket.close) {
        state.roomSocket.close();
      }
    },

    // 测试是否连接
    testRoomConnect({ state }) {
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
      return state.roomSocket.readyState == 1;
    }

  }
}

export default roomNet;
