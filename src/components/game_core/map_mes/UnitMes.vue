<template>
  <!--单位信息-->
  <div class="unit-mes" :style="bkColor">
    <div v-if="unitInfo.unitMes">
      <!--单位名称-->
      <div class="int_title">
        <el-tag size="small" :type="tagType">{{ unitInfo.unitMes.name }}</el-tag>
      </div>
      <!--单位图片-->
      <div class="unit_p">
        <div class="unit_border">
          <img
            class="region"
            v-for="item in 9"
            src="../../../assets/images/Region/grove.png"
          />
          <img class="unit" :src="unitImg" />
          <div>
            <!--等级-->
            <div v-if="unitInfo.level > 0" class="unit_level">
              <img :src="levelImg" />
            </div>
            <!--状态-->
            <div v-if="unitInfo.status != null" class="unit_status">
              <img :src="statusImg" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--详细数据-->
    <div class="unit_ci">
      <!--生命值-->
      <div>
        <img src="../../../assets/images/assist/info_life.png" />
        <span>
          <i :style="leftStyle">{{ unitLift }}</i>
        </span>
      </div>
      <!--经验值-->
      <div>
        <img src="../../../assets/images/assist/info_experience.png" />
        <span>
          <i
            style="background-color: rgb(229, 255, 0)"
            :style="experienceRatio"
            >{{ unitInfo.experience }}</i
          >
        </span>
      </div>
      <!--攻击-->
      <div>
        <img src="../../../assets/images/assist/info_attach.png" />
        <span
          class="noBac"
          :style="
            unitInfo.unitMes.attackType == '1'
              ? { color: '#0008ff' }
              : { color: '#ff004f' }
          "
        >
          {{ unitInfo.levelMes.minAttack }} - {{ unitInfo.levelMes.maxAttack }}
        </span>
      </div>
      <div>
        <img src="../../../assets/images/assist/info_move.png" />
        <span class="noBac">{{ unitInfo.levelMes.speed }}</span>
      </div>
      <div>
        <img src="../../../assets/images/assist/info_physical_defense.png" />
        <span class="noBac">{{ unitInfo.levelMes.physicalDefense }}</span>
      </div>
      <div>
        <img src="../../../assets/images/assist/info_magic_defense.png" />
        <span class="noBac">{{ unitInfo.levelMes.magicDefense }}</span>
      </div>
    </div>

    <div class="unit_description">描述：{{ unitInfo.unitMes.description }}</div>

    <div class="unit_ability">
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
export default {
  props: ["bg_color", "curr_color", "unitInfo"],
  data() {
    return {
      unitInfoDialog: false,
    };
  },
  computed: {
    // 标签颜色
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

    // 背景
    bkColor() {
      let color = this.bg_color;
      if (!color) {
        color = this.curr_color;
      }
      let bkColor = "#96d9f4";
      if (color) {
        if (color == "blue") {
          bkColor = "#96d9f4";
        } else if (color == "red") {
          bkColor = "#f49e9c";
        } else if (color == "green") {
          bkColor = "#abed5a";
        } else if (color == "black") {
          bkColor = "#007696";
        }
      }
      return { backgroundColor: bkColor };
    },

    unitImg() {
      return this.$appHelper.getUnitImg(this.unitInfo.typeId, this.bg_color);
    },

    statusImg() {
      return require("../../../assets/images/assist/status_" +
        this.unitInfo.status +
        ".png");
    },

    // 计算等级的图片
    levelImg() {
      return require("../../../assets/images/assist/level_" +
        unitInfo.level +
        ".png");
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
  },
};
</script>

<style lang="scss" scoped>
.unit-mes {
  float: left;
  width: 16%;
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