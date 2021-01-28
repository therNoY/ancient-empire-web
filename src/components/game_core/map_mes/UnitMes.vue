<template>
  <!--单位信息-->
  <div class="unit-mes" :style="bkColor">
    <div>
      <!--单位名称-->
      <div class="int_title">
        <el-tag
          v-if="unitInfo && unitInfo.unit_mes"
          size="small"
          :type="tagType"
          >{{ unitInfo.unit_mes.name }}</el-tag
        >
      </div>
      <!--单位图片-->
      <div class="unit_p">
        <img
          class="region"
          v-for="item in 9"
          src="../../../assets/images/Region/grove.png"
        />
        <unit-view
          v-if="unitInfo"
          class="unit_view"
          :unit="unitInfo"
          :color="bg_color"
          singo="1"
        ></unit-view>
      </div>
    </div>

    <!--详细数据-->
    <div class="unit_ci">
      <!--生命值-->
      <div>
        <img src="../../../assets/images/assist/info_life.png" />
        <span v-if="unitInfo">
          <i :style="leftStyle" style="background-color: rgb(229, 255, 0)">{{
            unitLift
          }}</i>
        </span>
      </div>
      <!--经验值-->
      <div>
        <img src="../../../assets/images/assist/info_experience.png" />
        <span v-if="unitInfo">
          <i
            :style="experienceRatio"
            style="background-color: rgb(229, 255, 0)"
            >{{ unitInfo.experience }}</i
          >
        </span>
      </div>
      <!--攻击-->
      <div>
        <img src="../../../assets/images/assist/info_attach.png" />
        <span
          v-if="unitInfo"
          class="noBac"
          :style="
            unitInfo.unit_mes.attack_type == '1'
              ? { color: '#0008ff' }
              : { color: '#ff004f' }
          "
        >
          {{ unitInfo.level_mes.min_attack }} -
          {{ unitInfo.level_mes.max_attack }}
        </span>
      </div>
      <div>
        <img src="../../../assets/images/assist/info_move.png" />
        <span class="noBac" v-if="unitInfo">{{
          unitInfo.level_mes.speed
        }}</span>
      </div>
      <div>
        <img src="../../../assets/images/assist/info_physical_defense.png" />
        <span class="noBac" v-if="unitInfo">{{
          unitInfo.level_mes.physical_defense
        }}</span>
      </div>
      <div>
        <img src="../../../assets/images/assist/info_magic_defense.png" />
        <span class="noBac" v-if="unitInfo">{{
          unitInfo.level_mes.magic_defense
        }}</span>
      </div>
    </div>

    <div class="unit_description" v-if="unitInfo">
      描述：{{ unitInfo.unit_mes.description }}
    </div>

    <div class="unit_ability" v-if="unitInfo">
      <span>能力列表</span>
      <div
        @click="unitInfoDialog = true"
        v-for="abilitie in unitInfo.abilities"
      >
        {{ abilitie.name }}
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="unitInfoDialog" width="50%">
      <div style="font-size: 12px; float: left; width: 100%; color: red">
        {{ unitInfo }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unitInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="unitInfoDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UnitView from "../../map_base/UnitView";
export default {
  props: ["bg_color", "curr_color", "unitInfo"],
  components: {
    UnitView,
  },
  data() {
    return {
      unitInfoDialog: false,
    };
  },
  computed: {
    // 标签颜色
    tagType() {
      let color = this.curr_color;
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
    // 背景
    bkColor() {
      return this.$appHelper.getBkColor(this.curr_color);
    },
    // 计算生命条的展示风格
    leftStyle() {
      let life = this.unitLift,
        lifeColor = "#ff0000",
        lifeRatio;
      lifeRatio = life > 100 ? life - 100 + "%" : life + "%";

      if (life <= 10) {
        lifeColor = "#ff0000";
      } else if (life <= 40) {
        lifeColor = "#ff7b00";
      } else if (life <= 80) {
        lifeColor = "#edff51";
      } else if (life < 100) {
        lifeColor = "#fbff00";
      } else if (life == 100) {
        lifeColor = "#1eff00";
      } else if (life > 100) {
        lifeColor = "#7c7c7c";
      }
      return { width: lifeRatio, backgroundColor: lifeColor };
    },

    unitLift() {
      let life = 0;
      const lifes = this.unitInfo.life;
      for (let index = 0; index < lifes.length; index++) {
        const num = lifes[index];
        life = life + num * Math.round(Math.pow(10, lifes.length - index - 1));
      }
      return life;
    },
    // 返回经验的长的
    experienceRatio() {
      return {
        width:
          this.unitInfo.experience / this.$appHelper.dp[this.unitInfo.level] +
          "%",
      };
    },
  },
  created() {
    window.cUnitVue = this;
  },
};
</script>

<style lang="scss" scoped>
.unit-mes {
  float: left;
  width: 100%;
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
  position: relative;
  font-size: 0;
  width: 74px;
  height: 72px;
  margin: auto;
}
.region {
  width: 24px;
  height: 24px;
}
.unit_view {
  top: 24px !important;
  left: 24px !important;
  width: 24px;
  height: 24px;
}
.unit_border {
  width: 72px;
  height: 72px;
  margin: auto;
  position: absolute;
}
.unit_border .unit {
  position: absolute;
  top: 24px;
  left: 24px;
}
.unit_border img {
  float: left;
}
.unit_ci {
  margin-top: 10px;
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
.unit_description {
  font-size: 12px;
  color: rgb(85, 85, 85);
  float: left;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.unit_ability {
  font-size: 12px;
  color: rgb(41, 41, 41);
}
.unit_ability span {
  font-size: 14px;
  font-weight: 600;
}
.unit_ability div {
  margin-top: 10px;
}
.unit_ability div:hover {
  cursor: pointer;
  text-decoration: underline;
}
.unit_status {
  position: absolute;
  top: 24px;
  left: 24px;
}
.unit_level {
  position: absolute;
  top: 24px;
  left: 24px;
}
</style>