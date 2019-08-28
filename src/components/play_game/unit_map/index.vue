<!--单位显示-->
<template>
  <div>
    <!--所有军队-->
    <div class="armys" v-for="(army, armyIndex) in armyList">
      <!--每个单位-->
      <div v-for="(unit, index) in army.units" :key="index" v-if="!unit.isDead">
        <div
          class="unit"
          @click="operationUnit(armyIndex, index)"
          @mousemove="showAimArea(unit.row, unit.column)"
        >
          <img
            v-if="unit.isDone"
            :src="isDoneImg(unit.type)"
            :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (moveLength*0.25) + 's'}"
          />
          <div v-else>
            <img
              v-if="singo"
              :src="unitImg(army.color, unit.type)"
              :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (moveLength*0.25) + 's'}"
            />
            <img
              v-else
              :src="unitImg(army.color, unit.type, '2')"
              :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (moveLength*0.25) + 's'}"
            />
          </div>
        </div>
        <!--单位的状态 血量 等级 buff-->
        <div class="unit_status">
          <!--血量-->
          <div
            v-if="isNot100(unit.life)"
            class="lifeNum"
            :style="{top: lifeNumTop(unit), left: lifeNumLeft(unit), transitionDuration: (moveLength*0.25) + 's'}"
          >
            <img v-for="lifeNum in unit.life" :src="liftImg(lifeNum)" />
          </div>
          <!--等级-->
          <div
            v-if="unit.level > 0"
            class="unit_level"
            :style="{top: levelTop(unit.row), left: levelLeft(unit.column), transitionDuration: (moveLength*0.25) + 's'}"
          >
            <img :src="levelImg(unit.level)" />
          </div>
          <!--状态-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["armyList", "currColor", "singo", "mapSt"],
  data() {
    return {
      currentUnit: null,
      moveLength: null,
      showAttachArea: null
    };
  },
  methods: {
    // 鼠标点击单位
    operationUnit(armyIndex, index) {
      // 判断是不是点击的当前回合的军队
      if (this.armyList[armyIndex].color == this.currColor) {
        // todo 判断是不是敌军 判断被点击的单位的地方是不是在攻击的区域内
        console.log("开始判断");
        // 判断当前是准备攻击阶段 如果

        // if (this.showAttachArea && (this.currentUnit.row != this.armyList[armyIndex].units[index].row || this.currentUnit.column != this.armyList[armyIndex].units[index].column)) {
        //   this.beAttachArmyIndex = armyIndex;
        //   this.beAttachUnitIndex = index;
        //   this.beAttachUnit = this.armys[armyIndex].units[index];
        //   console.log("是准备被攻击的");
        //   console.log(this.beAttachUnit);
        //   this.showAttachPoint = true;
        //   return;
        // }

        // this.currentArmyIndex = armyIndex;
        // this.currentUnitIndex = index;
        // this.currentUnit = this.armys[armyIndex].units[index];
        let currentUnit = this.armyList[armyIndex].units[index];
        let currentPoint = {};
        currentPoint.row = currentUnit.row;
        currentPoint.column = currentUnit.column;
        this.$store.commit("changeCurrentPoint", currentPoint);
        // 获取可移动区域
        let indexInfo = {};
        indexInfo.armyIndex = armyIndex;
        indexInfo.index = index;
        this.$store.dispatch("getMoveArea", indexInfo);
        this.$store.commit("changeShowMoveArea", true);
      }else {
        console.log("点击敌方单位");
      }
    },
    // 展示当前单位的移动目的
    showAimArea(row, column) {
      if (this.showMoveArea) {
        this.currentPoint.row = row;
        this.currentPoint.column = column;
      }
    }
  },
  computed: {
    // 通过 单位所属的颜色 找到相应的图片
    unitImg() {
      return function(color, type, num = "") {
        return require("../../../assets/images/unit/" +
          color +
          "/" +
          type +
          num +
          ".png");
      };
    },
    position() {
      return function(num, row) {
        return (row - num) * 24 + "px";
      };
    },
    //血量位置的计算
    lifeNumTop() {
      return function(unit) {
        let top = (unit.row - 0.29) * 24 + "px";
        return top;
      };
    },
    lifeNumLeft() {
      return function(unit) {
        let left = (unit.column - 1) * 24 + "px";
        return left;
      };
    },
    isNot100() {
      return function(life) {
        if (life.length != 3) {
          return true;
        } else if (life[2] != 0) {
          return true;
        } else if (life[1] != 0) {
          return true;
        } else if (life[0] != 1) {
          return true;
        } else {
          return false;
        }
      };
    },
    // 根据血量来找图片
    liftImg() {
      return function(liftImg) {
        return require("../../../assets/images/assist/life_" +
          liftImg +
          ".png");
      };
    },
    // 计算等级的位置
    levelTop() {
      return function(row) {
        let top = (row - 1) * 24 + "px";
        return top;
      };
    },
    levelLeft() {
      return function(column) {
        let left = (column - 0.35) * 24 + "px";
        return left;
      };
    },
    // 计算等级的图片
    levelImg() {
      return function(dustNum) {
        return require("../../../assets/images/assist/level_" +
          dustNum +
          ".png");
      };
    }
  },
  created() {
    console.log(this.armyList);
    console.log(this.mapSt);
    this.currentUnit = this.$store.getters.currentPoint;
    this.showAttachArea = this.mapSt.showAttachArea;
  }
};
</script>

<style lang="css" scoped>
.armys img {
  position: absolute;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
.unit:hover {
  cursor: pointer;
}
.unit_level {
  position: absolute;
  transition-property: all;
  transition-timing-function: linear !important;
  transition-delay: 0s;
}
</style>