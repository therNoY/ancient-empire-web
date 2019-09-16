<template>
  <div class="body">
    <!--单位信息-->
    <div class="map_int" :style="{backgroundColor:bkColor()}">
      <div v-if="$store.getters.currentUnitInfo.unit">
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
            <img class="region" v-for="item in 9" src="@/assets/images/Region/grove.png" />
            <img class="unit" :src="unitImg($store.getters.currentUnitInfo.unit.type)" />
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
            <img src="@/assets/images/assist/info_life.png" />
            <span>
              <i :style="{width:lifeRatio(), backgroundColor:lifeColor()}">{{UnitLift()}}</i>
            </span>
          </div>
          <!--经验值-->
          <div>
            <img src="@/assets/images/assist/info_experience.png" />
            <span>
              <i
                style="background-color: rgb(229, 255, 0);"
                :style="{width:experienceRatio()}"
              >{{mapSt.currentUnit.experience}}</i>
            </span>
          </div>
          <!--攻击-->
          <div>
            <img src="@/assets/images/assist/info_attach.png" />
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
            <img src="@/assets/images/assist/info_move.png" />
            <span class="noBac">{{$store.getters.currentUnitInfo.level.speed}}</span>
          </div>
          <div>
            <img src="@/assets/images/assist/info_physical_defense.png" />
            <span class="noBac">{{$store.getters.currentUnitInfo.level.physical_defense}}</span>
          </div>
          <div>
            <img src="@/assets/images/assist/info_magic_defense.png" />
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
    </div>
    <el-dialog title="提示" :visible.sync="unitInfoDialog" width="50%">
       <div style="font-size:12px; float:left; width:100%;color:red">{{mapSt.lastPositon}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unitInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="unitInfoDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <div style="font-size:12px; float:left; width:16%;color:red">{{currentUnitInfo}}</div> -->
    <!--地图-->
    <div class="map_body">
      <el-container style="width: 100%;height:100%; border: 1px solid #eee;padding-right: 20px;">
        <el-main>
          <div
            class="map_div"
            v-if="record.init_map"
            :style="{width: mapSize(record.init_map.column), height: mapSize(record.init_map.row)}"
          >
            <div class="map">
              <!--地形-->
              <region :init_map="record.init_map" :castleTitles="castleTitles"></region>
              <!--攻击移动区域图-->
              <maparea :mapSt="mapSt" :mapDt="mapDt"></maparea>
              <!--指针框-->
              <point :singo="singo" :mapSt="mapSt" :mapDt="mapDt"></point>
              <!--死亡特效-->
              <dustanimation :mapAs="mapAs" :mapSt="mapSt"></dustanimation>
              <!--单位-->
              <unit
                :armyList="record.army_list"
                :currCamp="record.curr_camp"
                :tombs="record.tomb"
                :currColor="record.curr_color"
                :singo="singo"
                :mapSt="mapSt"
                :init_map="record.init_map"
              ></unit>
              <!--升级特效-->
              <levelupanimation :mapStatus="mapSt.mapStatus" :leveupImg="mapAs.leveupImg"></levelupanimation>
              <!--攻击指针-->
              <attachpoint :singo="singo" :mapSt="mapSt" :mapDt="mapDt"></attachpoint>
              <!--展示行动图标-->
              <actions :mapStatus="mapSt.mapStatus" :unitActions="mapDt.unitActions"></actions>
              <!--展示召唤特效-->
              <summonanimation :summonSpark="mapAs.summonSpark" :beSummonTomb="mapSt.beSummonTomb"/>
              <!--展示攻击火花动画-->
              <attachanimation
                :mapStatus="mapSt.mapStatus"
                :mapAs="mapAs"
                :attachResult="mapDt.attachResult"
                :lifeChangeUnit="mapDt.lifeChangeUnit"
              ></attachanimation>
            </div>
          </div>
        </el-main>
        <el-footer>
          <el-button @click="testSendWS">发送ws</el-button>
          {{mapSt.mapStatus}}
        </el-footer>
      </el-container>
    </div>

    <!--地形信息-->
    <div class="region_int" :style="{backgroundColor:bkColor()}">
      <!--地形名称-->
      <div v-if="$store.getters.currentRegion.name">
        <!--地形名称-->
        <div class="int_title">
          <el-tag
            size="small"
            v-if="mapSt.currentColor == 'blue'"
          >{{$store.getters.currentRegion.name}}</el-tag>
          <el-tag
            size="small"
            type="success"
            v-if="mapSt.currentColor == 'green'"
          >{{$store.getters.currentRegion.name}}</el-tag>
          <el-tag
            size="small"
            type="info"
            v-if="mapSt.currentColor == 'black'"
          >{{$store.getters.currentRegion.name}}</el-tag>
          <el-tag
            size="small"
            type="danger"
            v-if="mapSt.currentColor == 'red'"
          >{{$store.getters.currentRegion.name}}</el-tag>
        </div>
        <!--地形图片-->
        <div class="unit_p">
          <div class="unit_border">
            <img class="region" v-for="item in 4" src="@/assets/images/Region/flat.png" />
            <img class="region" :src="regionImg($store.getters.currentRegion.type)" />
            <img class="region" v-for="item in 4" src="@/assets/images/Region/flat.png" />
          </div>
        </div>
        <!--地形数据-->
        <div class="unit_ci">
          <el-tooltip content="增加防御" placement="bottom" effect="light">
            <div>
              <img src="@/assets/images/assist/action_buff.png" />
              <span class="noBac">{{$store.getters.currentRegion.buff}}</span>
            </div>
          </el-tooltip>
          <el-tooltip content="回合恢复" placement="bottom" effect="light">
            <div>
              <img src="@/assets/images/assist/action_restore.png" />
              <span class="noBac">{{$store.getters.currentRegion.restore}}</span>
            </div>
          </el-tooltip>
          <el-tooltip content="增加金币" placement="bottom" effect="light">
            <div>
              <img src="@/assets/images/assist/action_buy.png" />
              <span class="noBac">{{$store.getters.currentRegion.tax}}</span>
            </div>
          </el-tooltip>
          <el-tooltip content="消耗移动" placement="bottom" effect="light">
            <div>
              <img src="@/assets/images/assist/action_move.png" />
              <span class="noBac">{{$store.getters.currentRegion.deplete}}</span>
            </div>
          </el-tooltip>
        </div>

        <div class="region_description">描述：{{$store.getters.currentRegion.description}}</div>
      </div>
    </div>
    <div style="font-size:12px; float:left; width:100%; color:rgb(0, 20, 201)">{{record.army_list}}</div>
    <div style="font-size:12px; float:left; width:100%; color:red">{{record.tomb}}</div>
  </div>
</template>

<script>
import region from "./region_map";
import unit from "./unit_map";
import point from "./assits_map/Point";
import attachpoint from "./assits_map/AttachPoint";
import maparea from "./assits_map/Area";
import actions from "./assits_map/Action";
import attachanimation from "./assits_map/AttachAnimation";
import dustanimation from "./assits_map/DustAnimation";
import levelupanimation from "./assits_map/LevelUpAnimation";
import summonanimation from "./assits_map/SummonAnimation";
import { GetRecordById } from "@/api";
export default {
  components: {
    region,
    unit,
    point,
    maparea,
    actions,
    attachpoint,
    attachanimation,
    dustanimation,
    levelupanimation,
    summonanimation
  },
  data() {
    return {
      singo: true, // 控制单位一闪一闪
      recordId: null,
      record: {},
      mapSt: null,
      mapDt: null,
      mapAs: null,
      currentUnitInfo: null,
      unitInfoDialog: false,
      castleTitles: []
    };
  },
  computed: {
    mapSize() {
      return function(num) {
        return num * 24 + "px";
      };
    },
    // 通过 单位所属的颜色 找到相应的图片
    unitImg() {
      return function(type, num = "") {
        const color = this.$store.getters.mapSt.currentColor;
        return require("../../assets/images/unit/" +
          color +
          "/" +
          type +
          num +
          ".png");
      };
    },
    bkColor() {
      return function() {
        if (this.mapSt.currentColor != null) {
          if (this.mapSt.currentColor == "blue") {
            return "#96d9f4";
          } else if (this.mapSt.currentColor == "red") {
            return "#f49e9c";
          } else if (this.mapSt.currentColor == "green") {
            return "#abed5a";
          } else if (this.mapSt.currentColor == "black") {
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
        return require("../../assets/images/assist/status_" + liftImg + ".png");
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
        return require("../../assets/images/assist/level_" + dustNum + ".png");
      };
    },
    // 返回地形的位置
    regionImg() {
      return function(type) {
        return require("@/assets/images/Region/" + type + ".png");
      };
    }
  },
  methods: {
    // 获取记录
    async getRecord() {
      let url = "/record/" + this.recordId;
      const resp = await GetRecordById(url);
      if (resp.res_code == 0) {
        this.record = resp.res_val;
        this.$store.commit("setRecord", this.record);
        const map = this.record.init_map;
        // 获取所有的城堡index 然后设置绝对定位设置城堡的头部
        for (let index = 0; index < map.regions.length; index++) {
          const region = map.regions[index];
          if (region.type == "castle") {
            let castleTitle = {};
            if ((index + 1) % map.row == 0) {
              castleTitle.row = Math.floor((index + 1) / map.column) - 1;
              castleTitle.column = map.column;
            } else {
              castleTitle.row = Math.floor((index + 1) / map.column);
              castleTitle.column = (index + 1) % map.column;
            }
            this.castleTitles.push(castleTitle);
          }
        }
      } else {
        this.$message.error(resp.res_mes);
        this.$router.push("/");
      }
    },
    // 与后台创建一个 ws 连接
    connectWs() {
      // 开始连接
      if (this.$store.state.ws.stompClient == null) {
        this.$store.dispatch("wsConnection", this.recordId);
      }
    },
    testSendWS() {
      let args = {};
      args.url = "/ws/test";
      args.mes = "获取移动范围";
      this.$store.dispatch("wsSendMes", args);
    },
    // 开启一个后台进程 计时器
    startWorker() {
      if (typeof Worker !== "undefined") {
        if (this.worker == null) {
          // this.worker = new Worker(setInterval(this.timer, 500));
        }
      } else {
        alert("抱歉 您的电脑不支持");
      }
    },
    timer() {
      this.singo = !this.singo;
    }
  },
  created() {
    if ((this.recordId = this.$store.getters.recordId) == null) {
      this.$router.push("/");
      return;
    }
    this.getRecord();
    this.mapSt = this.$store.getters.mapSt;
    this.mapDt = this.$store.getters.mapDt;
    this.mapAs = this.$store.getters.mapAs;
    this.currentUnitInfo = this.$store.getters.currentUnitInfo;
    this.connectWs();
    this.startWorker();
  }
};
</script>

<style lang="css" scoped>
.body {
  width: 100%;
  height: 100%;
  position: relative;
  color: rgb(124, 124, 124);
}
.map_body {
  float: left;
  width: 70%;
  height: 100%;
}
.map_int {
  float: left;
  width: 16%;
  height: 100%;
  text-align: center;
}
.map_div {
  margin: 0 auto;
  position: relative;
}
.map {
  position: absolute;
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
.unit_level {
  position: absolute;
  top: 24px;
  left: 24px;
}
.unit_status {
  position: absolute;
  top: 24px;
  left: 24px;
}
.unit_description,
.region_description {
  font-size: 12px;
  color: rgb(85, 85, 85);
  float: left;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.unit_description {
  border-bottom: 2px rgb(124, 124, 124) solid;
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
.region_int {
  float: right;
  width: 14%;
  height: 100%;
  text-align: center;
}
</style>