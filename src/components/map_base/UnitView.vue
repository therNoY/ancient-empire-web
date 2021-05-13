<!--显示一个单位详情信息-->
<template>
  <div :style="unitSiteStyle" @click="clickUnit">
    <div class="unitImg">
      <div v-if="unit.done">
        <img :src="doneImg" />
      </div>
      <div v-else>
        <img v-show="singo % 2 == 0" :src="unitImg" />
        <img v-show="singo % 2 != 0" :src="unitImg2" />
      </div>
    </div>

    <!--单位的状态 血量 等级 buff-->
    <div class="status">
      <!--状态-->
      <div v-if="unit.status && unit.status != 'normal'" class="unit_status">
        <img :src="statusImg" />
      </div>
      <!--等级-->
      <div v-if="unit.level && unit.level > 0" class="unit_level">
        <img :src="levelImg" />
      </div>
      <!--血量-->
      <div v-if="unit.life_num && isNotMaxLife" class="lifeNum">
        <img
          v-for="(lifeNum, index) in unit.life_num"
          :key="index"
          :src="liftImg(lifeNum)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["unit", "color", "singo"],
  computed: {
    unitImg() {
      return this.$appHelper.getUnitImg(
        this.unit.type_id,
        this.color ? this.color : this.unit.color
      );
    },
    isNotMaxLife() {
      let life = this.unit.life_num;
      if (life.length != 3) {
        return true;
      } else {
        let lifeString = "";
        for (let i = 0; i < life.length; i++) {
          lifeString += life[i];
        }
        if (
          this.$store.getters.levelInfo[
            this.unit.type_id + "," + this.unit.level
          ]
        ) {
          let res =
            lifeString ==
            this.$store.getters.levelInfo[
              this.unit.type_id + "," + this.unit.level
            ].max_life;
          return !res;
        } else {
          return false;
        }
      }
    },
    liftImg() {
      return function (liftImg) {
        return require("../../assets/images/assist/life_" + liftImg + ".png");
      };
    },
    // 计算等级的图片
    levelImg() {
      return require("../../assets/images/assist/level_" +
        this.unit.level +
        ".png");
    },
    statusImg() {
      return require("../../assets/images/assist/status_" +
        this.unit.status +
        ".png");
    },
    doneImg() {
      return this.$appHelper.getUnitDoneImg(
        this.unit.type_id,
        this.color ? this.color : this.unit.color
      );
    },

    unitImg2() {
      return this.$appHelper.getUnitImg(
        this.unit.type_id,
        this.color ? this.color : this.unit.color,
        "_2"
      );
    },
    unitSiteStyle() {
      let moveLength = this.$store.getters.moveLength;
      if (moveLength > 0) {
        return {
          top: this.$appHelper.getUnitPosition(this.unit.row),
          left: this.$appHelper.getUnitPosition(this.unit.column),
          transitionDuration: this.$store.getters.moveLength * 0.25 + "s",
        };
      } else {
        return {
          top: this.$appHelper.getUnitPosition(this.unit.row),
          left: this.$appHelper.getUnitPosition(this.unit.column),
        };
      }
    },
  },
  methods: {
    clickUnit() {
      this.$emit("unitOnClick", this.unit);
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  img {
    position: absolute;
    transition-property: all !important;
    transition-timing-function: linear;
    transition-duration: 0s;
  }
}
.status {
  width: 24px;
  height: 24px;
}
.unit_level {
  position: relative;
  margin-right: 9px;
  float: right;
}
.lifeNum {
  margin-top: 17px;
}
.lifeNum img {
  position: relative;
  width: 6px;
  float: left;
}
</style>