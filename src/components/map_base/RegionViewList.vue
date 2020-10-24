<!--地形集合-->
<template>
  <div>
    <img 
      style="float: left;"
      v-for="(region, index) in regions"
      :key="'REGION_' + index"
      :src="$appHelper.getRegionImg(region.type, region.color)"
      @click="clickRegion(index)"
    />

    <!-- 城堡的地图 -->
    <img class="castleTitle"
      v-for="(title, index) in castleTitles"
      :key="'CAST' + index"
      src="../../assets/images/Region/castle_title.png"
      @click="getCastleTitle(title.row, title.column)"
      :style="{
        top: $appHelper.getPosition(title.row),
        left: $appHelper.getPosition(title.column),
      }"
    />
  </div>
</template>

<script>
import eventype from "../../manger/eventType";
export default {
  props: ["regions", "castleTitles", "row", "column"],
  methods: {
    clickRegion(index) {
      if (this.$appHelper.isPlayer(this)) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_REGION, null, null, index);
      }
    },
  },
  computed: {
    castleTitleStyle() {
      return {
        top: this.$appHelper.getPosition(this.title.row),
        left: this.$appHelper.getPosition(this.title.column),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  .castleTitle {
    position: absolute;
    pointer-events: none;
  }
}
</style>