<!--
  单位单选组件
-->
<template>
  <div class="unit-radio">
    <ae-button
      class="unit-radio-button"
      :width="75"
      :height="25"
      :size="0.5"
      @onClick="chooseOtherUnit"
      :disabled="!editAble"
      >选 择</ae-button
    >

    <div class="unit">
      <ae-click-point :disabled="!editAble" v-if="value" @clickPoint="deleteUnit">
        <unit :unit_id="value" :color="color"></unit>
      </ae-click-point>
    </div>

    <unit-choose-list
      ref="unitChooseList"
      dialog_title="选择其他单位"
      :unit_list="unitList"
      @clickUnit="changeUnit"
    ></unit-choose-list>
  </div>
</template>

<script>
import Unit from "./Unit.vue";
import UnitChooseList from "./UnitChooseList.vue";
export default {
  components: { Unit, UnitChooseList },
  props: {
    value: {},
    color: {
      type: String,
      default: "blue",
    },
    editAble: {
      type: Boolean,
      default: true,
    },
    unitList: {
      type: Array,
    },
  },
  data() {
    return {
      chooseAbleUnit: [],
    };
  },

  methods: {
    chooseOtherUnit() {
      this.$refs.unitChooseList.show = true;
    },
    changeUnit(unit) {
      this.$refs.unitChooseList.show = false;
      this.$emit("input", unit.id);
      this.$emit("changeUnit", unit.id);
    },
    deleteUnit() {
      this.$emit("input", null);
    },
  },
  created() {
    window.UnitRadioVue = this;
  },
};
</script>

<style lang="scss" scope>
.unit-radio {
  width: 100%;
  float: left;
  text-align: center;
  .unit {
    float: left;
    padding-top: 3%;
  }
  .unit-radio-button {
    float: left;
    padding-left: 1%;
    margin-top: 2%;
    width: 20%;
  }
}
</style>
