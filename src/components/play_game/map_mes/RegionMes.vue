<template>
  <!--地形信息-->
  <div class="region_int" :style="{backgroundColor:bkColor()}">
    <!--地形名称-->
    <div v-if="$store.getters.currentRegion.name">
      <!--地形名称-->
      <div class="int_title">
        <el-tag
          size="small"
          v-if="$store.getters.record.curr_color == 'blue'"
        >{{$store.getters.currentRegion.name}}</el-tag>
        <el-tag
          size="small"
          type="success"
          v-if="$store.getters.record.curr_color == 'green'"
        >{{$store.getters.currentRegion.name}}</el-tag>
        <el-tag
          size="small"
          type="info"
          v-if="$store.getters.record.curr_color == 'black'"
        >{{$store.getters.currentRegion.name}}</el-tag>
        <el-tag
          size="small"
          type="danger"
          v-if="$store.getters.record.curr_color == 'red'"
        >{{$store.getters.currentRegion.name}}</el-tag>
      </div>
      <!--地形图片-->
      <div class="unit_p">
        <div class="unit_border">
          <img class="region" src="../../../assets/images/Region/flat.png" />
          <img
            class="region"
            v-if="$store.getters.currentRegion.type != 'castle'"
            src="../../../assets/images/Region/flat.png"
          />
          <img class="region" v-else src="../../../assets/images/Region/castle_title.png" />
          <img class="region" v-for="item in 2" src="../../../assets/images/Region/flat.png" />
          <img class="region" :src="regionImg($store.getters.currentRegion.type)" />
          <img class="region" v-for="item in 4" src="../../../assets/images/Region/flat.png" />
        </div>
      </div>
      <!--地形数据-->
      <div class="unit_ci">
        <el-tooltip content="增加防御" placement="bottom" effect="light">
          <div>
            <img src="../../../assets/images/assist/action_defense.png" />
            <span class="noBac">{{$store.getters.currentRegion.buff}}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="回合恢复" placement="bottom" effect="light">
          <div>
            <img src="../../../assets/images/assist/action_restore.png" />
            <span class="noBac">{{$store.getters.currentRegion.restore}}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="增加金币" placement="bottom" effect="light">
          <div>
            <img src="../../../assets/images/assist/action_buy.png" />
            <span class="noBac">{{$store.getters.currentRegion.tax}}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="消耗移动" placement="bottom" effect="light">
          <div>
            <img src="../../../assets/images/assist/action_move.png" />
            <span class="noBac">{{$store.getters.currentRegion.deplete}}</span>
          </div>
        </el-tooltip>
      </div>

      <div class="region_description">描述：{{$store.getters.currentRegion.description}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mapSt"],
  computed: {
    bkColor() {
      return function() {
        const color = this.$store.getters.record.curr_color;
        if (color != null) {
          if (color == "blue") {
            return "#96d9f4";
          } else if (color == "red") {
            return "#f49e9c";
          } else if (color == "green") {
            return "#abed5a";
          } else if (color == "black") {
            return "#007696";
          }
        } else {
          return "#96d9f4";
        }
      };
    },
    // 返回地形的位置
    regionImg() {
      return function(type) {
        if (type == "castle" || type == "town") {
          if (this.mapSt.currentRegionColor != "") {
            const color = this.mapSt.currentRegionColor;
            console.log(color);
            return require("../../../assets/images/Region/" +
              color +
              "/" +
              type +
              ".png");
          }
        }
        return require("../../../assets/images/Region/" + type + ".png");
      };
    }
  }
};
</script>

<style lang="css" scoped>
.region_int {
  float: right;
  width: 14%;
  height: 100%;
  text-align: center;
}
.int_title {
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.658);
}
.unit_p {
  position: realtive;
  width: 72px;
  margin: auto;
}

.unit_border {
  width: 72px;
  height: 72px;
  margin: auto;
  position: absolute;
  background-color: #F4F4E6;
}
.unit_border .unit {
  position: absolute;
  top: 24px;
  left: 24px;
}
.unit_border img {
  float: left;
}
.region_description {
  font-size: 12px;
  color: rgb(85, 85, 85);
  float: left;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.unit_ci {
  margin-top: 80px;
  float: left;
  width: 100%;
}
.unit_ci div {
  width: 100%;
  float: left;
  background-color: rgb(255, 255, 255);
  margin-top: 10px;
  padding: 5px 0;
}
.unit_ci img {
  float: left;
  width: 9.5%;
  margin-left: 5%;
}
.unit_ci span {
  float: left;
  width: 75%;
  margin-left: 5%;
  color: rgb(97, 97, 97);
  font-size: 12px;
  background-color: rgba(0, 255, 157, 0.767);
}
.unit_ci i {
  float: left;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
.unit_ci .noBac {
  background-color: rgba(255, 255, 255, 0.767);
}
</style>