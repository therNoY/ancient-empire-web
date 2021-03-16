<template>
  <div>
    <ae-dialog
      ref="mainDiaglog"
      v-model="showModel"
      :showSearch="true"
      title="游戏大厅"
      :titleButtons="titleButtonList"
      :titleButtonClickAction="titleButtonClickAction"
      :footerButtons="buttonList"
      :footerButtonClickAction="footerButtonClickAction"
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
      :footerButtonClickAction="footerButtonClickAction"
    ></ae-dialog>
  </div>
</template>

<script>
import { GetRoomListByPage,PlayerJoinRoom,CreateRoom } from "@/api";
import dialogShow from "../../../mixins/frame/dialogShow.js";
import AeMessage from '../../frame/AeMessage.vue';
export default {
  mixins: [dialogShow],
  props: {},
  data() {
    return {
      willChange: false,
      canJoinRoom: {},
      queryDataFunction: null,
      buttonList: ["加入", "预览"],
      titleButtonList: ["新增"],
      showItem: ["room_name", "create_time"],
      showTitle: ["房间名字", "创建时间"],
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
          key: "map_id",
          des: "选择地图",
        },
      ],
    };
  },

  methods: {
    onDialogCreate() {
      console.log("页面创建");
      this.$refs.mainDiaglog.flushData();
    },
    onDialogDestroy() {
      console.log("页面销毁");
    },
    clickAddbutton() {
      console.log("点击新增");
      this.addNewDialogShowModel = true;
    },
    clickJoinGameButton() {
      console.log("加入游戏");
    },
    clickPreivewButton() {
      console.log("点击预览");
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

      if (!formData.map_id) {
        this.$message.info("必须选择地图");
        return;
      }
      let args = formData;
      this.$appHelper.setLoading();
      CreateRoom(args).then(resp=>{
        this.$appHelper.setLoading();
        if (resp.resp_code == 0) {
          console.log("创建房间成功");
          this.addNewDialogShowModel = false;
        } else {
          console.log("创建房间失败, 请稍后重试");
        }
      }).catch(error=>{
        this.$appHelper.setLoading();
      })
    },
    clickCancelCreateRoom() {
      console.log("取消创建房间");
    },
  },
  computed: {
    titleButtonClickAction() {
      let functionList = [];
      functionList.push(this.clickAddbutton);
      return functionList;
    },
    footerButtonClickAction() {
      let functionList = [];
      functionList.push(this.clickCreateRoom);
      functionList.push(this.clickCancelCreateRoom);
      return functionList;
    },
  },
  created() {
    window.RoomIndexVue = this;
    this.queryDataFunction = GetRoomListByPage;
  },
};
</script>

<style scoped>
</style>