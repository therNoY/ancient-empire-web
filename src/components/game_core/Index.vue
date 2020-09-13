<template>
  <div class="body">
    <!-- <div style="font-size:12px; float:left; width:16%;color:red">{{currentUnitInfo}}</div> -->
    <!--单位信息-->
    <unitmes :mapSt="mapSt" />
    <!--地图-->
    <div class="map_body">
      <el-container style="width: 100%;height:100%; border: 1px solid #eee;padding-right: 20px;">
        <el-main>
          <div
            class="map_div"
            v-if="record.game_map"
            :style="{width: $appHelper.getMapSize(record.game_map.column), height: $appHelper.getMapSize(record.game_map.row)}"
          >
            <div class="map">
              <!--地形-->
              <div
                :style="{width: $appHelper.getMapSize(record.game_map.column), height: $appHelper.getMapSize(record.game_map.row)}"
              >
                <img
                  v-for="(region,index) in record.game_map.regions"
                  :src="mapRegionImg(region.type, region.color)"
                  @click="getRegionMes(index)"
                />
                <img
                  style="position: absolute"
                  v-for="(title,index) in castleTitles"
                  src="../../assets/images/Region/castle_title.png"
                  @click="getCastleTitle(title.row, title.column)"
                  :style="{top: $appHelper.getPosition(title.row), left: $appHelper.getPosition(title.column)}"
                />
              </div>
              <!-- <region :record="record" :mapSt="mapSt" :castleTitles="castleTitles"></region> -->
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
                :singo="singo"
                :mapSt="mapSt"
                :game_map="record.game_map"
              ></unit>
              <!--升级特效-->
              <levelupanimation :mapStatus="mapSt.mapStatus" :leveupImg="mapAs.leveupImg"></levelupanimation>
              <!--攻击指针-->
              <attachpoint :singo="singo" :mapSt="mapSt" :mapDt="mapDt"></attachpoint>
              <!--展示行动图标-->
              <actions :mapStatus="mapSt.mapStatus" :unitActions="mapDt.unitActions"></actions>
              <!--展示召唤特效-->
              <summonanimation :summonSpark="mapAs.summonSpark" :beSummonTomb="mapSt.beSummonTomb" />
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
        <el-footer class="bars" >
          <div v-if="record.game_map" :style="{width: $appHelper.getMapSize(record.game_map.column)}">
            <!--当前回合信息-->
            <div class="bar_mes" v-for="currentArmy in currenyArmyInfo()">
              <el-tooltip content="金币" placement="top" effect="light">
                <div>
                  <img src="../../assets/images/assist/bar_money.png" />
                  <span>{{currentArmy.money}}</span>
                </div>
              </el-tooltip>

              <el-tooltip content="人口" placement="top" effect="light">
                <div>
                  <img src="../../assets/images/assist/bar_pop.png" />
                  <span>{{currentArmy.pop}} / {{currentArmy.max_pop}}</span>
                </div>
              </el-tooltip>

              <el-tooltip content="回合数" placement="top" effect="light">
                <div>
                  <img src="../../assets/images/assist/bar_round.png" />
                  <span>{{currentArmy.round}}</span>
                </div>
              </el-tooltip>

              <el-tooltip content="阵营" placement="top" effect="light">
                <div>
                  <img src="../../assets/images/assist/bar_camp.png" />
                  <span>{{currentArmy.camp}}</span>
                </div>
              </el-tooltip>
            </div>
            <div class="bar_button">
              <el-button size="mini" type="primary" @click="testSendWS">test</el-button>
              <el-button size="mini" type="primary">主菜单</el-button>
              <el-button size="mini" type="primary">小地图</el-button>
              <el-button size="mini" type="primary" @click="saveUserRecord">保存游戏</el-button>
              <el-button size="mini" type="primary" @click="getNewRound">结束回合</el-button>
            </div>
          </div>
        </el-footer>
      </el-container>
    </div>
    <!--地形信息-->
    <regionmes :mapSt="mapSt" />

    <!--购买单位的弹出框-->
    <byunit v-if="mapSt.buyUnitDialog" :buyUnitDialog="mapSt.buyUnitDialog" :buyUnitsInfo="mapDt.buyUnitsInfo" />
  </div>
</template>

