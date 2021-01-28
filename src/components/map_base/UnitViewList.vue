<!--军队集合-->
<template>
  <div>
    <unit-view
      style="position: absolute"
      v-for="(unit, index) in units"
      :key="'UNIT_' + index"
      :unit="unit"
      :color="armyColor"
      :singo="singo"
      @unitOnClick="unitOnClick"
    ></unit-view>
  </div>
</template>

<script>
import UnitView from "./UnitView";
export default {
  components: {
    UnitView,
  },
  props: ["units", "armyColor", "singo"],
  created() {},
  methods: {
    unitOnClick(unit) {
      unit.color = this.armyColor;
      this.$emit("unitOnClick", unit);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>