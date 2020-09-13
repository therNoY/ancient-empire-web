import { gameCoreUlr } from '@/api/env'
import { Message } from 'element-ui'
import taskHandler from '../../manger/commendDispather'


const gameCore = {
  state: {
    taskQueue: [],
    socket: null,
  },

  mutations: {

  },

  actions: {

    // 连接一局游戏的socket 使用websocket
    connectGameSocket(store, recordId) {
      return new Promise((resolve, reject) => {
        let token = store.getter.token;
        if (!token) {
          reject("用户未登录");
        }
        // 首次登陆 需要验证token
        let url = gameCoreUlr + "/" + recordId + "/" + token;
        var wsConnect = new WebSocket('ws://localhost:8080/webSocket/' + index)
        resolve();
      });

    },

    // 执行任务队列的命令
    doCommend() {
      if (state.taskQueue.length > 0) {
        taskHandler.dispatch(taskQueue.shift());
      }
    },


  }
}

export default gameCore;
