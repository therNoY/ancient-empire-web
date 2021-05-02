<!--
  穿梭框
-->
<template>
  <div class="transfer_body">
    <div class="transfer_left">
      <div>
        {{ addAbleTitle }}
      </div>
      <div v-if="dataList.length > 0">
        <click-point
          v-for="(item, index) in addAbleList"
          :key="index"
          value="+"
          class="transfer_item"
          @clickPoint="addValue(item, index)"
          :disabled="disabled"
        >
          <el-tooltip
            v-if="showTipKey"
            :content="item[showTipKey]"
            placement="top"
            effect="light"
          >
            <el-tag effect="dark">{{ showKey ? item[showKey] : item }}</el-tag>
          </el-tooltip>
          <el-tag v-else effect="dark">{{
            showKey ? item[showKey] : item
          }}</el-tag>
        </click-point>
      </div>
    </div>
    <div class="transfer_right">
      <div>
        {{ valueTitle }}
      </div>
      <div v-if="value.length > 0">
        <click-point
          v-for="(item, index) in value"
          class="transfer_item"
          :disabled="disabled"
          :key="index"
          @clickPoint="removeValue(item, index)"
        >
          <el-tooltip
            v-if="showTipKey"
            :content="item[showTipKey]"
            placement="top"
            effect="light"
          >
            <el-tag type="success" effect="dark">{{
              showKey ? item[showKey] : item
            }}</el-tag>
          </el-tooltip>
          <el-tag v-else type="success" effect="dark">{{
            showKey ? item[showKey] : item
          }}</el-tag>
        </click-point>
      </div>
    </div>
  </div>
</template>

<script>
import ClickPoint from "./ClickPoint.vue";
export default {
  components: { ClickPoint },
  props: {
    value: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    addAbleTitle: {
      type: String,
      default: "可选择列表",
    },
    valueTitle: {
      type: String,
      default: "当前列表",
    },
    /** 展示内容key 不指定默认全部展示 */
    showKey: {
      type: String,
    },
    /**展示的提示 */
    showTipKey: {
      type: String,
    },
    /** 比较指定key */
    valueKey: {
      type: String,
    },
    dataList: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    addAbleList() {
      return this.dataList.filter((item) => {
        for (let v of this.value) {
          if (this.valueKey) {
            if (v[this.valueKey] == item[this.valueKey]) {
              return false;
            }
          } else {
            if (v == item) {
              return false;
            }
          }
        }
        return true;
      });
    },
  },
  methods: {
    addValue(item, index) {
      this.value.push(item);
    },
    removeValue(item, index) {
      this.value.splice(index, 1);
    },
  },
  created() {
    window.TransferVue = this;
  },
};
</script>

<style lang="scss" scoped>
.transfer_body {
  width: 100%;
  float: left;
  font-size: 12px;
  .transfer_left {
    width: 45%;
    float: left;
    color: white;
  }
  .transfer_right {
    width: 45%;
    float: left;
    margin-left: 5%;
    color: white;
  }
  .transfer_item {
    float: left;
    margin-left: 5%;
    margin-top: 2%;
  }
}
</style>