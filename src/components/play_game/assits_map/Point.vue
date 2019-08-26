<template>
  <!--指针框 -->
  <div class="cursor_normal">
    <img
      src="../../../assets/images/assist/cursor_00.png"
      :style="{top: positionRow(mapSt.currentPoint), left: positionColumn(mapSt.currentPoint)}"
      v-if="singo"
    />
    <img
      src="../../../assets/images/assist/cursor_01.png"
      :style="{top: positionRow(mapSt.currentPoint), left: positionColumn(mapSt.currentPoint)}"
      v-else
    />
  </div>
</template>

<script>
export default {
  props: ["singo", "mapSt"],
  computed: {
    positionRow() {
      return function(currentPoint) {
        return (currentPoint.row - 1) * 24 + "px";
      };
    },
    positionColumn() {
      return function(currentPoint) {
        return (currentPoint.column - 1) * 24 + "px";
      };
    }
  },
};
</script>

<style lang="css" scoped>
.cursor_normal img{
  position: absolute;
}
</style>