<template>
  <!--地形信息-->
  <div class="region-mes" :style="bkColor">
    <!--地形名称-->
    <div v-if="region">
      <!--地形名称-->
      <div class="int_title">
        <el-tag
          size="small"
          :type="tagType"
          >{{ region.name }}</el-tag
        >
      </div>
      <!--地形图片-->
      <div class="unit_p">
        <div class="unit_border">
          <img class="region" src="../../../assets/images/Region/flat.png" />
          <img
            class="region"
            v-if="region.type != 'castle'"
            src="../../../assets/images/Region/flat.png"
          />
          <img
            class="region"
            v-else
            src="../../../assets/images/Region/castle_title.png"
          />
          <img
            class="region"
            v-for="item in 2"
            src="../../../assets/images/Region/flat.png"
          />
          <img
            class="region"
            :src="
              $appHelper.getRegionImg(
                region.type,
                region.color
              )
            "
          />
          <img
            class="region"
            v-for="item in 4"
            src="../../../assets/images/Region/flat.png"
          />
        </div>
      </div>
      <!--地形数据-->
      <div class="unit_ci">
        <el-tooltip content="增加防御" placement="bottom" effect="light">
          <div>
            <img src="../../../assets/images/assist/action_defense.png" />
            <span class="noBac">{{ region.buff }}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="回合恢复" placement="bottom" effect="light">
          <div>
            <img src="../../../assets/images/assist/action_restore.png" />
            <span class="noBac">{{ region.restore }}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="增加金币" placement="bottom" effect="light">
          <div>
            <img src="../../../assets/images/assist/action_buy.png" />
            <span class="noBac">{{ region.tax }}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="消耗移动" placement="bottom" effect="light">
          <div>
            <img src="../../../assets/images/assist/action_move.png" />
            <span class="noBac">{{ region.deplete }}</span>
          </div>
        </el-tooltip>
      </div>

      <div class="region_description">
        描述：{{ region.description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["bg_color", "curr_color", "region"],
  computed: {
    // 背景
    bkColor() {
      let color = this.bg_color;
      if (!color) {
        color = this.curr_color;
      }
      let bkColor = "#96d9f4";
      switch (color) {
        case "blue":
          bkColor = "#96d9f4";
          break;
        case "red":
          bkColor = "#f49e9c";
          break;
        case "green":
          bkColor = "#abed5a";
          break;
        case "black":
          bkColor = "#007696";
          break;
      }
      return { backgroundColor: bkColor };
    },
    tagType() {
      let color = this.bg_color;
      if (!color) {
        color = this.curr_color;
      }
      let type = "";
      switch (color) {
        case "blue":
          type = "";
          break;
        case "red":
          type = "danger";
          break;
        case "green":
          type = "success";
          break;
        case "black":
          type = "info";
          break;
      }
      return type;
    },
  },
  created(){
    window.RegionMesVue = this;
  }
};
</script>

<style lang="scss" scoped>
.region-mes {
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
  background-color: #f4f4e6;
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