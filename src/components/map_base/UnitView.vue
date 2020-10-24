<!--显示一个单位-->
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
      <div v-if="unit.status != null && unit.status != 'normal'" class="unit_status">
        <img :src="statusImg" />
      </div>
      <!--等级-->
      <div v-if="unit.level > 0" class="unit_level">
        <img :src="levelImg" />
      </div>
      <!--血量-->
      <div v-if="isNotMaxLife" class="lifeNum">
        <img v-for="lifeNum in unit.life" :src="liftImg(lifeNum)" />
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
      let life = this.unit.life;
      if (life.length != 3) {
        return true;
      } else {
        let lifeString = "";
        for (let i = 0; i < life.length; i++) {
          lifeString += life[i];
        }
        let res =
          lifeString ==
          this.$store.getters.levelInfo[
            this.unit.typeId + "," + this.unit.level
          ];
        console.log(
          "这个单位不是最大学",
          lifeString,
          this.$store.getters.levelInfo[
            this.unit.typeId + "," + this.unit.level
          ]
        );
        if (res) {
          console.log("这个单位不是最大学", this.unit);
        }
        return res;
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
      if (this.unit.type == "lord" || this.unit.distDoneImg) {
        return this.$appHelper.getUnitDoneImg(this.unit.type_id, this.color);
      }
      return this.$appHelper.getUnitDoneImg(this.unit.type_id);
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