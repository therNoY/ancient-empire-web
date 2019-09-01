import '@/lib/sockjs'
import '@/lib/stomp'
import { baseUrl } from '@/api/env'
import app from './app'

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
          if (resp.method == "moveAreas") {
            store.commit("changeMoveArea", resp.value);
          }else if (resp.method == "movePath") {
            store.commit("changePathPoints", resp.value.movePath);
          }else {
            console.error("没有handle");
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
