<!--包含单位的移动区域和攻击区域-->
<template>
  <div>
    <!--可移动区域-->
    <div
      v-if="mapSt.mapStatus == 'showMoveArea'  || mapSt.mapStatus == 'secendMove'"
      class="move_area"
      v-for="moveArea in mapDt.moveAreas"
    >
      <img
        src="../../../assets/images/assist/alpha.png"
        @click="showAimArea(moveArea.row, moveArea.column)"
        :style="{top: $appHelper.getPosition(moveArea.row), left: $appHelper.getPosition(moveArea.column, 2)}"
      />
    </div>
    <!--移动路线-->
    <div
      class="movePath"
      v-if="mapSt.mapStatus == 'showMoveArea' || mapSt.mapStatus == 'secendMove'"
      v-for="(pathPoint,index) in mapDt.pathPoints"
    >
      <div
        v-if="index < mapDt.pathPoints.length - 1"
        :style="{top: movePathTop(pathPoint, mapDt.pathPoints[index+1]), left: movePathLeft(pathPoint, mapDt.pathPoints[index+1]) ,width: movePathWidth(pathPoint, mapDt.pathPoints[index+1]), height: movePathHeight(pathPoint, mapDt.pathPoints[index+1])}"
      ></div>
    </div>
    <!--攻击范围区域-->
    <div
      v-if="mapSt.mapStatus == 'willAttach' || mapSt.mapStatus == 'willSummon'"
      class="attach_area"
      v-for="attachArea in mapDt.attachArea"
    >
      <img
        src="../../../assets/images/assist/alpha.png"
        :style="{top: $appHelper.getPosition(attachArea.row), left: $appHelper.getPosition(attachArea.column)}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["mapSt", "mapDt"],
  computed: {
    // 根据 得到最短距离需要拐弯的几个点 画出一条红线
    movePathTop() {
      return function(point, point2) {
        if (point.row <= point2.row) {
          return (point.row - 1) * 24 + 8 + "px";
        } else {
          return (point2.row - 1) * 24 + 8 + "px";
        }
      };
    },
    movePathLeft() {
      return function(point, point2) {
        if (point.column < point2.column) {
          return (point.column - 1) * 24 + 8 + "px";
        } else {
          return (point2.column - 1) * 24 + 8 + "px";
        }
      };
    },
    movePathWidth() {
      return function(point1, point2) {
        if (point1.column == point2.column) {
          return "8px";
        } else {
          return Math.abs(point2.column - point1.column) * 24 + 8 + "px";
        }
      };
    },
    movePathHeight() {
      return function(point1, point2) {
        if (point1.row == point2.row) {
          return "8px";
        } else {
          return Math.abs(point2.row - point1.row) * 24 + "px";
        }
      };
    }
  },
  methods: {
    // 
    showAimArea(row, column) {
      let aimPoint = {};
      aimPoint.row = row;
      aimPoint.column = column;
      let currentPoint = {};
      currentPoint.row = this.mapSt.currentUnit.row;
      currentPoint.column = this.mapSt.currentUnit.column;
      let moveInfo = {};
      moveInfo.aimPoint = aimPoint;
      moveInfo.moveArea = this.mapDt.moveAreas;
      moveInfo.currentPoint = currentPoint;
      moveInfo.currentUnitIndex = this.mapSt.currentUnitIndex;
      this.$store.commit("changeCurrentPoint", aimPoint);
      this.$store.commit("changeLastPosition", currentPoint);
      this.$store.dispatch("getMovePath", moveInfo);
    }
  }
};
</script>

<style lang="css" scoped>
.move_area img {
  position: absolute;
  cursor: pointer;
  clip: rect(0px, 48px, 24px, 24px);
}

.movePath div {
  position: absolute;
  pointer-events: none;
  background-color: #e10052;
}

.attach_area img {
  position: absolute;
  cursor: pointer;
  clip: rect(0px, 24px, 24px, 0px);
}
</style>