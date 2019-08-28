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

      <!--移动路线-->
      <!-- <div class="movePath" v-for="(pathPoint,index) in pathPoints">
        <div
          v-if="index < pathPoints.length - 1"
          :style="{top: movePathTop(pathPoint, pathPoints[index+1]), left: movePathLeft(pathPoint, pathPoints[index+1]) ,width: movePathWidth(pathPoint, pathPoints[index+1]), height: movePathHeight(pathPoint, pathPoints[index+1])}"
        ></div>
      </div> -->

      <!--目的地指针 只在移动区域显示的时候才会显示-->
      <!-- <div class="aimPoint" @click="goAimPoint">
        <img
          v-show="showMoveArea"
          src="../../../assets/images/assist/cursor_target.png"
          :style="{top: position(1, currentPoint.row), left: position(1, currentPoint.column)}"
        />
      </div> -->
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
    showAimArea(row, column) {
      return;
      let aimPoint = {};
      aimPoint.row = row;
      aimPoint.column = column;
      let moveInfo = {};
      moveInfo.aimPoint = aimPoint;
      moveInfo.positions = this.$store.mapDt.moveAreas;
      moveInfo.currentPoint = this.$store.mapDt.currentPoint;
      this.$store.dispatch("getMovePath", moveInfo);
    }
  },
};
</script>

<style lang="css" scoped>
.move_area img{
  position: absolute;
  clip: rect(0px, 48px, 24px, 24px);
}
</style>