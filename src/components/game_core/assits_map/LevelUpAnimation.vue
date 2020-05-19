<template>
  <div>
    <!--升级-->
    <div class="level_up" v-if="mapStatus == 'levelUp'">
      <img
        src="../../../assets/images/assist/levelup.png"
        :style="{top: leveupTop(leveupImg.row), left: leveupLeft(leveupImg.column)}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props:["mapStatus", "leveupImg"],
  computed: {
    // 计算升级位置
    leveupTop() {
      return function(row) {
        let top = (row - 1) * 24 + "px";
        return top;
      };
    },
    leveupLeft() {
      return function(column) {
        let left = (column - 2) * 24 + "px";
        return left;
      };
    }
  }
};
</script>

<style lang="css" scoped>
.level_up img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
</style>