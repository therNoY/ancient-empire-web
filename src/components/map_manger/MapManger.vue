<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      title="地图管理"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      :titleSwitchSelect="titleSwitchSelect"
      :initQueryDataGrid="initQueryDataFunction"
      :footerButtons="footerButtonList"
      :width="65"
      showSearch
      @titleSwitchSelectChange="switchSelectChange"
      page
    >
    </ae-complex-dialog>

    <template-detail
      ref="TemplateDetail"
      v-model="showTempDetail"
      :TemplateDetail="TemplateDetail"
      model="no"
    ></template-detail>

    <map-preview v-model="showMapDetail" :mapId="currentMap.map_id">
    </map-preview>

    <start-comment ref="startComment" @ok="handleDownload" />
  </div>
</template>

<script>
import {
  GetUserMapList,
  DownloadMap,
  DelDownloadMap,
  DelUserMap,
  GetUserDownloadMap,
  ChangeBaseInfo,
  GetWorldMapList,
  UpdateMapVersion,
} from "@/api";
import StartComment from "../frame/StartComment.vue";
import dialogShow from "@/mixins/frame/dialogShow.js";
import TemplateDetail from "../template_mange/TemplateDetail.vue";
import MapPreview from "@frame/MapPreview.vue";

export default {
  mixins: [dialogShow],
  components: {
    TemplateDetail,
    MapPreview,
    StartComment,
  },
  props: {},
  data() {
    return {
      titleSwitchSelect: {
        type: "switchSelect",
        key: "queryType",
        default: "1",
        des: "",
        items: [
          { key: "1", value: "我的地图", query: GetUserMapList },
          { key: "2", value: "我的下载", query: GetUserDownloadMap },
          { key: "3", value: "世界地图", query: GetWorldMapList },
        ],
      },
      showItem: [
        "map_name",
        "template_name",
        "create_user_name",
        (h, p) => {
          if (p.max_version && p.max_version > p.version) {
            return h(
              "b",
              {},
              "V" + p.version + "(可更新至V" + p.max_version + ")"
            );
          } else if (p.status == "0") {
            return h("div", {}, "V" + p.version + "(草稿版本)");
          } else {
            return h("div", {}, "V" + p.version + "(最新版本)");
          }
        },
        "update_time",
        "down_load_count",
        "start_count",
      ],
      showTitle: [
        "地图名称",
        "使用模板",
        "作者",
        "版本",
        "更新时间",
        "下载次数",
        "总评价",
      ],
      showTempDetail: false,
      TemplateDetail: {},
      showMapDetail: false,
      currentMap: {},
      model: "myMap",
      initQueryDataFunction: null,
    };
  },
  created() {
    this.initQueryDataFunction = GetUserMapList;
    window.MapManger = this;
  },
  methods: {
    handleDownload(commend) {
      let map = this.$refs.aeDialog.getDataGridSelect();
      let args = Object.assign(map, {});
      args.map_start = commend.start;
      args.map_comment = commend.comment;
      this.$appHelper.setLoading();
      DownloadMap(args)
        .then((resp) => {
          if (resp.res_code == "0") {
            this.$appHelper.successMsg("下载成功");
            this.flushData();
          }
          this.$appHelper.setLoading();
        })
        .catch((err) => {
          this.$appHelper.setLoading();
        });
    },
    flushData() {
      this.$refs.aeDialog.flushData();
    },
    previewMap() {
      this.currentMap = this.$refs.aeDialog.getDataGridSelect();
      this.showMapDetail = true;
    },
    switchSelectChange(value) {
      if (value == "1") {
        this.model = "myMap";
      } else if (value == "2") {
        this.model = "myDownload";
      } else if (value == "3") {
        this.model = "download";
      }
    },
    goEditMap() {
      this.currentMap = this.$refs.aeDialog.getDataGridSelect();
      const mapId = this.currentMap.map_id;
      this.$router.push("/mapEdit/" + mapId);
    },
    delUserMap() {
      console.log("删除地图");
      let userMap = this.$refs.aeDialog.getDataGridSelect();
      let _this = this;
      this.$appHelper.showTip("确定要删除" + userMap.map_name + "么？", () => {
        if (_this.model == "myMap") {
          DelUserMap(userMap.uuid).then((resp) => {
            _this.$appHelper.infoMsg("删除成功");
            _this.flushData();
          });
        } else if (_this.model == "myDownload") {
          let args = {};
          args.map_id = userMap.uuid;
          DelDownloadMap(args).then((resp) => {
            _this.$appHelper.infoMsg("移除成功");
            _this.flushData();
          });
        }
      });
    },
    updateMapVersion() {
      let userMap = this.$refs.aeDialog.getDataGridSelect();
      if (userMap.max_version && userMap.max_version > userMap.version) {
        this.$appHelper.setLoading();
        let args = { map_id: userMap.map_id };
        UpdateMapVersion(args)
          .then((resp) => {
            if (resp.res_code == "0") {
              this.$appHelper.successMsg("下载成功");
              this.flushData();
            }
            this.$appHelper.setLoading();
          })
          .catch((error) => {
            this.$appHelper.setLoading();
          });
      } else {
        this.$appHelper.warningMsg("已经是最新版本");
      }
    },
  },
  computed: {
    footerButtonList() {
      let footerButtonList = [];
      footerButtonList.push({ name: "预 览", action: this.previewMap });
      if (this.model == "myMap") {
        footerButtonList.push({
          name: "修 改",
          action: this.goEditMap,
        });
        footerButtonList.push({ name: "删 除", action: this.delUserMap });
      } else if (this.model == "myDownload") {
        footerButtonList.push({ name: "更 新", action: this.updateMapVersion });
        footerButtonList.push({ name: "删 除", action: this.delUserMap });
      } else if (this.model == "download") {
        footerButtonList.push({
          name: "下 载",
          action: () => this.$refs.startComment.showComment(),
        });
      }
      return footerButtonList;
    },
  },
};
</script>

<style>
</style>
