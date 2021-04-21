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
      :width="40"
      @titleSwtichSelectChange="swtichSelectChange"
      page
    >
    </ae-complex-dialog>
    <template-deatil
      v-model="showTempDetail"
      :templateDeatil="currentTemp"
      model="no"
    ></template-deatil>
  </div>
</template>

<script>
import AeBaseDialog from "../frame/AeBaseDialog.vue";
import AeSwitchSelect from "../frame/AeSwitchSelect.vue";
import PreviewUnitList from "../map_base/PreviewUnitList.vue";
import {
  GetUserTemplate,
  GetUserDraftTemplate,
  GetUserAttentionTemp,
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
  components: { AeBaseDialog, AeSwitchSelect, TemplateDeatil },
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
      this.$emit("onSelect", this.currentTemp.id);
      this.$emit("input", false)
    },
    swtichSelectChange(value) {
    },
  },
  computed: {},
};
</script>

<style>
</style>