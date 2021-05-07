<!-- 包含tab分页的form -->
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(config, tab) in tabFormConfig"
        :key="tab"
        :label="tab"
        :name="tab"
      >
        <ae-form
          ref="baseForm"
          :dataObj="dataObj"
          :singo="singo"
          :templateId="templateId"
          :edit="edit"
          :formConfig="config"
        />
      </el-tab-pane>
      <!--扩展插槽-->
      <slot></slot>
    </el-tabs>
  </div>
</template>

<script>
import AeForm from "../frame/AeForm.vue";

export default {
  components: {
    AeForm,
  },
  props: {
    formConfig: {
      type: Array,
    },
    edit: {
      type: Boolean,
      default: true,
    },
    dataObj: {
      type: Object,
      default: null,
    },
    closeBind: {
      type: Boolean,
      default: false,
    },
    singo: {
      type: Number,
      default: 0,
    },
    templateId: {},
    defaultActiveName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      tabFormConfig: {},
      activeName: "",
    };
  },
  methods:{
    getFormData(){
      let res = {};
      if (this.$refs.baseForm && this.$refs.baseForm.length > 0) {
        for(let formComp of this.$refs.baseForm) {
          res = Object.assign(res, formComp.getFormData());
        }
      }
      return res;
    }
  },
  created() {
    this.activeName = this.defaultActiveName;
    let tabFormConfig = {};
    for (let config of this.formConfig) {
      if (!config.tab) {
        config.tab = "";
      }
      if (!tabFormConfig[config.tab]) {
        tabFormConfig[config.tab] = [];
      }
      if (!this.activeName) {
        this.activeName = config.tab;
      }
      tabFormConfig[config.tab].push(config);
    }

    this.tabFormConfig = tabFormConfig;
    window.TabFormVue = this;
  },
};
</script>

<style>
</style>