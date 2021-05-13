<!--包含单位的移动区域和攻击区域-->
<template>
  <div>
    <!--可移动区域-->
    <div class="move_area" v-if="moveAreas && moveAreas.length > 0">
      <img
        v-for="(moveArea,index) in moveAreas"
        :key="'MOVEAREA_' + index"
        src="../../assets/images/assist/alpha.png"
        @click="showMoveLine(moveArea.row, moveArea.column)"
        :style="{
          top: $appHelper.getPosition(moveArea.row),
          left: $appHelper.getPosition(moveArea.column, 2),
        }"
      />
    </div>
    <!--移动路线-->
    <div
      class="movePath"
      v-for="(pathPoint, index) in moveLine"
      :key="'MOVELINE_' + index"
    >
      <div
        v-if="index < moveLine.length - 1"
        :style="{
          top: movePathTop(pathPoint, moveLine[index + 1]),
          left: movePathLeft(pathPoint, moveLine[index + 1]),
          width: movePathWidth(pathPoint, moveLine[index + 1]),
          height: movePathHeight(pathPoint, moveLine[index + 1]),
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import eventype from "../../manger/eventType";
export default {
  props: ["point"],
  data() {
    return {
      moveStatue: null,
    };
  },
  computed: {
    moveAreas() {
      return this.$store.getters.moveAreas;
    },
    moveLine() {
      return this.$store.getters.moveLine;
    },
    // 根据 得到最短距离需要拐弯的几个点 画出一条红线
    movePathTop() {
      return function (point, point2) {
        if (point.row <= point2.row) {
          return (point.row - 1) * 24 + 8 + "px";
        } else {
          return (point2.row - 1) * 24 + 8 + "px";
        }
      };
    },
    movePathLeft() {
      return function (point, point2) {
        if (point.column < point2.column) {
          return (point.column - 1) * 24 + 8 + "px";
        } else {
          return (point2.column - 1) * 24 + 8 + "px";
        }
      };
    },
    movePathWidth() {
      return function (point1, point2) {
        if (point1.column == point2.column) {
          return "8px";
        } else {
          return Math.abs(point2.column - point1.column) * 24 + 8 + "px";
        }
      };
    },
    movePathHeight() {
      return function (point1, point2) {
        if (point1.row == point2.row) {
          return "8px";
        } else {
          return Math.abs(point2.row - point1.row) * 24 + "px";
        }
      };
    },
  },
  methods: {
    // 展示移动路线
    showMoveLine(row, column) {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_MOVE_AREA, {
          row: row,
          column: column,
        });
      }
    },
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>
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
</style>