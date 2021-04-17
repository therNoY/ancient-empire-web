<!--地形集合-->
<template>
  <div v-if="regions">
    <img
      style="float: left"
      v-for="(region, index) in regions"
      :key="'REGION_' + index"
      :src="$appHelper.getRegionImg(region.type, region.color)"
      @click="clickRegion(index)"
      :title="getRegionTitle(index)"
    />

    <!-- 城堡的地图 -->
    <img
      class="castleTitle"
      v-for="(title, index) in mapCastleTitle"
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
export default {
  props: {
    regions: {},
    castleTitles: {},
    row: {},
    column: {},
    showTitle: { type: Boolean, default: false },
  },
  methods: {
    clickRegion(index) {
      this.$emit("clickRegion", index);
    },
    getRegionTitle(index) {
      if (this.showTitle) {
        return (
          Math.floor(index / this.column + 1) +
          "行" +
          ((index + 1) % this.column == 0 ? this.column : (index + 1) % this.column) +
          "列"
        );
      }
      return null;
    },
  },
  computed: {
    mapCastleTitle() {
      let sites = [];
      let region;
      let row = this.row;
      let column = this.column;
      // 获取所有的城堡index 然后设置绝对定位设置城堡的头部
      for (let index = 0; index < this.regions.length; index++) {
        region = this.regions[index];
        if ("castle" == region.type) {
          let castleTitle = {};
          if ((index + 1) % row == 0) {
            castleTitle.row = Number.parseInt((index + 1) / column - 1);
            castleTitle.column = column;
          } else {
            castleTitle.row = Number.parseInt((index + 1) / column);
            castleTitle.column = (index + 1) % column;
          }
          sites.push(castleTitle);
        }
      }
      return sites;
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