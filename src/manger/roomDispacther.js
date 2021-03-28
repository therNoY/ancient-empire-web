import store from "../store";
import eventBus from "../manger/EventBus"

var roomDispatcher = {
  dispath(event) {
    console.log("分发处理房间事件", event);
    if (event.room_commend == 'ARMY_CHANGE') {
      eventBus.publish("roomChangeArmy", event)
    }

    if (event.message) {
      eventBus.publish("roomMessage", event.message)
    }
  }
}

export default roomDispatcher;