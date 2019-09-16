<template>
  <div>
    <!--召唤特效-->
    <div class="spark_summon" v-if="summonSpark > 0 && summonSpark < 7">
      <img
        :src="summonSparkImg(summonSpark)"
        :style="{top: position(1, beSummonTomb.row), left: position(1, beSummonTomb.column)}"
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
    // 根据row 和column 返回图片相对于父布局的 top和left
    position() {
      return function(num, row) {
        return (row - num) * 24 + "px";
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