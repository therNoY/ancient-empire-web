<!--单位多选-->
<template>
  <div id="unit-check-box">
    <ae-button
      class="addButton"
      :height="25"
      :size="0.5"
      :width="75"
      :disabled="disabled"
      @onClick="showAddAbleUnit"
      >添 加
    </ae-button>

    <div class="removeAbleUnitList">
      <div
        class="removeAbleUnit"
        v-for="(unit, index) in localUnitList"
        :key="index"
      >
        <click-point
          :disabled="disabled"
          @clickPoint="removeUnitFromList(unit, index)"
        >
          <unit class="unit" :unit_id="unit.id"></unit>
        </click-point>
      </div>
    </div>

    <unit-choose-list
      ref="unitChooseList"
      :dialog_title="dialog_title"
      :unit_list="addAbleUnitList"
      @clickUnit="addUnit"
    ></unit-choose-list>
  </div>
</template>

<script>
import { GetAddTempAbleUnit } from "@/api";
import Unit from "./Unit.vue";
import UnitChooseList from "./UnitChooseList.vue";
import ClickPoint from "../frame/ClickPoint.vue";
export default {
  components: {
    Unit,
    UnitChooseList,
    ClickPoint,
  },
  props: {
    template_id: {},
    dialog_title: {
      type: String,
      default: "添加单位",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "blue",
    },
    value: {
      type: Array,
    },
  },
  data() {
    return {
      removeList: {},
      localUnitList: [],
      addAbleUnitList: [],
    };
  },
  methods: {
    // 移除单位
    removeUnitFromList(unit, index) {
      this.localUnitList.splice(index, 1);
      this.$emit("input", this.localUnitList);
    },
    // 展示可以添加的模板
    showAddAbleUnit() {
      let args = {
        template_id: this.template_id,
        filter: this.localUnitList.map((unit) => unit.id),
      };
      GetAddTempAbleUnit(args).then((resp) => {
        if (resp && resp.res_code == 0) {
          this.$refs.unitChooseList.show = true;
          this.addAbleUnitList = resp.res_val;
        }
      });
    },
    addUnit(unit) {
      this.$refs.unitChooseList.show = false;
      this.localUnitList.push(unit);
      this.$emit("addUnit", unit);
      this.$emit("input", this.localUnitList);
    },
  },
  created() {
    this.localUnitList = this.value;
    window.UnitCheckboxVue = this;
  },
};
</script>

<style lang="scss">
#unit-check-box {
  float: left;
  width: 100%;

  .removeAbleUnitList {
    .removeAbleUnit {
      float: left;
      padding-top: 2%;
      padding-right: 13px;

      .unit {
        width: 30px;
        background-color: rgba(255, 255, 255, 0);
      }
    }
  }

  .addButton {
    float: left;
    padding-left: 1%;
    margin-top: 2%;
    width: 20%;
    height: 100%;
  }

  .selectOneUnit {
    float: left;
    width: 48px;
    height: 48px;
  }
}
</style>
