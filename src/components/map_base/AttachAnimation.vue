<template>
  <div>
    <!--攻击特效-->
    <div class="spark_attack" v-if="mapAs.attachSpark > 0 && mapAs.attachSpark < 7">
      <img
        :src="attachSparkImg(mapAs.attachSpark)"
        :style="{top: $appHelper.getPosition( mapAs.beAttachUnitBak.row), left: $appHelper.getPosition( mapAs.beAttachUnitBak.column)}"
      />
      <!--减少的生命值-->
      <div
        class="attach_num"
        :style="{top: attachNumTop(mapAs.beAttachUnitBak.row), left: $appHelper.getPosition( mapAs.beAttachUnitBak.column)}"
      >
        <img v-for="attachNum in attachResult.attach_result.attach" :src="lifeCImg(attachNum)" />
      </div>
    </div>
    <!--反击特效-->
    <div class="spark_attack" v-if="mapAs.selfAttachSpark > 0 && mapAs.selfAttachSpark < 7">
      <img
        :src="attachSparkImg(mapAs.selfAttachSpark)"
        :style="{top: $appHelper.getPosition( mapAs.beAttachUnitBak.row), left: $appHelper.getPosition( mapAs.beAttachUnitBak.column)}"
      />
      <!--减少的生命值-->
      <div
        class="attach_num"
        :style="{top: attachNumTop(mapAs.beAttachUnitBak.row), left: $appHelper.getPosition( mapAs.beAttachUnitBak.column)}"
      >
        <img
          v-for="attachNum in attachResult.counterattack_result.attach"
          :src="lifeCImg(attachNum)"
        />
      </div>
    </div>

    <!--加血 或者 endIng 时候 lifeChange 的时候-->
    <div v-if="mapStatus == 'lifeChange'" v-for="unit in lifeChangeUnit">
      <div
        class="attach_num animated bounce"
        :style="{top: attachNumTop(unit.row), left: $appHelper.getPosition( unit.column)}"
      >
        <img v-for="num in unit.change" :src="lifeCImg(num)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mapStatus", "mapAs", "attachResult", "lifeChangeUnit"],
  computed: {
    // 获取攻击火花的图
    attachSparkImg() {
      return function(attachSpark) {
        return require("../../../assets/images/assist/spark_attack_" +
          attachSpark +
          ".png");
      };
    },
    // 攻击数top位置
    attachNumTop() {
      return function(row) {
        let top = (row - 0.48) * 24 + "px";
        return top;
      };
    },
    // 获取生命数字的图片
    lifeCImg() {
      return function(attachNum) {
        return require("../../../assets/images/assist/life_c_" +
          attachNum +
          ".png");
      };
    }
  },
  created() {
    console.log(this.attachResult);
  }
};
</script>

<style lang="css" scoped>
.attach_num {
  position: absolute;
}
.attach_num img {
  position: relative !important ;
  float: left;
}
.spark_attack img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
.animated {
  transition-duration: 0.1s;
  animation-fill-mode: both;
}

.animated.infinite {
  animation-iteration-count: infinite;
}
.bounce {
  animation-name: bounce;
  transform-origin: center bottom;
}
@keyframes bounce {
  from,
  20%,
  53%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }

  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -8px, 0);
  }

  90% {
    transform: translate3d(0, -2px, 0);
  }
}
</style>