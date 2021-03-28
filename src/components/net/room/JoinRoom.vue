<template>
  <ae-base-dialog v-model="value" :width="width">
    <div>欢迎加入{{ roomName }}: 房间号{{ roomId }}</div>
    <div class="player_list">
      <el-table
        :cell-style="tableStyle"
        :header-cell-style="tableStyle"
        :data="canJoinArmy"
        style="width: 100%"
      >
        <el-table-column label="队伍">
          <template slot-scope="item">
            <img :src="$appHelper.getUnitImg('10', item.row.color)" />
          </template>
        </el-table-column>
        <el-table-column label="同盟">
          <template slot-scope="item">
            <div style="color: rgb(255, 255, 255)">{{ item.row.camp }}</div>
          </template>
        </el-table-column>
        <el-table-column label="玩家">
          <template slot-scope="item">
            <div style="color: rgb(255, 255, 255); font-size:14px">
              {{ item.row.player_name }}
              <span v-if="item.row.player == roomOwner">(房主)</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="item" width="30%">
            <ae-button :width="80" v-if="!item.row.player" @onClick="changeCtlArmy(item.row.color)">加入</ae-button>
            <ae-button :width="80" v-else-if="item.row.player && item.row.player != $store.getters.user.user_id && $store.getters.user.user_id == roomOwner" @onClick="levelArmy">踢出</ae-button>
            <ae-button :width="80" v-else-if="$store.getters.user.user_id != roomOwner && $store.getters.user.user_id == item.row.player" @onClick="levelArmy">退出</ae-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="room_message">
      <room-message ref="roomMessage"></room-message>
    </div>
  </ae-base-dialog>
</template>

<script>
import {ChangeArmy} from '../../../api'
import dialogShow from "../../../mixins/frame/dialogShow.js";
import RoomMessage from "../room/RoomMessage";
export default {
  mixins: [dialogShow],
  components: {
    RoomMessage,
  },
  props: {
    roomId: {
      type: String,
    },
    roomName: {
      type: String,
    },
    width: {
      type: Number,
      default: 40,
    },
    armyConfigList: {
      type: Array,
      default: [],
    },
    roomOwner:{
      type:Number,
    }
  },
  methods: {
    onDialogCreate() {
      console.log("加入房間页面创建");
    },
    tableStyle({ row, rowIndex }) {
      return "background-color: #5a5c59";
    },
    onDialogDestroy() {
      console.log("加入房間页面销毁");
      this.$store.dispatch("disconnectRoomScoket");
    },
    initSetting(roomId) {
      let joinArgs = {};
      joinArgs.roomId = roomId;
      joinArgs.type = "createRoom";
      return this.$store.dispatch("connectRoomSocket", joinArgs);
    },
    changeCtlArmy(color){
      let args = {};
      args.new_army = color;
      this.$appHelper.setLoading();
      ChangeArmy(args).then(resp=>{
        this.$appHelper.setLoading();
        if (resp && resp.res_code == 0) {
        } else {
          this.$message.info("加入失败");
        }
      }).catch(error=>{
        console.error(error);
        this.$appHelper.setLoading();
      })
    },
    joinRoomSocket(roomId) {
      let joinArgs = {};
      joinArgs.roomId = roomId;
      joinArgs.type = "joinRoom";
      return this.$store.dispatch("connectRoomSocket", joinArgs);
    },
    onChangeArmyMessage(message) {
      console.log("玩家改变选择单位", message, this);
      for (let army of this.armyConfigList) {
        if (army.color == message.join_army) {
          army.player = message.user_id;
          army.player_name = message.user_name;
          continue;
        }
        if (army.color == message.level_army) {
          army.player = null;
          army.player_name = null;
        }
      }
      this.armyConfigList = JSON.parse(JSON.stringify(this.armyConfigList))
    },
  },
  created() {
    window.JoinRoomVue = this;
    this.$eventBus.regist(this, "roomChangeArmy", "onChangeArmyMessage");
  },
  destroyed() {
    this.$eventBus.unRegister(this, "roomChangeArmy");
  },
  computed: {
    canJoinArmy() {
      return this.armyConfigList.filter((a) => a.type == "user");
    },
  },
};
</script>

<style lang="scss" scoped>
.player_list {
  margin-top: 2%;
  float: left;
  width: 60%;
  height: 300px;
}
.room_message {
  margin-top: 2%;
  float: left;
  width: 40%;
  height: 300px;
}
</style>