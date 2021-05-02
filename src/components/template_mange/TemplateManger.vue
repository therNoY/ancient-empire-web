<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      title="模板管理"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      :titleButtons="titleButtonList"
      :titleSwitchSelect="titleSwitchSelect"
      :initQueryDataGrid="initQueryDataFunction"
      :footerButtons="footerButtonList"
      :width="55"
      @titleSwtichSelectChange="swtichSelectChange"
      page
    >
    </ae-complex-dialog>
    <template-deatil
      v-model="showTempDetail"
      :templateDeatil="currentTemp"
      :model="model"
      @saveOrDel="flushData"
    ></template-deatil>
  </div>
</template>

<script>
import AeBaseDialog from "../frame/AeBaseDialog.vue";
import PreviewUnitList from "../map_base/PreviewUnitList.vue";
import {
  GetUserTemplate,
  GetUserDraftTemplate,
  GetUserAttentionTemp,
  GetDownloadAbleTemplate,
} from "@/api";

import dialogShow from "../../mixins/frame/dialogShow.js";
import TemplateDeatil from "./TemplateDeatil.vue";

const showBindUnitRender = function (h, params) {
  console.log(params);
  return h(
    PreviewUnitList,
    { props: { unit_list: params.bind_uint_list, showNum: 15 } },
    ""
  );
};

export default {
  mixins: [dialogShow],
  components: { AeBaseDialog, TemplateDeatil },
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
        "link_num",
        "count_start",
      ],
      showTitle: ["模板名字", "单位预览", "下载次数", "总评价"],
      footerButtonList: [
        { name: "刷新", action: () => this.$refs.aeDialog.flushData() },
        { name: "详情", action: this.showDetail },
      ],
      titleButtonList: [{ name: "新建", action: this.clickButton }],
      showTempDetail: false,
      currentTemp: {},
      model: "myTemp",
      initQueryDataFunction:null,
    };
  },
  created() {
    this.initQueryDataFunction = GetUserTemplate
    window.TemplateMangerVue = this;
  },
  methods: {
    clickButton() {
      let parms = {};
      GetUserDraftTemplate(parms).then((resp) => {
        if (resp.res_code == 0) {
          this.currentTemp = resp.res_val;
          this.showTempDetail = true;
        }
      });
    },
    flushData() {
      this.$refs.aeDialog.flushData();
    },
    showDetail() {
      console.log("查看详情");
      this.currentTemp = JSON.parse(JSON.stringify(this.$refs.aeDialog.getDataGridSelect()));
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
  },
  computed: {},
};
</script>

<style>
</style>