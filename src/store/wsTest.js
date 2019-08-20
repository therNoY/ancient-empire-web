import Vue from 'vue'
import Vuex from 'vuex'
import '../lib/sockjs'
import '../lib/stomp'
import '../lib/stomp'
import { baseUrl } from '../config/env'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    name: "123",
    magList: [],
    stompClient: null,
    // 单位在图上的位置
    unit_index: {
      unit_soldier: 1,
      unit_archer: 2,
      unit_water_element: 3,
      unit_witch: 4,
      unit_elf: 5,
      unit_wolf: 6,
      unit_stone: 7,
      unit_catapult: 8,
      unit_dragon: 9,
    }
  },
  mutations: {
    changeName(state, name) {
      state.name = name;
      console.log("修改之后的值" + name);
    },
    increment(state) {
      state.count++
    },
    addMesList(state, body) {
      state.magList.push(body);
    }
  },
  actions: {
    // Ws连接
    wsConnection(context) {
      let state = context.state;
      let url = baseUrl + "/stomp?name=" + state.name;
      // 可以理解为stompClient 
      state.stompClient = Stomp.over(new SockJS(url));
      // 建立连接并订阅主题
      state.stompClient.connect({}, (frame) => {
        console.log("frame是什么？");
        console.log(frame);
        state.stompClient.subscribe("/user/queue/marco", val => {
          console.log("从/user/queue/chat 收到消息" + typeof val + val.body);
          context.commit('addMesList', "个人消息：" + val.body);
        });
        state.stompClient.subscribe("/topic/marco", val => {
          console.log("从/topic/marco 收到消息" + typeof val + val.body);
          context.commit('addMesList', "系统消息：" + val.body);
        });
      })
    }
  }
})

