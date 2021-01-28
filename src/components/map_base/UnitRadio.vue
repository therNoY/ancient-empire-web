<!--
  单位单选组件
-->
<template>
  <div>
    <click-point :disabled="!edit_able" v-if="value"  @clickPoint="deleteUnit">
      <unit class="unit" :unit_id="value" :color="color"></unit>
    </click-point>
    <el-button style="margin-left: 10px" @click="chooseOtherUnit" icon="el-icon-edit-outline" circle></el-button>
    <unit-choose-list
      ref="unitChooseList"
      dialog_title="选择其他单位"
      :unit_list="unitList"
      @clickUnit="changeUnit"
    ></unit-choose-list>
  </div>
</template>

<script>
import ClickPoint from '../frame/ClickPoint.vue';
import Unit from "./Unit.vue";
import UnitChooseList from "./UnitChooseList.vue";
export default {
  components: { Unit, UnitChooseList, ClickPoint },
  props: {
    value: {},
    template_id: {},
    color: {
      type: String,
      default: "blue",
    },
    edit_able: {
      type: Boolean,
      default: true,
    },
    unitList:{
      type:Array,
    }
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
      this.$emit('input', unit.id)
      this.$emit("changeUnit", unit.id);
    },
    deleteUnit(){
       this.$emit('input', null)
    }
  },
  created() {
    window.UnitRadioVue = this;
  },
};
</script>

<style lang="scss" scope>
.unit {
  float: left;
  margin-top: 3px;
};
</style>