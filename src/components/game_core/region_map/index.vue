<!--地形显示-->
<template>
  <div :style="{width: $appHelper.getMapSize(record.init_map.column), height: $appHelper.getMapSize(record.init_map.row)}">
    <img
      v-for="(region,index) in record.init_map.regions"
      :src="$appHelper.getRegionImg(region.type, region.color)"
      @click="getRegionMes(index)"
    />
    <img
      style="position: absolute"
      v-for="(title,index) in castleTitles"
      src="../../../assets/images/Region/castle_title.png"
      @click="getCastleTitle(title.row, title.column)"
      :style="{top: $appHelper.getPosition(title.row), left: $appHelper.getPosition(title.column)}"
    />
    {{record.init_map.regions}}
  </div>
</template>

<script>
export default {
  props: ["record", "castleTitles", "mapSt"],
  data() {
    return {
    }
  },
  methods: {
    getRegionMes(index) {
      if (this.mapSt.mapStatus == "secendMove") {
        return;
      }
      // 移动鼠标
      let currentPoint = {};
      if ((index + 1) % this.record.init_map.row == 0) {
        currentPoint.row = Math.floor((index + 1) / this.record.init_map.column);
        currentPoint.column = this.record.init_map.column;
      } else {
        currentPoint.row = Math.floor((index + 1) / this.record.init_map.column) + 1;
        currentPoint.column = (index + 1) % this.record.init_map.column;
      }
      this.changePoint(currentPoint);
    },
    getCastleTitle(row, cloumn) {
      let currentPoint = {};
      currentPoint.row = row;
      currentPoint.column = cloumn;
      this.changePoint(currentPoint);
    },
    // 改变当前点
    changePoint(currentPoint) {
      if (this.mapSt.unitStatus == "moveIng") {
        console.log("等待移动完毕");
        return;
      }
      this.$store.commit("changeCurrentPoint", currentPoint);
      if (this.mapSt.mapStatus == "showAction" || this.mapSt.mapStatus == "willAttach" || this.mapSt.mapStatus == 'willSummon') {
        console.log("move back");
        this.$store.commit("changeMoveLength", 0);
        this.$store.commit("moveBack");
      }

      // 改变当前点的Region 信息
      const regions = this.record.init_map.regions;
      const column = this.record.init_map.column;
      const index = (currentPoint.row - 1) * column + currentPoint.column -1;
      const region = regions[index];
      let regionInfo = this.$store.getters.regionInfo[region.type];
      if (regionInfo == null) {
        this.$store.dispatch("getRegionInfo", region.type)
      }else {
        this.$store.commit("currentRegionInfo", regionInfo);
      }
      this.$store.commit("setMapStatus", "noAction");
    }
  },
  created() {
  }
};
</script>

<style lang="css" scoped>
img {
  float: left;
}
img:hover {
  cursor: pointer;
}
</style>