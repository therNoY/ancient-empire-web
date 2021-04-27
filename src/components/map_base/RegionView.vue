<!--显示一个地形-->
<template>
  <div>
    <img :src="regionImg" @click="clickRegion" />
  </div>
</template>

<script>
import eventype from "../../manger/eventType";
export default {
  props: ["region", "regionIndex"],
  computed: {
    regionImg() {
      return this.$appHelper.getRegionImg(this.region.type, this.region.color);
    },
    castleImg() {
      return this.$appHelper.getRegionImg(this.region.type, this.region.color);
    },
  },
  methods: {
    clickRegion() {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_REGION, null, null, this.regionIndex);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  img {
    float: left;
  }
}
</style>