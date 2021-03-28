<template>
  <div>
    <ae-dialog
      ref="mainDiaglog"
      v-model="showModel"
      :showSearch="true"
      title="游戏大厅"
      :titleButtons="titleButtonList"
      :titleButtonClickAction="[clickAddbutton]"
      :footerButtons="buttonList"
      :footerButtonClickAction="[clickJoinGameButton, clickPreivewButton]"
      :queryDataGrid="queryDataFunction"
      :showItem="showItem"
      :showTitle="showTitle"
      page
    >
    </ae-dialog>
    <ae-dialog
      ref="addNewRoomDialog"
      v-model="addNewDialogShowModel"
      title="新建房间"
      :width="35"
      :formConfig="addNewRoomFormConfig"
      :footerButtons="createRoomButtons"
      :footerButtonClickAction="[clickCreateRoom, clickCancelCreateRoom]"
    ></ae-dialog>
    <join-room
      ref="joinRoom"
      :width="55"
      v-model="showJoinRoom"
      :roomName="joinRoomName"
      :roomId="joinRoomId"
      :roomOwner="roomOwner"
      :armyConfigList="armyConfigList"
    ></join-room>
    <ae-map-preview
      v-model="previewVisible"
      @close="closePreview"
      :mapId="previewMapId"
      :armyConfigList="armyConfigList"
    ></ae-map-preview>
  </div>
</template>

<script>
import { GetRoomListByPage, PlayerJoinRoom, CreateRoom } from "@/api";
import JoinRoom from "./JoinRoom.vue";
import AeMapPreview from "../../map_manger/AeMapPreview.vue";
import dialogShow from "../../../mixins/frame/dialogShow.js";
export default {
  mixins: [dialogShow],
  components: {
    JoinRoom,
    AeMapPreview,
  },
  props: {},
  data() {
    return {
      willChange: false,
      canJoinRoom: {},
      queryDataFunction: null,
      buttonList: ["加入", "预览"],
      titleButtonList: ["新增"],
      showItem: ["room_id", "room_name", "creat_time_show", "ready"],
      showTitle: ["房间号", "房间名字", "创建时间", "玩家"],
      createRoomButtons: ["创建", "取消"],
      addNewDialogShowModel: false,
      addNewRoomFormConfig: [
        {
          type: "input",
          key: "room_name",
          des: "房间名字",
          password: false,
          default: this.$store.getters.user.user_name + "的房间",
        },
        {
          type: "switchSelect",
          key: "game_type",
          des: "房间类型",
          default: "1",
          items: [
            { key: "1", value: "公开" },
            { key: "2", value: "私有" },
          ],
        },
        {
          type: "switchSelect",
          key: "game_model",
          des: "游戏模式",
          default: "1",
          items: [
            { key: "1", value: "无限" },
            { key: "2", value: "限时" },
          ],
        },
        {
          type: "switchSelect",
          key: "round_time",
          des: "回合限制",
          default: "2",
          items: [
            { key: "1", value: "1分钟" },
            { key: "2", value: "2分钟" },
            { key: "3", value: "3分钟" },
            { key: "5", value: "5分钟" },
            { key: "10", value: "10分钟" },
          ],
        },
        {
          type: "userMapSelect",
          key: "init_map",
          des: "选择地图",
        },
      ],
      joinMapId: "",
      joinRoomId: null,
      joinRoomName: "",
      showJoinRoom: false,
      previewMapId: null,
      previewVisible: false,
      armyConfigList: [],
      roomOwner:"",
    };
  },

  methods: {
    onDialogCreate() {
      console.log("页面创建");
      this.$refs.mainDiaglog.flushData();
    },
    closePreview() {},
    onDialogDestroy() {
      console.log("页面销毁");
    },
    clickAddbutton() {
      console.log("点击新增");
      this.addNewDialogShowModel = true;
    },
    clickJoinGameButton() {
      let selectMap = this.$refs.mainDiaglog.getDataGridSelect();
     
      this.$appHelper.setLoading();
      let joinRoomSocket = this.$refs.joinRoom.joinRoomSocket(selectMap.room_id);
      joinRoomSocket.then((resp) => {
          this.joinMapId = selectMap.map_id;
          this.joinRoomId = selectMap.room_id;
          this.joinRoomName = selectMap.room_name;
          this.armyConfigList = JSON.parse(resp);
          this.roomOwner = selectMap.room_owner;
          this.showJoinRoom = true;
          this.$message.info("加入成功");
          this.$appHelper.setLoading();
        })
        .catch((error) => {
          console.error(error);
          this.$message.info("加入失败");
          this.$appHelper.setLoading();
        });
    },
    clickPreivewButton() {
      let selectMap = this.$refs.mainDiaglog.getDataGridSelect();
      this.previewMapId = selectMap.map_id;
      let mapConfig = JSON.parse(selectMap.map_config);
      this.armyConfigList = mapConfig.armyList;
      this.previewVisible = true;
    },
    clickCreateRoom() {
      console.log("创建房间");
      let formData = this.$refs.addNewRoomDialog.getFormData();
      console.log(formData);
      if (!formData) {
        this.$message.info("创建房间数据不完整");
        return;
      }
      if (!formData) {
        this.$message.info("创建房间数据不完整");
        return;
      }

      if (!formData.room_name) {
        this.$message.info("房间名字不能为空");
        return;
      }

      if (!formData.init_map) {
        this.$message.info("必须选择地图");
        return;
      }
      let args = formData;
      this.$appHelper.setLoading();
      CreateRoom(args)
        .then((resp) => {
          if (resp.res_code == 0) {
            this.addNewDialogShowModel = false;
            this.joinMapId = this.$refs.addNewRoomDialog.getFormData().init_map.map_id;
            this.joinRoomId = resp.res_val.room_id;
            this.joinRoomName = resp.res_val.room_name;
            this.roomOwner = this.$store.getters.user.user_id;
            this.armyConfigList = JSON.parse(resp.res_val.map_config).armyList;
            console.log(this.$refs.addNewRoomDialog.getFormData());
            let initSetting = this.$refs.joinRoom.initSetting(
              resp.res_val.room_id
            );
            initSetting.then((joinRoomPromise) => {
                this.showJoinRoom = true;
                console.log("joinRoomPromise result >>>", resp, joinRoomPromise);
                this.$message.info("创建成功");
                this.$appHelper.setLoading();
              })
              .catch((error) => {
                this.$message.info("加入房间失败");
                this.$appHelper.setLoading();
                this.showJoinRoom = false;
              });
          } else {
            console.log("创建房间失败, 请稍后重试");
            this.$appHelper.setLoading();
          }
        })
        .catch((error) => {
          console.error(error);
          this.$appHelper.setLoading();
        });
    },
    clickCancelCreateRoom() {
      console.log("取消创建房间");
    },
  },
  computed: {},
  created() {
    window.RoomIndexVue = this;
    this.queryDataFunction = GetRoomListByPage;
  },
  destroyed() {
  },
};
</script>

<style scoped>
</style>