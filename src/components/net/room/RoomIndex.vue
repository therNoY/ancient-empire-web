<template>
  <div>

    <ae-complex-dialog
      ref="mainDiaglog"
      v-model="showModel"
      :showSearch="true"
      title="游戏大厅"
      :titleButtons="titleButtonList"
      :footerButtons="buttonList"
      :initQueryDataGrid="queryDataFunction"
      :showItem="showItem"
      :showTitle="showTitle"
      page
    >
    </ae-complex-dialog>

    <ae-complex-dialog
      ref="addNewRoomDialog"
      v-model="addNewDialogShowModel"
      title="新建房间"
      :width="35"
      :formConfig="addNewRoomFormConfig"
      :footerButtons="createRoomButtons"
    ></ae-complex-dialog>

    <join-room
      ref="joinRoom"
      :width="55"
      v-model="showJoinRoom"
      :roomName="joinRoomName"
      :roomId="joinRoomId"
      :mapId="joinMapId"
      :roomOwnerUser="roomOwner"
      :armyConfigs="armyConfigList"
    ></join-room>

    <map-preview
      v-model="previewVisible"
      @close="closePreview"
      :mapId="previewMapId"
      :armyConfigList="armyConfigList"
    ></map-preview>
  </div>
</template>

<script>
import { GetRoomListByPage, PlayerJoinRoom, CreateRoom } from "@/api";
import JoinRoom from "./JoinRoom.vue";
import MapPreview from "@frame/MapPreview.vue";
import dialogShow from "@/mixins/frame/dialogShow.js";
export default {
  mixins: [dialogShow],
  components: {
    JoinRoom,
    MapPreview,
  },
  props: {},
  data() {
    return {
      willChange: false,
      canJoinRoom: {},
      queryDataFunction: null,
      buttonList: [
        { name: "加入", action: this.clickJoinGameButton },
        { name: "预览", action: this.clickPreivewButton },
      ],
      titleButtonList: [
        { name: "新增", action: this.clickAddbutton },
        { name: "刷新", action: this.flushRoom },
      ],
      showItem: ["room_id", "room_name", "creat_time_show", "ready"],
      showTitle: ["房间号", "房间名字", "创建时间", "玩家"],
      createRoomButtons: [
        { name: "创建", action: this.clickCreateRoom },
        { name: "取消", action: this.clickCancelCreateRoom },
      ],
      addNewDialogShowModel: false,
      addNewRoomFormConfig: [
        {
          type: "input",
          key: "room_name",
          des: "房间名字",
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
      // this.flushRoom();
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
          this.setJoinRoomShow();
          this.showJoinRoom = true;
          this.$appHelper.infoMsg("加入成功");
          this.$appHelper.setLoading();
        })
        .catch((error) => {
          console.error(error);
          this.$appHelper.infoMsg("加入失败");
          this.$refs.mainDiaglog.flushData();
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
    setJoinRoomShow(){
      this.$refs.joinRoom.armyConfigList = JSON.parse(JSON.stringify(this.armyConfigList));
      this.$refs.joinRoom.roomOwner = this.roomOwner;
    },
    clickCreateRoom() {
      console.log("创建房间");
      let formData = this.$refs.addNewRoomDialog.getFormData();
      console.log(formData);
      if (!formData) {
        this.$appHelper.infoMsg("创建房间数据不完整");
        return;
      }
      if (!formData) {
        this.$appHelper.infoMsg("创建房间数据不完整");
        return;
      }

      if (!formData.room_name) {
        this.$appHelper.infoMsg("房间名字不能为空");
        return;
      }

      if (!formData.init_map) {
        this.$appHelper.infoMsg("必须选择地图");
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
            this.setJoinRoomShow();
            let initSetting = this.$refs.joinRoom.initSetting(
              resp.res_val.room_id
            );
            initSetting.then((joinRoomPromise) => {
                this.showJoinRoom = true;
                console.log("joinRoomPromise result >>>", resp, joinRoomPromise);
                this.$appHelper.infoMsg("创建成功");
                this.$appHelper.setLoading();
              })
              .catch((error) => {
                this.$appHelper.infoMsg("加入房间失败");
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
    flushRoom(){
      if (this.$refs.mainDiaglog) {
        this.$refs.mainDiaglog.flushData();
      }
    }
  },
  computed: {},
  created() {
    window.RoomIndexVue = this;
    this.queryDataFunction = GetRoomListByPage;
    this.$eventBus.regist(this, "flushRoom", "flushRoom");
  },
  destroyed() {
    this.$eventBus.unRegist(this, "flushRoom");
  },
};
</script>

<style scoped>
</style>
