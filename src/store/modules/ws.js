

import '@/lib/sockjs'
import '@/lib/stomp'
import { baseUrl } from '@/api/env'
import { Message } from 'element-ui'

// map 状态
const status = ["showMoveArea", "showAction", "willAttach", "willSummon", "willEnd"];

const ws = {
  state: {
    recordId: null,
    stompClient: null,
  },

  mutations: {

  },

  actions: {
    // Ws连接
    wsConnection(store, recordId) {
      store.state.recordId = recordId;
      let url = baseUrl + "/stomp?name=" + recordId;
      console.log("ws 连接 url: " + url);
      // 可以理解为stompClient 
      store.state.stompClient = Stomp.over(new SockJS(url));
      // 建立连接并订阅主题
      store.state.stompClient.connect({}, (frame) => {

        store.state.stompClient.subscribe("/user/queue/user", resps => {
          const resp = JSON.parse(resps.body);

          if (resp.method.indexOf("ai_") != -1) {
            // 人机操作
            console.log("人机指令");
            console.log("准备执行 " + resp.method + "数据 ===>>>");
            console.log(resp.value)
            if (resp.method == "ai_selectUnit") {
              // ai 选择 移动指针
              let currentUnit = store.getters.record.army_list[resp.value.army_index].units[resp.value.unit_index];
              store.commit("changeCurrentPoint", resp.value.site);
              store.commit("changeCurrntUnitIndex", resp.value.unit_index);
              store.commit("changeCurrentUnit", currentUnit);
              store.commit("changeCurrentColor", resp.value.color);
            } else if (resp.method == "ai_moveUnit") {
              // 单位移动
              store.commit("changePathPoints", resp.value.path_positions);
              store.dispatch("aiMove");
            } else if (resp.method == "ai_end") {
              if (resp.value != null && resp.value.life_changes != null) {
                console.log("进行血量改变操作");
                let lifeChanges = resp.value.life_changes;
                store.commit("setEndResult", lifeChanges);
              } else {
                store.commit("endCurrentUnit");
              }
              store.commit("changePathPoints", []);
            } else if (resp.method == "ai_buyUnit") {
              store.dispatch("aiBuyUnit", resp.value);
            }else if(resp.method == 'ai_occupied') {
              // 单位移动
              store.commit("changePathPoints", resp.value.path_positions);
              store.dispatch("aiMove");
            }
          } else {
            // 玩家操作
            if (resp.method == "moveAreas") {
              store.commit("changeMoveArea", resp.value);
              store.commit("setMapStatus", "showMoveArea");
            } else if (resp.method == "movePath") {
              store.commit("changePathPoints", resp.value.movePath);
              store.commit("changeUnitAction", resp.value.actions.cAction);
              store.commit("changeUnitMoveActions", resp.value.actions.mAction);
            } else if (resp.method == "moveAction") {
              // 只有load 首次移动且在自己的城堡时
              store.commit("setMapStatus", "showAction");
              store.commit("changeUnitAction", resp.value.cAction);
              store.commit("changeUnitMoveActions", resp.value.mAction);
              store.commit("setMapStatus", "showAction");
              store.commit("changeLastPosition", store.getters.mapSt.currentUnit);
              setTimeout(() => {
                this.commit("moveAction");
              }, 50);
            } else if (resp.method == "attachArea") {
              store.commit("changeAttachArea", resp.value);
            } else if (resp.method == "attachResult") {
              console.log(resp.value);
              if (resp.value.second_move != null) {
                store.commit("changeSecendMove", resp.value.second_move);
                store.commit("changeMoveArea", resp.value.move_area);
                store.commit("changePathPoints", []);
              }
              store.commit("changeAttachResult", resp.value);
              store.commit("setAttachTimer");
              if (this.getters.mapAs.lordBuy) {
                store.commit("changeLordBuy", false);
              }
            } else if (resp.method == "summonResult") {
              if (resp.value.second_move != null) {
                store.commit("changePathPoints", []);
                store.commit("changeSecendMove", resp.value.second_move.second_move);
                store.commit("changeMoveArea", resp.value.second_move.move_area);
              }
              store.commit("doSummon", resp.value);
              if (this.getters.mapAs.lordBuy) {
                store.commit("changeLordBuy", false);
              }
            } else if (resp.method == "endResult") {
              if (resp.value != null && resp.value.life_changes != null) {
                let lifeChanges = resp.value.life_changes;
                store.commit("setEndResult", lifeChanges);
              } else {
                store.commit("endCurrentUnit");
              }
              if (this.getters.mapAs.lordBuy) {
                store.commit("changeLordBuy", false);
              }
              store.commit("changePathPoints", []);
            } else if (resp.method == "unitAction") {
              store.commit("setMapStatus", "showAction");
              store.commit("changeUnitAction", resp.value.cAction);
              store.commit("changeUnitMoveActions", resp.value.mAction);
              setTimeout(() => {
                store.commit("moveAction");
              }, 50);
            } else if (resp.method == "repairResult") {
              console.log("修理结果");
              if (resp.value.second_move != null) {
              }
              store.commit("updateRegion", resp.value);
              store.commit("doEndAction");
              if (this.getters.mapAs.lordBuy) {
                store.commit("changeLordBuy", false);
              }
            } else if (resp.method == "buyUnit") {
              console.log(resp.value);
              store.commit("doBuyUnit", resp.value.buy_unit_dto);
              store.commit("changeMoveArea", resp.value.move_area);
              store.commit("setMapStatus", "showMoveArea");
              store.commit("changeBuyUnitDialog", false);
              if (store.getters.mapAs.lordWillBuy) {
                // 如果是从购买领主
                store.commit("changeLordWillBuy", false);
                store.commit("changeLordBuy", true);
              }
            } else if (resp.method == "newRound") {
              console.log("新的回合");
              Message.info({
                message: ("新 的 回 合  收 入  + " + resp.value.add_money)
              });
              // 初始化所有辅助对象
              store.commit("newRound", resp.value.record);
            } else if (resp.method == "error") {
              console.log("错误");
            } else {
              console.error("没有handle");
            }
          }




        });

        store.state.stompClient.subscribe("/topic/room/" + recordId, val => {
          console.log("收到房间消息");
          console.log(val);
        });
      })
    },

    // ws 发送消息
    wsSendMes(store, args) {
      let user = { name: store.state.recordId };
      store.state.stompClient.send(
        args.url, user, JSON.stringify(args.mes)
      );
    },

  }
}



export default ws
