<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      title="选择模板"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      :titleSwitchSelect="titleSwitchSelect"
      :initQueryDataGrid="initQueryDataFunction"
      :footerButtons="footerButtonList"
      :tableConfig="tableConfig"
      :width="40"
      @titleSwitchSelectChange="switchSelectChange"
      page
    >
    </ae-complex-dialog>
    <template-detail
      v-model="showTempDetail"
      :TemplateDetail="currentTemp"
      model="no"
    ></template-detail>
  </div>
</template>

<script>
import PreviewUnitList from "@frame/PreviewUnitList.vue";
import {
  GetUserTemplate,
  GetUserAttentionTemp,
} from "@/api";

import dialogShow from "@/mixins/frame/dialogShow.js";
import TemplateDetail from "./TemplateDetail.vue";

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
  components: { TemplateDetail },
  props: {
  },
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
        ],
      },
      showItem: [
        "template_name",
        showBindUnitRender,
      ],
      showTitle: ["模板名字", "单位预览"],
      footerButtonList: [
        { name: "确定", action: this.selectTemp },
        { name: "详情", action: this.showDetail },
      ],
      tableConfig: {
        1: { style: { width: "50%" } },
      },
      showTempDetail: false,
      currentTemp: {},
      initQueryDataFunction:null,

    };
  },
  created() {
    this.initQueryDataFunction = GetUserTemplate
    window.TemplateSelet = this;
  },
  methods: {
    showDetail() {
      console.log("查看详情");
      this.currentTemp = JSON.parse(JSON.stringify(this.$refs.aeDialog.getDataGridSelect()));
      this.showTempDetail = true;
    },
    selectTemp(){
      this.currentTemp = this.$refs.aeDialog.getDataGridSelect();
      this.$emit("onSelect", this.currentTemp.id, this.currentTemp.template_name);
      this.$emit("input", false)
    },
    switchSelectChange(value) {
    },
  },
  computed: {},
};
</script>

<style>
</style>
