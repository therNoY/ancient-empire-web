<template>
  <div>
    <!--指针框 -->
    <div class="cursor_normal" v-if="mapSt.mapStatus != 'willAttach'">
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

    <!--目的地指针 只在移动区域显示的时候才会显示-->
    <div
      class="aim_point"
      @click="goAimPoint"
      v-if="mapSt.mapStatus == 'showMoveArea' || mapSt.mapStatus == 'secendMove'"
    >
      <img
        src="../../../assets/images/assist/cursor_target.png"
        :style="{top: position(1, mapSt.currentPoint.row), left: position(1, mapSt.currentPoint.column)}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["singo", "mapSt", "mapDt"],
  data() {
    return {
      movePointIndex: 0 // 单位移动的辅助值 用于表示当前移动到第几个点了
    };
  },
  computed: {
    position() {
      return function(num, row) {
        return (row - num) * 24 + "px";
      };
    },
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
  methods: {
    // 单位的移动
    goAimPoint() {
      this.$store.commit("setUnitStatus", "moveIng");
      // 1.移动之前计算将要移动的移动距离, 点击就开始移动
      this.moveUnit();
      // 如果只移动一段距离 就不需要
      if (this.mapDt.pathPoints.length > 1) {
        let sumTime = 0; // 用于记录定时器需要延迟的时间 越往后越慢
        for (let i = 0; i < this.mapDt.pathPoints.length - 2; i++) {
          // 这里减去2 最后一个移动点不需要计算
          // 循环出下一段 然后计算出 需要定时的时间
          sumTime = sumTime + this.mapDt.pathPoints[i].length * 250;
          console.log(sumTime);
          setTimeout(this.moveUnit, sumTime + "");
        }
      }
    },
    // 使单位移动一段距离的方法
    moveUnit() {
      // 先计算出移动距离
      this.getMoveLength();
      let i = this.movePointIndex + 1;
      //  移动的核心逻辑 使当前移动的单位改变位置
      this.$store.commit("changeCurrentUnitPosition", this.mapDt.pathPoints[i]);
      this.movePointIndex++;

      // 判断如果是倒数第二段 就设置一个和倒数第一段相同的计时器 用来处理移动结束的逻辑
      if (this.movePointIndex + 1 == this.mapDt.pathPoints.length) {
        let time =
          this.mapDt.pathPoints[this.mapDt.pathPoints.length - 2].length * 250;
        setTimeout(this.moveFinish, time + "");
        // 获取此时单位可进行的移动 比如 attach等
      }
    },
    // 通过当前移动的点movePointIndex 计算出下一段的距离
    getMoveLength() {
      console.log(this.movePointIndex);
      console.log(this.mapDt.pathPoints);
      let point1 = this.mapDt.pathPoints[this.movePointIndex];
      let point2 = this.mapDt.pathPoints[this.movePointIndex + 1];
      if (point1.row == point2.row) {
        this.$store.commit(
          "changeMoveLength",
          Math.abs(point1.column - point2.column)
        );
      } else {
        this.$store.commit(
          "changeMoveLength",
          Math.abs(point1.row - point2.row)
        );
      }
    },
    // 单位到达要移动的地方 判断单位能进行的action
    moveFinish() {
      // 单位移动完毕
      this.movePointIndex = 0;
      if (this.mapSt.mapStatus == "secendMove") {
        this.$store.commit("setUnitStatus", "moveDone");
        this.$store.dispatch("getEndResult", "getEndResult");
        return;
      }
      this.$store.commit("setMapStatus", "showAction");
      this.$store.commit("setUnitStatus", "moveDone");
      // 是action 图标动态显示
      setTimeout(() => {
        this.$store.commit("moveAction");
      }, 50);
    }
  }
};
</script>

<style lang="css" scoped>
.cursor_normal img {
  position: absolute;
  cursor: pointer;
}
.aim_point img {
  position: absolute;
  cursor: pointer;
}
</style>