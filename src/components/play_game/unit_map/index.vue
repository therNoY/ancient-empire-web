<!--单位显示-->
<template>
  <div>
    <!--所有军队-->
    <div class="armys" v-for="(army, armyIndex) in armyList">
      <!--每个单位-->
      <div v-for="(unit, index) in army.units" :key="index" v-if="!unit.isDead">
        <!--单位-->
        <div class="unit" @click="operationUnit(armyIndex, index)">
          <img
            v-if="unit.done"
            :src="isDoneImg(unit.type)"
            :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (mapSt.moveLength*0.25) + 's'}"
          />
          <div v-else @click="makeAction(army.camp, unit)">
            <img
              v-if="singo"
              :src="unitImg(army.color, unit.type)"
              :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (mapSt.moveLength*0.25) + 's'}"
            />
            <img
              v-else
              :src="unitImg(army.color, unit.type, '2')"
              :style="{top: position(1, unit.row), left: position(1, unit.column), transitionDuration: (mapSt.moveLength*0.25) + 's'}"
            />
          </div>
        </div>
        <!--单位的状态 血量 等级 buff-->
        <div>
          <!--血量-->
          <div
            v-if="isNot100(unit.life)"
            class="lifeNum"
            :style="{top: lifeNumTop(unit), left: lifeNumLeft(unit), transitionDuration: (mapSt.moveLength*0.25) + 's'}"
          >
            <img v-for="lifeNum in unit.life" :src="liftImg(lifeNum)" />
          </div>
          <!--等级-->
          <div
            v-if="unit.level > 0"
            class="unit_level"
            :style="{top: levelTop(unit.row), left: levelLeft(unit.column), transitionDuration: (mapSt.moveLength*0.25) + 's'}"
          >
            <img :src="levelImg(unit.level)" />
          </div>
          <!--状态-->
          <div
            v-if="unit.status != null"
            class="unit_status"
            :style="{top: statusTop(unit.row), left: statusLeft(unit.column), transitionDuration: (mapSt.moveLength*0.25) + 's'}"
          >
            <img :src="statusImg(unit.status)" />
          </div>
        </div>
      </div>
    </div>

    <!--坟墓-->
    <div class="tomb">
      <img
        v-for="tomb in tombs"
        src="../../../assets/images/unit/tomb.png"
        @click="operationTomb(tomb)"
        :style="{top: position(1, tomb.row), left: position(1, tomb.column)}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "armyList",
    "currCamp",
    "singo",
    "mapSt",
    "tombs",
    "init_map"
  ],
  data() {
    return {
      currentUnit: null,
      showAttachArea: null
    };
  },
  methods: {
    // 鼠标点击单位
    operationUnit(armyIndex, index) {
      // 获取当前单位
      let currentUnit = this.armyList[armyIndex].units[index];
      let currentPoint = {};
      currentPoint.row = currentUnit.row;
      currentPoint.column = currentUnit.column;

      // 改变当前点的Region 信息 为单位脚下的地图
      const regions = this.init_map.regions;
      const column = this.init_map.column;
      const regionIndex =
        (currentPoint.row - 1) * column + currentPoint.column - 1;
      const region = regions[regionIndex];
      let regionInfo = this.$store.getters.regionInfo[region.type];

      if (region.color != null && region.color != "") {
        this.$store.commit("setCurrentRegionColor", region.color);
      } else {
        this.$store.commit("setCurrentRegionColor", "");
      }

      if (regionInfo == null) {
        this.$store.dispatch("getRegionInfo", region.type);
      } else {
        this.$store.commit("currentRegionInfo", regionInfo);
      }

      if (this.mapSt.mapStatus == "noAction") {
        // 判断是不是点击的当前回合的军队
        let color = this.armyList[armyIndex].color;
        if (color == this.$store.getters.record.curr_color) {
          this.$store.commit("changeCurrentPoint", currentPoint);
          
          // todo 判断是不是敌军 判断被点击的单位的地方是不是在攻击的区域内
          console.log("开始判断");
          this.$store.commit("changeCurrntUnitIndex", index);
          this.$store.commit("changeCurrentUnit", currentUnit);
          this.$store.commit("changeCurrentColor", color);
          if (currentUnit.done) {
            return;
          }

          this.$store.commit("changePathPoints", []);
          // 获取可移动区域
          let indexInfo = {};
          indexInfo.armyIndex = armyIndex;
          indexInfo.index = index;
          this.$store.commit("changeMoveArea", []);
          this.$store.dispatch("getMoveArea", indexInfo);
        } else {
          console.log("点击敌方单位");
          let currentUnit = this.armyList[armyIndex].units[index];
          let color = this.armyList[armyIndex].color;

          this.$store.commit("changeCurrentUnit", currentUnit);
          let currentPoint = {};
          currentPoint.row = currentUnit.row;
          currentPoint.column = currentUnit.column;
          this.$store.commit("changeCurrentPoint", currentPoint);
          this.$store.commit("changeCurrentColor", color);
        }
      } else if (this.mapSt.mapStatus == "showMoveArea") {
        if (
          currentUnit.row == this.mapSt.currentUnit.row &&
          currentUnit.column == this.mapSt.currentUnit.column
        ) {
          console.log("不移动了 就是这");
          let actionInfo = {};
          actionInfo.currentUnitIndex = this.mapSt.currentUnitIndex;
          actionInfo.aimPoint = this.mapSt.currentPoint;
          actionInfo.positions = [];
          actionInfo.currentPoint = this.mapSt.currentPoint;
          this.$store.dispatch("getActions", actionInfo);
        }
      }
    },
    // 鼠标点击坟墓
    operationTomb(tomb) {
      let currentPoint = {};
      currentPoint.row = tomb.row;
      currentPoint.column = tomb.column;
      // 改变当前点的Region 信息 为单位脚下的地图
      const regions = this.init_map.regions;
      const mapColumn = this.init_map.column;
      const regionIndex = (tomb.row - 1) * mapColumn + tomb.column - 1;
      const region = regions[regionIndex];
      let regionInfo = this.$store.getters.regionInfo[region.type];
      if (regionInfo == null) {
        this.$store.dispatch("getRegionInfo", region.type);
      } else {
        this.$store.commit("currentRegionInfo", regionInfo);
      }
      // 改变当前点的信息
      this.$store.commit("changeCurrentPoint", currentPoint);

      if (this.mapSt.mapStatus == "willSummon") {
        console.log("召唤");
        this.$store.commit("changeBeSummonTomb", tomb);
      }
    },
    // 准备对其他单位展开行动
    makeAction(camp, unit) {
      if (this.mapSt.mapStatus == "willAttach") {
        // 准备攻击阶段 判断该单位是否在在
        if (camp != this.currCamp) {
          // 并且该单位在被攻击范围内
          const attachArea = this.$store.getters.mapDt.attachArea;
          for (let index = 0; index < attachArea.length; index++) {
            const element = attachArea[index];
            if (element.row == unit.row && element.column == unit.column) {
              // 判断现在的情况
              console.log("展开行动");
              this.$store.commit("changeBeAttachUnit", unit);
              return;
            }
          }
        }
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
    isDoneImg() {
      return function(type) {
        if (type == "lord") {
          const color = this.$store.getters.record.curr_color;
          return require("../../../assets/images/unit/done/" +
            color +
            "_" +
            type +
            ".png");
        }
        return require("../../../assets/images/unit/done/" + type + ".png");
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
        let top = (row - 1.1) * 24 + "px";
        return top;
      };
    },
    levelLeft() {
      return function(column) {
        let left = (column - 0.35) * 24 + "px";
        return left;
      };
    },
    statusImg() {
      return function(liftImg) {
        return require("../../../assets/images/assist/status_" +
          liftImg +
          ".png");
      };
    },
    // 计算状态的位置
    statusTop() {
      return function(row) {
        let top = (row - 1.05) * 24 + "px";
        return top;
      };
    },
    statusLeft() {
      return function(column) {
        let left = (column - 0.95) * 24 + "px";
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
.unit_level,
.unit_status {
  position: absolute;
  transition-property: all;
  transition-timing-function: linear !important;
  transition-delay: 0s;
}
.tomb img {
  position: absolute;
  cursor: pointer;
}
.lifeNum {
  position: absolute;
  transition-property: all;
  transition-timing-function: linear !important;
  transition-delay: 0s;
}
.lifeNum img {
  position: relative;
  width: 6px;
  float: left;
}
</style>