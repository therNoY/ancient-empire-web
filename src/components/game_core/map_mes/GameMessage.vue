<template>
  <div id="game_message">
    <el-container>
      <el-main ref="showMess">
        <div
          style="message"
          v-for="(message, index) in messageData"
          :key="index"
        >
          {{ message }}
        </div>
      </el-main>
      <el-footer>
        <el-input @keyup.enter.native="sendGameMessage" v-model="inputMessage" placeholder="发送游戏消息" size="mini">
        </el-input>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {SendMessage} from "../../../api"
export default {
  props: [],
  data() {
    return {
      messageData: [],
      inputMessage: null,
    };
  },
  watch: {
    "$store.state.gameCore.gameMessage": function (message) {
      if (message) {
        this.messageData.push(message);
        this.$refs.showMess.$el.scrollTop = this.$refs.showMess.$el.scrollHeight;
        this.$store.commit("addGameMessage", "");
      }
    },
  },
  methods: {
    sendGameMessage(){
      if (this.inputMessage) {
        let sendMes = {};
        sendMes.message = this.inputMessage;
        sendMes.send_type_enum = "SEND_TO_GAME";
        SendMessage(sendMes);
      }
      this.inputMessage = null;
    }
  },
  created() {
    window.gameMessageVue = this;
  },
};
</script>

<style lang="scss">
#game_message {
  width: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    font-size: 10px;
    margin-bottom: 2px;
    color: rgb(121, 11, 11);
    .el-main{
      padding-left: 5px;
      padding-bottom: 15px;
    }
    .message {
      margin-bottom: 2px;
    }
  }
}
</style>