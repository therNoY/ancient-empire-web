<!--包含单位的移动区域和攻击区域-->
<template>
  <div>
    <!--可移动区域-->
    <div v-if="mapSt.showMoveArea" class="move_area" v-for="moveArea in mapDt.moveAreas">
      <img
        src="../../../assets/images/assist/alpha.png"
        @mouseover="showAimArea(moveArea.row, moveArea.column)"
        :style="{top: position(1, moveArea.row), left: position(2, moveArea.column)}"
      />
    </div>
    <!--攻击范围区域-->
    <!-- <div v-if="mapSt.showAttachArea" class="attach_area" v-for="attachArea in attachAreas">
      <img
        src="../../../assets/images/assist/alpha.png"
        @mouseover="showAimArea(attachArea.row, attachArea.column)"
        :style="{top: position(1, attachArea.row), left: position(1, attachArea.column)}"
      /> -->
    </div>
  </div>
</template>

<script>

export default {
  props: ["mapSt", "mapDt"],
  computed: {
    position() {
      return function(num, row) {
        return (row - num) * 24 + "px";
      };
    },
  },
  methods: {
    showAimArea() {
      console.log(">>>>>>>>>>>>>...");
    }
  },
};
</script>

<style lang="css" scoped>
</style>