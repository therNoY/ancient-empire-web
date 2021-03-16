<template>
  <ae-base-dialog :value="value" :width="width" :title="title" @close="close">
    <div class="ae-dialog-body-title">
      <ae-button-list
        v-if="titleButtons"
        :style="bodyTitleButtonStyle"
        :buttonList="titleButtons"
        @onClick="onTitleButtonClick"
      ></ae-button-list>
      <ae-switch-select
        v-if="titleSwitchSelect"
        ref="titleSwitchSelect"
        style="width: 80%"
        v-model="titleSwitchSelectValue"
        :default="titleSwitchSelect.default"
        :items="titleSwitchSelect.items"
        :label="titleSwitchSelect.des"
        :form="titleSwitchSelect"
      ></ae-switch-select>
      <ae-input
        v-model="queryCondition"
        style="float: right"
        v-if="showSearch"
        :style="bodyTitleSearchStyle"
        @onChange="flushData()"
        placeholder=" 搜索"
      ></ae-input>
    </div>

    <section class="ae-dialog-popup-body">
      <div class="main-body" v-if="showModel == 'dataGrid'">
        <ae-data-grid
          ref="dataGrid"
          :data="dataGridSet"
          :showItem="showItem"
          :showTitle="showTitle"
          :page="page"
          :pageCount="getPageCount"
          @onPageNowChange="onPageNowChange"
        ></ae-data-grid>
      </div>
      <div class="main-body" v-if="showModel == 'showForm'">
        <ae-form ref="aeForm" :formConfig="formConfig"></ae-form>
      </div>
    </section>

    <div class="ae-dialog-popup-footer">
      <ae-button-list
        v-if="footerButtons"
        :buttonList="footerButtons"
        @onClick="onFooterButtonClick"
      ></ae-button-list>
    </div>
  </ae-base-dialog>
</template>

<script>
import AeBaseDialog from "./AeBaseDialog.vue";
import AeButtonList from "./AeButtonList.vue";
import AeDataGrid from "./AeDataGrid.vue";
import AeForm from "./AeForm.vue";
import AeInput from "./AeInput.vue";
import AeSwitchSelect from "./AeSwitchSelect.vue";
export default {
  components: {
    AeInput,
    AeButtonList,
    AeDataGrid,
    AeForm,
    AeSwitchSelect,
    AeBaseDialog,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 42,
    },
    title: {
      type: String,
      default: "",
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    titleButtons: {
      type: Array,
      defult: [],
    },
    footerButtons: {
      type: Array,
      defult: [],
    },
    queryDataGrid: {
      type: Function,
    },
    showTitle: {
      type: Array,
    },
    showItem: {
      type: Array,
      defult: [],
    },
    page: {
      type: Boolean,
      default: false,
    },
    titleButtonClickAction: {
      type: Array,
      defult: [],
    },
    footerButtonClickAction: {
      type: Array,
      defult: [],
    },
    formConfig: {
      type: Array,
    },
    titleSwitchSelect: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      queryCondition: "",
      showModel: "", // 展示模式 可以传数据进来
      dataGridSet: [],
      pageInfo: {
        pageStart: 1,
        pageSize: 10,
      },
      pageCount: 0,
      titleSwitchSelectValue: "",
    };
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    flushData() {
      let queryInfo = {};
      queryInfo.condition = this.queryCondition;
      queryInfo.page_start = this.pageInfo.pageStart;
      queryInfo.page_size = this.pageInfo.pageSize;
      let _this = this;
      return new Promise((resove, reject) => {
        if (!_this.queryDataGrid) {
          reject(false);
          return;
        }
        _this.$appHelper.setLoading();
        _this
          .queryDataGrid(queryInfo)
          .then((resp) => {
            if (resp.res_code == 0) {
              if (_this.page) {
                _this.dataGridSet = resp.res_val.data;
                _this.pageCount = resp.res_val.page_count;
              } else {
                _this.dataGridSet = resp.res_val;
              }

              resove(resp.res_val.data);
            } else {
              reject(false);
            }
            _this.$appHelper.setLoading();
          })
          .catch((error) => {
            _this.$appHelper.setLoading();
          });
      });
    },
    getDataGridSelect() {
      if (this.$refs.dataGrid) {
        return this.$refs.dataGrid.getSelect();
      }
    },
    onPageNowChange(pageNow) {
      this.pageInfo.pageStart = pageNow;
      this.flushData();
    },
    onTitleButtonClick(index) {
      if (
        this.titleButtonClickAction &&
        this.titleButtonClickAction.length > index
      ) {
        let fun = this.titleButtonClickAction[index];
        if (fun && fun instanceof Function) {
          fun();
        }
      }
    },
    onFooterButtonClick(index) {
      if (
        this.footerButtonClickAction &&
        this.footerButtonClickAction.length > index
      ) {
        let fun = this.footerButtonClickAction[index];
        if (fun && fun instanceof Function) {
          fun();
        }
      }
    },
    getFormData(){
      if (this.$refs.aeForm && this.$refs.aeForm.formData) {
        return this.$refs.aeForm.formData;
      }
      return null;
    }
  },
  created() {
    window.AeDialogVue = this;
    if (this.queryDataGrid) {
      this.showModel = "dataGrid";
    } else if (this.formConfig && this.formConfig.length > 0) {
      this.showModel = "showForm";
    }
  },
  computed: {
    bodyTitleButtonStyle() {
      if (this.showSearch) {
        return {
          width: "30%",
        };
      } else {
        return {
          width: "100%",
        };
      }
    },
    bodyTitleSearchStyle() {
      if (this.titleButtons && this.titleButtons.length > 0) {
        return {
          width: "50%",
        };
      } else {
        return {
          width: "80%",
        };
      }
    },
    getPageCount() {
      if (this.pageCount % this.pageInfo.pageSize == 0) {
        return this.pageCount / this.pageInfo;
      } else {
        return Number.parseInt(this.pageCount / this.pageInfo.pageSize) + 1;
      }
    },
  },
  watch: {
    titleSwitchSelectValue(v) {
      this.$emit("titleSwtichSelectChange", v);
    },
  },
};
</script>

<style lang="scss" scope>
.ae-dialog-popup-body {
  color: rgb(255, 255, 255);
  font-size: 17px;
  font-weight: 530;
  -webkit-text-stroke: 0.4px #000000;
}
.ae-dialog-body-title {
  width: 100%;
  float: left;
  margin-top: 3%;
  margin-bottom: 2%;
}
.main-body {
  float: left;
  width: 100%;
}
.ae-dialog-popup-footer {
  margin-bottom: 2%;
}
.info_but {
  float: right;
  margin-right: 20%;
  margin-bottom: 10px;
  height: 30px;
  width: 20%;
  color: rgb(255, 255, 255);
  font-size: 16px;
  cursor: pointer;
  -webkit-text-stroke: 0.4px #000000;
  background-color: #5a5c59;
  border-top: 2px #818181 solid;
  border-left: 2px #818181 solid;
  border-right: 2px #494949 solid;
  border-bottom: 2px #494949 solid;
}
</style>