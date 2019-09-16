<template>
  <!--显示攻击瞄准的指针-->
  <div
    class="attackPoint"
    v-if="mapSt.mapStatus == 'willAttach' && mapSt.beAttachUnit.row"
    @click="unitAttach"
  >
    <img
      src="../../../assets/images/assist/cursor_03.png"
      :style="{top: attachTop(mapSt.beAttachUnit.row), left: attachLeft(mapSt.beAttachUnit.column)}"
      v-if="singo"
    />
    <img
      :style="{top: attachTop(mapSt.beAttachUnit.row), left: attachLeft(mapSt.beAttachUnit.column)}"
      src="../../../assets/images/assist/cursor_04.png"
      v-else
    />
  </div>
  <!--显示召唤的指针-->
  <div
    class="attackPoint"
    v-else-if="mapSt.mapStatus == 'willSummon' && mapSt.beSummonTomb.row"
    @click="summonUnit"
  >
    <img
      src="../../../assets/images/assist/cursor_03.png"
      :style="{top: attachTop(mapSt.beSummonTomb.row), left: attachLeft(mapSt.beSummonTomb.column)}"
      v-if="singo"
    />
    <img
      :style="{top: attachTop(mapSt.beSummonTomb.row), left: attachLeft(mapSt.beSummonTomb.column)}"
      src="../../../assets/images/assist/cursor_04.png"
      v-else
    />
  </div>
</template>

<script>
export default {
  props: ["singo", "mapSt", "mapDt"],
  computed: {
    // 计算出攻击图标的位置
    attachTop() {
      return function(row) {
        let top = (row - 1 - 0.3) * 24 + "px";
        return top;
      };
    },
    attachLeft() {
      return function(column) {
        let left = (column - 1 - 0.3) * 24 + "px";
        return left;
      };
    }
  },
  methods: {
    // 单位攻击
    unitAttach() {
      // 获取攻击事件的结果
      this.$store.dispatch("getAttachResult");
    },
    summonUnit() {
      this.$store.dispatch("getSummonResult");
    }
  }
};
</script>

<style lang="css" scoped>
.attackPoint img {
  position: absolute;
  cursor: pointer;
}
</style>