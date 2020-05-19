<template>
  <div>
    <!--召唤特效-->
    <div class="spark_summon" v-if="summonSpark > 0 && summonSpark < 7">
      <img
        :src="summonSparkImg(summonSpark)"
        :style="{top: $appHelper.getPosition(beSummonTomb.row), left: $appHelper.getPosition(beSummonTomb.column)}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props:["summonSpark", "beSummonTomb"],
  computed: {
    // 获取攻击火花的图
    summonSparkImg() {
      return function(summonSpark) {
        return require("../../../assets/images/assist/spark_white_" +
          summonSpark +
          ".png");
      };
    },
  },
};
</script>

<style lang="css" scoped>
.spark_summon img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
</style>