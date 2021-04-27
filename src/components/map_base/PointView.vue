<template>
  <div class="cursor_normal">
    <!--指针框 -->
    <div v-if="!attachPoint.hasOwnProperty('row')" @click="clickPoint">
      <img
        v-show="singo % 2 == 0"
        src="../../assets/images/assist/point_0.png"
        :style="pointPosition"
      />
      <img
        v-show="singo % 2 == 1"
        src="../../assets/images/assist/point_1.png"
        :style="pointPosition"
      />
    </div>
    <!--攻击/召唤/治疗 指针-->
    <div v-else class="attackPoint" @click="clickChoosePoint">
      <img :src="attachPointImg" :style="attachPointStyle" />
    </div>

    <!--目的地指针 只在移动区域显示的时候才会显示-->
    <div class="aim_point" v-if="$store.getters.moveLine.length > 0">
      <img
        src="../../assets/images/assist/cursor_target.png"
        :style="aimPoint"
        @click="goAimPoint"
      />
    </div>
  </div>
</template>

<script>
import eventype from "../../manger/eventType";
export default {
  props: {
    singo:{
      default:0,
    },
    point:{}
  },
  data() {
    return {
      movePointIndex: 0, // 单位移动的辅助值 用于表示当前移动到第几个点了
    };
  },
  computed: {
    attachPoint() {
      return this.$store.getters.attachPoint;
    },
    pointPosition() {
      return {
        top: this.$appHelper.getPosition(this.point.row),
        left: this.$appHelper.getPosition(this.point.column),
      };
    },
    aimPoint() {
      return {
        top: this.$appHelper.getPosition(this.point.row),
        left: this.$appHelper.getPosition(this.point.column),
      };
    },
    attachPointStyle() {
      return {
        top: (this.attachPoint.row - 1 - 0.3) * 24 + "px",
        left: (this.attachPoint.column - 1 - 0.3) * 24 + "px",
      };
    },
    attachPointImg() {
      return require("../../assets/images/assist/cursor_0" +
        ((this.singo % 3) + 2) +
        ".png");
    },
  },
  methods: {
    // 点击指针
    clickPoint() {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_POINT);
      }
    },
    // 点击目的地指针
    goAimPoint() {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_AIM_POINT);
      }
    },
    // 点击选择指针
    clickChoosePoint() {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(
          eventype.CLICK_CHOOSE_POINT,
          null,
          this.attachPoint
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cursor_normal img {
  position: absolute;
  cursor: pointer;
}
.aim_point img {
  position: absolute;
  cursor: pointer;
}
.attackPoint img {
  position: absolute;
  cursor: pointer;
}
</style>