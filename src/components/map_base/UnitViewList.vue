<!--军队集合-->
<template>
  <div>
    <unit-view

    style="position: absolute;"
      v-for="(unit, index) in units"
      :key="'UNIT_' + index"
      :unit="unit"
      :color="armyColor"
      :singo="singo"
      @unitOnClick="clickUnit(unit)"
    ></unit-view>
  </div>
</template>

<script>
import UnitView from "./UnitView";
import eventype from "../../manger/eventType";
export default {
  components: {
    UnitView,
  },
  props: ["units", "armyColor", "singo"],
  created() {},
  methods: {
    clickUnit(unit) {
      if (this.$appHelper.isPlayer(this)) {
        if (
          this.$store.getters.game.curr_color == this.armyColor &&
          !unit.done
        ) {
          // 点击了自己的可以行动的单位
          this.$appHelper.sendEvent(eventype.CLICK_ACTIVE_UNIT, {
            row: Math.round(unit.row),
            column: Math.round(unit.column),
          });
        } else {
          // 点击了其他的单位 或者已经行动过了
          this.$appHelper.sendEvent(eventype.CLICK_UN_ACTIVE_UNIT, {
            row: Math.round(unit.row),
            column: Math.round(unit.column),
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>