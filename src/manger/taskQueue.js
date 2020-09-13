
// 维护了一个任务队列
var taskQueue = {
  // 维护的命令核心队列
  queue: [],

  // 获取任务队列的大小
  size: function () {
    return this.queue.length;
  },

  // 添加任务
  addTask: function (commend) {
    queue.push(commend);
  },

  // 获取队列的第一个元素
  pollTask: function () {
    return queue.shift();
  },

  // 获取队列的头元素
  peekTask: function () {
    if (this.length > 0) {
      return this.queue[0];
    } else {
      return null;
    }
  }

}

export default taskQueue;