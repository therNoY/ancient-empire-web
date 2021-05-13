<template>
  <ae-base-dialog v-model="value" :width="width" showCloseTip closeTip="确定要退出房间吗？">
    <div>欢迎加入{{ roomName }} 房间号{{ roomId }}</div>
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
            <div style="color: rgb(255, 255, 255); font-size: 14px">
              {{ item.row.player_name }}
              <span
                style="color: rgb(255, 255, 255); font-size: 13px"
                v-if="roomOwner && item.row.player == roomOwner"
                >(房主)</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="item" width="30%">
            <ae-button
              :width="80"
              v-if="!item.row.player"
              @onClick="changeCtlArmy(item.row.color)"
              >加入</ae-button
            >
            <ae-button
              :width="80"
              v-else-if="
                item.row.player &&
                item.row.player != $store.getters.user.user_id &&
                $store.getters.user.user_id == roomOwner
              "
              @onClick="levelCtlArmy(item.row.color, item.row.player)"
              >踢出</ae-button
            >
            <ae-button
              :width="80"
              v-else-if="$store.getters.user.user_id == item.row.player"
              @onClick="levelCtlArmy(item.row.color, item.row.player)"
              >退出</ae-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="room_message">
      <room-message ref="roomMessage"></room-message>
    </div>
    <map-preview v-model="showPreview" :mapId="mapId"></map-preview>
    <div class="bottom-button">
      <ae-button @onClick="showPreview = true">预览</ae-button>
      <ae-button>邀请</ae-button>
      <ae-button
        v-show="roomOwner && $store.getters.user.user_id == roomOwner"
        @onClick="showStartTip = true"
        >开始</ae-button
      >
    </div>
    <ae-tip
      v-model="showStartTip"
      :closeTip="startTip()"
      @ok="startRoomGame"
    ></ae-tip>
  </ae-base-dialog>
</template>

<script>
import {
  ChangeArmy,
  LevelCtlArmy,
  RoomInit,
  GetUserTemp,
  GetRecordById,
  GetUnitLevelByTemp,
} from "../../../api";
import dialogShow from "@/mixins/frame/dialogShow.js";
import MapPreview from "@frame/MapPreview.vue";
import RoomMessage from "../room/RoomMessage.vue";
export default {
  mixins: [dialogShow],
  components: {
    RoomMessage,
    MapPreview,
  },
  data() {
    return {
      armyConfigList: null,
      roomOwner: null,
      showStartTip: false,
      showPreview: false,
    };
  },
  props: {
    roomId: {
      type: String,
    },
    mapId: {
      type: String,
    },
    roomName: {
      type: String,
    },
    width: {
      type: Number,
      default: 40,
    },
  },
  methods: {
    startTip() {
      if (
        this.armyConfigList &&
        this.armyConfigList.filter((a) => a.type == "user" && !a.play_id)
          .length > 0
      ) {
        return "玩家还未全部加入,确定要开始么？";
      } else {
        return "准备开始？";
      }
    },

    startRoomGame() {
      let args = {};
      args.room_id = this.roomId;
      RoomInit(args);
    },

    onStartGame({ record_id }) {
      setTimeout(() => {
        this.$appHelper.setLoading();
        GetRecordById(record_id)
          .then((resp) => {
            if (resp.res_code == 0) {
              this.$store.commit("setGame", resp.res_val);
              // 获取单位最大生命值
              this.getUnitLevelByTemp(resp.res_val.template_id);
              // 获取模板
              GetUserTemp(resp.res_val.template_id).then((tempResp) => {
                if (tempResp && tempResp.res_val) {
                  this.$store.commit("setTemplate", tempResp.res_val);
                  let connArgs = {};
                  connArgs.recordId = resp.res_val.uuid;
                  connArgs.type = "net_game";
                  this.$store
                    .dispatch("connectGameSocket", connArgs)
                    .then((r) => {
                      this.$appHelper.setLoading();
                      this.loading = false;
                      this.$router.push("/gameIndex");
                    })
                    .catch((e) => {
                      console.error(e);
                      this.$appHelper.setLoading();
                    });
                } else {
                  this.$appHelper.errorMsg(resp.res_mes);
                  this.$appHelper.setLoading();
                }
              });
            } else {
              this.$appHelper.errorMsg(resp.res_mes);
              this.$appHelper.setLoading();
            }
          })
          .catch((e) => {
            console.error(e);
            this.$appHelper.setLoading();
          });
      }, 500);
    },

    async getUnitLevelByTemp(tempId) {
      const resp = await GetUnitLevelByTemp(tempId);
      if (resp.res_code == 0) {
        this.$store.commit("setUnitLevelInfo", resp.res_val);
        return resp.res_val;
      } else {
        this.$appHelper.errorMsg(resp.res_mes);
        return null;
      }
    },

    onDialogCreate() {
      console.log("加入房間页面创建");
    },
    tableStyle({ row, rowIndex }) {
      return "background-color: #5a5c59";
    },
    onDialogDestroy() {
      console.log("加入房間页面销毁");
      this.$store.dispatch("disconnectRoomScoket");
      this.$eventBus.publish("flushRoom");
    },
    initSetting(roomId) {
      let joinArgs = {};
      joinArgs.roomId = roomId;
      joinArgs.type = "createRoom";
      return this.$store.dispatch("connectRoomSocket", joinArgs);
    },
    changeCtlArmy(color) {
      let args = {};
      args.new_army = color;
      this.$appHelper.setLoading();
      ChangeArmy(args)
        .then((resp) => {
          this.$appHelper.setLoading();
          if (resp && resp.res_code == 0) {
          } else {
            this.$appHelper.infoMsg("加入失败");
          }
        })
        .catch((error) => {
          console.error(error);
          this.$appHelper.setLoading();
        });
    },
    levelCtlArmy(color, userId) {
      let args = {};
      args.color = color;
      args.player_id = userId;
      this.$appHelper.setLoading();
      LevelCtlArmy(args)
        .then((resp) => {
          this.$appHelper.setLoading();
        })
        .catch((error) => {
          console.error(error);
          this.$appHelper.setLoading();
        });
    },
    joinRoomSocket(roomId) {
      let joinArgs = {};
      joinArgs.roomId = roomId;
      joinArgs.type = "joinRoom";
      return this.$store.dispatch("connectRoomSocket", joinArgs);
    },
    onChangeArmyMessage(message) {
      console.log("玩家改变选择单位", message);
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
      this.armyConfigList = JSON.parse(JSON.stringify(this.armyConfigList));
    },
    onChangeRoomOwner(message) {
      console.log("房间改变房主", message);
      this.roomOwner = message.user_id;
    },
  },
  created() {
    window.JoinRoomVue = this;
    this.$eventBus.regist(this, "roomChangeArmy", "onChangeArmyMessage");
    this.$eventBus.regist(this, "changeRoomOwner", "onChangeRoomOwner");
    this.$eventBus.regist(this, "stratGame", "onStartGame");
  },
  destroyed() {
    this.$eventBus.unRegist(this, "roomChangeArmy");
    this.$eventBus.unRegist(this, "changeRoomOwner");
    this.$eventBus.unRegist(this, "stratGame");
  },
  computed: {
    canJoinArmy() {
      if (this.armyConfigList) {
        return this.armyConfigList.filter((a) => a.type == "user");
      }
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
