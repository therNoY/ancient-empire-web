<!--单位消失的冒烟特效-->
<template>
  <div>
    <!--单位消失的烟-->
    <div class="dust">
      <!--被攻击者冒烟-->
      <img
        v-if="mapAs.beAttachDustNum > 0 && mapAs.beAttachDustNum < 5"
        :src="dustImg(mapAs.beAttachDustNum)"
        :style="{top: $appHelper.getPosition( mapSt.beAttachUnit.row), left: $appHelper.getPosition( mapSt.beAttachUnit.column)}"
      />
      <!--攻击者冒烟-->
      <img
        v-if="mapAs.attachDustNum > 0 && mapAs.attachDustNum < 5"
        :src="dustImg(mapAs.attachDustNum)"
        :style="{top: $appHelper.getPosition( mapSt.currentPoint.row), left: $appHelper.getPosition( mapSt.currentPoint.column)}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props:["mapAs", "mapSt"],
  computed: {
    // 获取烟的图片
    dustImg() {
      return function(dustNum) {
        return require("../../../assets/images/assist/dust_" + dustNum + ".png");
      };
    },
  },
};
</script>

<style lang="css" scoped>
.dust img {
  position: absolute;
}
</style>