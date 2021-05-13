<template>
  <div>
    <unit-view-list
      v-for="(army, index) in armys"
      :key="'ARMY_' + index"
      :units="army.units"
      :armyColor="army.color"
      @unitOnClick="clickUnit"
      :singo="singo"
    ></unit-view-list>
  </div>
</template>

<script>
import UnitViewList from "./UnitViewList.vue";
export default {
  props: ["armys", "singo"],
  components: {
    UnitViewList,
  },
  computed: {},
  methods: {
    clickUnit(unit) {
      this.$emit("unitOnClick", unit);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>