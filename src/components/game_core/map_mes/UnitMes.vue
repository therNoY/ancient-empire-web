<template>
  <!--单位信息-->
  <div class="map_int" :style="{backgroundColor:bkColor()}">
    <div v-if="$store.getters.currentUnitInfo.unit && $store.getters.mapSt.currentUnit != null">
      <!--单位名称-->
      <div class="int_title">
        <el-tag
          size="small"
          v-if="mapSt.currentColor == 'blue'"
        >{{$store.getters.currentUnitInfo.unit.name}}</el-tag>
        <el-tag
          size="small"
          type="success"
          v-if="mapSt.currentColor == 'green'"
        >{{$store.getters.currentUnitInfo.unit.name}}</el-tag>
        <el-tag
          size="small"
          type="info"
          v-if="mapSt.currentColor == 'black'"
        >{{$store.getters.currentUnitInfo.unit.name}}</el-tag>
        <el-tag
          size="small"
          type="danger"
          v-if="mapSt.currentColor == 'red'"
        >{{$store.getters.currentUnitInfo.unit.name}}</el-tag>
      </div>
      <!--单位图片-->
      <div class="unit_p">
        <div class="unit_border">
          <img class="region" v-for="item in 9" src="../../../assets/images/Region/grove.png" />
          <img class="unit" :src="$appHelper.getUnitImg($store.getters.currentUnitInfo.unit.type, $store.getters.mapSt.currentColor)" />
          <div>
            <!--等级-->
            <div v-if="mapSt.currentUnit.level > 0" class="unit_level">
              <img :src="levelImg(unit.level)" />
            </div>
            <!--状态-->
            <div v-if="mapSt.currentUnit.status != null" class="unit_status">
              <img :src="statusImg(mapSt.currentUnit.status)" />
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
            <i :style="{width:lifeRatio(), backgroundColor:lifeColor()}">{{UnitLift()}}</i>
          </span>
        </div>
        <!--经验值-->
        <div>
          <img src="../../../assets/images/assist/info_experience.png" />
          <span>
            <i
              style="background-color: rgb(229, 255, 0);"
              :style="{width:experienceRatio()}"
            >{{mapSt.currentUnit.experience}}</i>
          </span>
        </div>
        <!--攻击-->
        <div>
          <img src="../../../assets/images/assist/info_attach.png" />
          <span
            class="noBac"
            v-if="$store.getters.currentUnitInfo.unit.attack_type == '1'"
            style="color: #0008ff"
          >{{$store.getters.currentUnitInfo.level.min_attack}} - {{$store.getters.currentUnitInfo.level.max_attack}}</span>
          <span
            class="noBac"
            v-else
            style="color: #ff004f"
          >{{$store.getters.currentUnitInfo.level.min_attack}} - {{$store.getters.currentUnitInfo.level.max_attack}}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/info_move.png" />
          <span class="noBac">{{$store.getters.currentUnitInfo.level.speed}}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/info_physical_defense.png" />
          <span class="noBac">{{$store.getters.currentUnitInfo.level.physical_defense}}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/info_magic_defense.png" />
          <span class="noBac">{{$store.getters.currentUnitInfo.level.magic_defense}}</span>
        </div>
      </div>

      <div class="unit_description">描述：{{$store.getters.currentUnitInfo.unit.description}}</div>

      <div class="unit_ability">
        <span>能力列表</span>
        <div
          @click="unitInfoDialog = true"
          v-for="abilitie in $store.getters.currentUnitInfo.abilities"
        >{{abilitie.name}}</div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="unitInfoDialog" width="50%">
      <div style="font-size:12px; float:left; width:100%;color:red">{{mapSt.currentRegionColor}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unitInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="unitInfoDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["mapSt"],
  data() {
    return {
      unitInfoDialog: false
    };
  },
  computed: {
    // 返回生命值的长度
    lifeRatio() {
      return function() {
        let life = 0;
        const lifes = this.mapSt.currentUnit.life;
        for (let index = 0; index < lifes.length; index++) {
          const num = lifes[index];
          life =
            life + num * Math.round(Math.pow(10, lifes.length - index - 1));
        }

        if (life > 100) {
          return life - 100 + "%";
        }
        return life + "%";
      };
    },
    UnitLift() {
      return function() {
        let life = 0;
        const lifes = this.mapSt.currentUnit.life;
        for (let index = 0; index < lifes.length; index++) {
          const num = lifes[index];
          life =
            life + num * Math.round(Math.pow(10, lifes.length - index - 1));
        }
        return life;
      };
    },
    lifeColor() {
      return function() {
        let life = 0;
        const lifes = this.mapSt.currentUnit.life;
        for (let index = 0; index < lifes.length; index++) {
          const num = lifes[index];
          life =
            life + num * Math.round(Math.pow(10, lifes.length - index - 1));
        }
        if (life <= 10) {
          return "#ff0000";
        } else if (life <= 40) {
          return "#ff7b00";
        } else if (life <= 80) {
          return "#edff51";
        } else if (life < 100) {
          return "#fbff00";
        } else if (life == 100) {
          return "#1eff00";
        } else if (life > 100) {
          return "#7c7c7c";
        }
      };
    },
    // 计算等级的位置
    levelTop() {
      return function(row) {
        let top = (row - 1.1) * 24 + "px";
        return top;
      };
    },
    levelLeft() {
      return function(column) {
        let left = (column - 0.35) * 24 + "px";
        return left;
      };
    },
    statusImg() {
      return function(liftImg) {
        return require("../../../assets/images/assist/status_" +
          liftImg +
          ".png");
      };
    },
    // 计算状态的位置
    statusTop() {
      return function(row) {
        let top = (row - 1.05) * 24 + "px";
        return top;
      };
    },
    statusLeft() {
      return function(column) {
        let left = (column - 0.95) * 24 + "px";
        return left;
      };
    },
    // 计算等级的图片
    levelImg() {
      return function(dustNum) {
        return require("../../../assets/images/assist/level_" +
          dustNum +
          ".png");
      };
    },
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
    UnitLift() {
      return function() {
        let life = 0;
        const lifes = this.mapSt.currentUnit.life;
        for (let index = 0; index < lifes.length; index++) {
          const num = lifes[index];
          life =
            life + num * Math.round(Math.pow(10, lifes.length - index - 1));
        }
        return life;
      };
    },
    lifeColor() {
      return function() {
        let life = 0;
        const lifes = this.mapSt.currentUnit.life;
        for (let index = 0; index < lifes.length; index++) {
          const num = lifes[index];
          life =
            life + num * Math.round(Math.pow(10, lifes.length - index - 1));
        }
        if (life <= 10) {
          return "#ff0000";
        } else if (life <= 40) {
          return "#ff7b00";
        } else if (life <= 80) {
          return "#edff51";
        } else if (life < 100) {
          return "#fbff00";
        } else if (life == 100) {
          return "#1eff00";
        } else if (life > 100) {
          return "#7c7c7c";
        }
      };
    },
    // 返回生命值的长度
    lifeRatio() {
      return function() {
        let life = 0;
        const lifes = this.mapSt.currentUnit.life;
        for (let index = 0; index < lifes.length; index++) {
          const num = lifes[index];
          life =
            life + num * Math.round(Math.pow(10, lifes.length - index - 1));
        }

        if (life > 100) {
          return life - 100 + "%";
        }
        return life + "%";
      };
    },
    // 返回经验的长的
    experienceRatio() {
      return function() {
        if (this.mapSt.currentUnit.level == 0) {
          return this.mapSt.currentUnit.experience + "%";
        } else if (this.mapSt.currentUnit.level == 1) {
          return this.mapSt.currentUnit.experience / 2 + "%";
        } else if (this.mapSt.currentUnit.level == 3) {
          return this.mapSt.currentUnit.experience / 3 + "%";
        } else if (this.mapSt.currentUnit.level == 4) {
          return this.mapSt.currentUnit.experience / 6 + "%";
        }
      };
    }
  }
};
</script>

<style lang="css" scoped>
.map_int {
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