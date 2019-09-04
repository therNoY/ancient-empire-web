<template>
  <div :style="{width: mapSize(init_map.column), height: mapSize(init_map.row)}">
    <img
      v-for="(region,index) in init_map.regions"
      :src="regionImg(region.type, region.color)"
      @click="getRegionMes(index)"
    />
    <img
      style="position: absolute"
      v-for="(title,index) in castleTitles"
      src="../../../assets/images/Region/castle_title.png"
      @click="getCastleTitle(title.row, title.column)"
      :style="{top: position(title.row), left: position(title.column)}"
    />
  </div>
</template>

<script>
export default {
  props: ["init_map", "castleTitles"],
  data() {
    return {
      mapSt: null
    };
  },
  computed: {
    // 返回地形的位置
    regionImg() {
      return function(type, color = this.regionColor) {
        if (color == "") {
          return require("@/assets/images/Region/" + type + ".png");
        }

        if (type == "castle" || type == "town") {
          return require("@/assets/images/Region/" +
            color +
            "/" +
            type +
            ".png");
        } else {
          return require("@/assets/images/Region/" + type + ".png");
        }
      };
    },
    position() {
      return function(num) {
        return (num - 1) * 24 + "px";
      };
    },
    // mapsize
    mapSize() {
      return function(num) {
        return num * 24 + "px";
      };
    }
  },
  methods: {
    getRegionMes(index) {
      // 移动鼠标
      let currentPoint = {};
      if ((index + 1) % this.init_map.row == 0) {
        currentPoint.row = Math.floor((index + 1) / this.init_map.column);
        currentPoint.column = this.init_map.column;
      } else {
        currentPoint.row = Math.floor((index + 1) / this.init_map.column) + 1;
        currentPoint.column = (index + 1) % this.init_map.column;
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
      if (this.mapSt.mapStatus == "showAction" || this.mapSt.mapStatus == "willAttach") {
        console.log("move back");
        this.$store.commit("changeMoveLength", 0);
        this.$store.commit("moveBack");
      }
      this.$store.commit("setMapStatus", "noAction");
    }
  },

  created() {
    this.mapSt = this.$store.getters.mapSt;
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