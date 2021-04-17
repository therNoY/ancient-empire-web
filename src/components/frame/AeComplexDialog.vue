<!--继承了基础功能的弹框-->
<template>
  <ae-base-dialog
    :value="value"
    :closeTip="closeTip"
    :width="width"
    :title="title"
    @open="open"
    @close="close"
  >
    <div class="ae-dialog-body-title">
      <ae-button-list
        v-if="titleButtons"
        :style="bodyTitleButtonStyle"
        :buttonList="titleButtons.map(a=>a.name)"
        :clickAction="titleButtons.map(a=>a.action)"
      ></ae-button-list>
      <ae-switch-select
        v-if="titleSwitchSelect"
        ref="titleSwitchSelect"
        :style="bodySwitchStyle"
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
          :count="pageCount"
          @onPageNowChange="onPageNowChange"
        ></ae-data-grid>
      </div>
      <div class="main-body" v-else-if="showModel == 'showForm'">
        <ae-form ref="aeForm" :formConfig="formConfig"></ae-form>
      </div>
    </section>

    <div class="ae-dialog-popup-footer">
      <ae-button-list
        v-if="footerButtons"
        :buttonList="footerButtons.map(a=>a.name)"
        :clickAction="footerButtons.map(a=>a.action)"
      ></ae-button-list>
    </div>
  </ae-base-dialog>
</template>

<script>
import AeBaseDialog from "./AeBaseDialog.vue";
import AeButtonList from "./AeButtonList.vue";
import AeDataGrid from "./AeDataGrid.vue";
import AeForm from "./AeForm.vue";
import AeSwitchSelect from "./AeSwitchSelect.vue";
export default {
  components: {
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
    initQueryDataGrid: {
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
    formConfig: {
      type: Array,
    },
    titleSwitchSelect: {
      type: Object,
      default: null,
    },
    closeTip: {
      type: String,
    },
    showCloseTip: {
      type: Boolean,
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
      queryDataGrid: null,
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
      console.log("查询");
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
    open(){
      console.log("初始化查询");
      if (!this.titleSwitchSelect) {
        this.flushData();
      }
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
    getFormData() {
      if (this.$refs.aeForm && this.$refs.aeForm.formData) {
        return this.$refs.aeForm.formData;
      }
      return null;
    },
  },
  created() {
    window.AeDialogVue = this;
    this.queryDataGrid = this.initQueryDataGrid;
    if (this.queryDataGrid) {
      this.showModel = "dataGrid";
    } else if (this.formConfig && this.formConfig.length > 0) {
      this.showModel = "showForm";
    }
  },
  computed: {
    bodyTitleButtonStyle() {
      if (this.showSearch || this.titleSwitchSelect) {
        if (this.showSearch && !this.titleSwitchSelect) {
          return {
            width: "40%",
          };
        } else if (!this.showSearch && this.titleSwitchSelect) {
          return {
            width: "20%",
          };
        } else {
          return {
            width: "10%",
          };
        }
      } else {
        return {
          width: "50%",
        };
      }
    },
    bodySwitchStyle() {
      return {
        width: "80%",
      };
    },
    bodyTitleSearchStyle() {
      if (this.titleButtons && this.titleButtons.length > 0) {
        return {
          width: "30%",
        };
      } else {
        return {
          width: "30%",
        };
      }
    },
  },
  watch: {
    titleSwitchSelectValue(v) {
      for (const select of this.titleSwitchSelect.items) {
        if (
          select.key == v &&
          select.query &&
          select.query instanceof Function
        ) {
          this.queryDataGrid = select.query;
          this.flushData();
          break;
        }
      }
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
  margin-top: 10px;
  margin-bottom: 10px;
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