<script>
// import region from "./region_map";
import unit from "./unit_map";
import byunit from "./unit_map/BuyUnit";
import point from "./assits_map/Point";
import attachpoint from "./assits_map/AttachPoint";
import maparea from "./assits_map/Area";
import actions from "./assits_map/Action";
import attachanimation from "./assits_map/AttachAnimation";
import dustanimation from "./assits_map/DustAnimation";
import levelupanimation from "./assits_map/LevelUpAnimation";
import summonanimation from "./assits_map/SummonAnimation";
import regionmes from "./map_mes/RegionMes";
import unitmes from "./map_mes/UnitMes";
import { GetRecordById, SaveUserRecord } from "@/api";
export default {
  components: {
    // region,
    unit,
    byunit,
    point,
    maparea,
    actions,
    attachpoint,
    attachanimation,
    dustanimation,
    levelupanimation,
    summonanimation,
    regionmes,
    unitmes
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
      castleTitles: []
    };
  },
  computed: {
    // 返回地形的位置
    mapRegionImg() {
      return function(type, color = this.regionColor) {
        if (color == "" || color == null) {
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
    currenyArmyInfo() {
      return function() {
        let armyInfos = [];
        let armyInfo = {};
        let currArmy;
        for (let index = 0; index < this.record.army_list.length; index++) {
          const army = this.record.army_list[index];
          if (army.color == this.record.curr_color) {
            currArmy = army;
            break;
          }
        }
        armyInfo.money = currArmy.money;
        armyInfo.max_pop = this.record.max_pop;
        armyInfo.pop = currArmy.pop;
        armyInfo.camp = currArmy.camp;
        armyInfo.round = this.record.current_round;
        armyInfos.push(armyInfo);
        return armyInfos;
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
        const map = this.record.game_map;
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
    },
    // 鼠标点击地形
    getRegionMes(index) {
      // 如果是二次移动阶段 则必须移动
      if (this.mapSt.mapStatus == "secendMove") {
        return;
      }

      // 显示地形颜色信息 并判断是否需要展示 购买军队弹出框
      if (
        this.record.game_map.regions[index].color != null &&
        this.record.game_map.regions[index].color != ""
      ) {
        // 这个地形是有颜色的 并且是城堡 就展示购买军队框
        if (this.record.game_map.regions[index].type == "castle") {
          if (
            this.record.game_map.regions[index].color == this.record.curr_color
          ) {
            this.$store.dispatch("getCanByUnit");
          }
        }
        // 设置当前地形的颜色 便于地形展示
        this.$store.commit(
          "setCurrentRegionColor",
          this.record.game_map.regions[index].color
        );
      } else {
        this.$store.commit("setCurrentRegionColor", "");
      }

      // 计算出现在的site
      let currentPoint = {};
      if ((index + 1) % this.record.game_map.row == 0) {
        currentPoint.row = Math.floor(
          (index + 1) / this.record.game_map.column
        );
        currentPoint.column = this.record.game_map.column;
      } else {
        currentPoint.row =
          Math.floor((index + 1) / this.record.game_map.column) + 1;
        currentPoint.column = (index + 1) % this.record.game_map.column;
      }
      // 改变位置
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
      // 判断现在是不是在领主在的城堡招募
      if (this.mapAs.lordBuy) {
        console.log("领主招募必须走");
        if (
          this.mapSt.mapStatus == "showAction" ||
          this.mapSt.mapStatus == "willAttach" ||
          this.mapSt.mapStatus == "willSummon"
        ) {
          console.log("回退");
          this.$store.commit("setMapStatus", "showMoveArea");
          this.$store.commit("moveBack");
        }
        return;
      }
      this.$store.commit("changeCurrentPoint", currentPoint);
      if (
        this.mapSt.mapStatus == "showAction" ||
        this.mapSt.mapStatus == "willAttach" ||
        this.mapSt.mapStatus == "willSummon"
      ) {
        console.log("move back");
        this.$store.commit("changeMoveLength", 0);
        this.$store.commit("moveBack");
      }

      // 改变当前点的Region 信息
      const regions = this.record.game_map.regions;
      const column = this.record.game_map.column;
      const index = (currentPoint.row - 1) * column + currentPoint.column - 1;
      const region = regions[index];
      let regionInfo = this.$store.getters.regionInfo[region.type];
      if (regionInfo == null) {
        this.$store.dispatch("getRegionInfo", region.type);
      } else {
        this.$store.commit("currentRegionInfo", regionInfo);
      }
      this.$store.commit("setMapStatus", "noAction");
    },
    // 结束回合开始新的回合
    getNewRound() {
      this.$store.dispatch("getNewRound");
    },
    // 保存用户地图
    saveUserRecord() {
      //
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
.map_div {
  margin: 0 auto;
  position: relative;
}
.map {
  position: absolute;
}
.map img {
  float: left;
}
.map img:hover {
  cursor: pointer;
}
.bars {
  margin: auto;
  height: 10px;
}
.bar_mes {
  margin-top: 4px;
  float: left;
  width: 140px;
}
.el-tooltip {
  float: left;
  width: 60px;
  font-size: 13px;
  margin-right: 10px;
}
.el-tooltip img {
  margin-top: 3px;
  float: left;
}
.el-tooltip span {
  display: block;
  float: left;
}
.bar_button {
  float: left;
}
.bar_button .el-button {
  margin-top: 3px;
}
</style>