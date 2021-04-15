<template>
  <div id="room_message">
    <el-container>
      <el-main class="masssage_main" ref="showMess">
        <div
          class="message"
          v-for="(message, index) in messageData"
          :key="index"
        >
          {{ message }}
        </div>
      </el-main>
      <el-footer class="messgaeInput">
        <el-input
          @keyup.enter.native="sendRoomMessage"
          v-model="inputMessage"
          placeholder="发送游戏消息"
          size="mini"
        >
        </el-input>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      messageData: [],
      inputMessage: null,
    };
  },
  methods: {
    sendRoomMessage() {
      if (this.inputMessage) {
        let sendMes = {};
        sendMes.message = this.inputMessage;
        sendMes.eventType = "SEND_MESSAGE";
        this.$store.dispatch("sendRoomEvent", sendMes);
      }
      this.inputMessage = null;
    },
    onGetRoomMessage(message) {
      console.log("收到房间消息", message);
      this.messageData.push(message);
      this.$refs.showMess.$el.scrollTop = this.$refs.showMess.$el.scrollHeight;
    },
  },
  created() {
    window.roomMessageVue = this;
    this.$eventBus.regist(this, "roomMessage", "onGetRoomMessage");
  },
  destroyed() {
    this.$eventBus.unRegist(this, "roomMessage");
  },
};
</script>

<style lang="scss">
#room_message {
  width: 98%;
  height: 98%;
  padding: 1%;
  .el-container {
    width: 100%;
    height: 100%;
    font-size: 10px;
    margin-bottom: 2px;
    word-wrap: break-word;
    color: rgb(250, 250, 250);
    .el-main {
      padding-left: 5px;
      padding-bottom: 15px;
    }
    .masssage_main {
      padding-bottom: 8%;
      .message {
        float: left;
        padding: 2px;
        text-align: left;
        width: 100%;
        margin-bottom: 2px;
      }
    }

    .messgaeInput {
      height: 15% !important;
      padding: 2%;
    }
  }
}
</style>