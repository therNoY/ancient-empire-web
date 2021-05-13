<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      title="模板管理"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      :tableConfig="tableConfig"
      :titleButtons="titleButtonList"
      :titleSwitchSelect="titleSwitchSelect"
      :initQueryDataGrid="initQueryDataFunction"
      :footerButtons="footerButtonList"
      :width="65"
      showSearch
      @titleSwtichSelectChange="swtichSelectChange"
      page
    >
    </ae-complex-dialog>
    <template-deatil
      ref="templateDeatil"
      v-model="showTempDetail"
      :templateDeatil="currentTemp"
      :model="model"
      @saveOrDel="flushData"
      @downLoadTemp="downLoadTemp"
    ></template-deatil>
  </div>
</template>

<script>
import PreviewUnitList from "@frame/PreviewUnitList.vue";
import {
  GetUserTemplate,
  GetUserDraftTemplate,
  GetUserAttentionTemp,
  GetDownloadAbleTemplate,
  DownloadTemplate,
} from "@/api";

import dialogShow from "@/mixins/frame/dialogShow.js";
import TemplateDeatil from "./TemplateDeatil.vue";

const showBindUnitRender = function (h, params) {
  return h(
    PreviewUnitList,
    { props: { unit_list: params.bind_uint_list, showNum: 15 } },
    ""
  );
};

export default {
  mixins: [dialogShow],
  components: { TemplateDeatil },
  props: {},
  data() {
    return {
      titleSwitchSelect: {
        type: "switchSelect",
        key: "queryType",
        default: "1",
        des: "",
        items: [
          { key: "1", value: "我的模板", query: GetUserTemplate },
          { key: "2", value: "我的下载", query: GetUserAttentionTemp },
          { key: "3", value: "世界模板", query: GetDownloadAbleTemplate },
        ],
      },
      showItem: [
        "template_name",
        showBindUnitRender,
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
        "模板名字",
        "单位预览",
        "作者",
        "版本",
        "更新时间",
        "下载次数",
        "总评价",
      ],
      tableConfig: {
        1: { style: { width: "20%" } },
      },
      titleButtonList: [{ name: "新建", action: this.clickAddButton }],
      showTempDetail: false,
      currentTemp: {},
      model: "myTemp",
      initQueryDataFunction: null,
    };
  },
  created() {
    this.initQueryDataFunction = GetUserTemplate;
    window.TemplateMangerVue = this;
  },
  methods: {
    clickAddButton() {
      let parms = {};
      this.$appHelper.setLoading();
      GetUserDraftTemplate(parms)
        .then((resp) => {
          if (resp.res_code == 0) {
            this.currentTemp = resp.res_val;
            this.model == "myTemp";
            this.showTempDetail = true;
          }
          this.$appHelper.setLoading();
        })
        .catch((error) => {
          this.$appHelper.setLoading();
        });
    },
    flushData() {
      this.$refs.aeDialog.flushData();
    },
    showDetail() {
      console.log("查看详情");
      this.currentTemp = JSON.parse(
        JSON.stringify(this.$refs.aeDialog.getDataGridSelect())
      );
      this.showTempDetail = true;
    },
    swtichSelectChange(value) {
      if (value == "1") {
        this.model = "myTemp";
      } else if (value == "2") {
        this.model = "myDownload";
      } else if (value == "3") {
        this.model = "download";
      }
    },
    delTemp() {
      console.log("删除模板");
      this.$refs.templateDeatil.delTemp(
        this.$refs.aeDialog.getDataGridSelect()
      );
    },

    downLoadTemp(downloadComment) {
      let args = {};
      args.template_id = this.$refs.aeDialog.getDataGridSelect().id;
      args.template_start = downloadComment.start;
      args.template_comment = downloadComment.comment;
      DownloadTemplate(args).then((resp) => {
        if (resp.res_code == 0) {
          this.$appHelper.infoMsg("下载成功");
          this.flushData();
        }
      });
    },
  },
  computed: {
    footerButtonList() {
      let footerButtonList = [];
      footerButtonList.push({ name: "详 情", action: this.showDetail });
      if (this.model == "myTemp") {
        footerButtonList.push({ name: "删 除", action: this.delTemp });
      } else if (this.model == "myDownload") {
        footerButtonList.push({ name: "删 除", action: this.delTemp });
      } else if (this.model == "download") {
        footerButtonList.push({
          name: "下 载",
          action: () =>
            this.$refs.templateDeatil.$refs.startComment.showComment(),
        });
      }
      return footerButtonList;
    },
  },
};
</script>

<style>
</style>
