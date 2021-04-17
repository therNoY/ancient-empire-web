// 全局消息总线

var eventBus = {

  timer : null,
  /**
   * 消息
   */
  messageQueue: [],

  /**
   * 注册的消费者
   */
  register: {},

  regist: function (component, queue, callBack) {
    let componentObj = {
      component: component,
      callBack: callBack,
      queue:   queue,
    }
    if (this.register[queue]) {
      this.register[queue].push(componentObj);
    } else {
      let queueList = [];
      queueList.push(componentObj);
      this.register[queue] = queueList;
    }
    console.log("组件", component, "注册", queue, "成功");
  },


  unRegist:function(component, queue) {
    if (this.register[queue] && this.register[queue].length > 0) {
      for (let i = 0; i < this.register[queue].length; i ++) {
        const reg = this.register[queue][i];
        if (reg.component && reg.component._uid == component._uid) {
          console.log("组件取消注册", queue);
          this.register[queue].splice(i, 1);
          break;
        }
      }
    }
  },


  publish(queue, message) {
    console.log("收到队列", queue, "事件", message);
    let messageObj = {
      queue: queue,
      message: message,
    }
    if (this.register[queue] && this.register[queue].length > 0) {
      for (let reg of this.register[queue]) {
        if (reg.component && reg.component[reg.callBack]) {
          reg.component[reg.callBack](message);
        }
        
      }
    }
  },
}

Window.EventBus = eventBus;

export default eventBus;