<template>
  <div id="gameCore">
    <unit-mes
      :bg_color="game.bg_color"
      :curr_color="game.curr_color"
      :unitInfo="game.curr_unit"
      :region="game.curr_region"
    />
    <el-container>
      <el-main>
        <div class="base_map" :style="mapStyle">
          <region-view-list
            ref="regionViewList"
            :regions="game.game_map.regions"
            :row="game.game_map.row"
            :column="game.game_map.column"
            :castleTitles="game.castle_titles"
          />
          <attach-view/>
          <tomb-view/>
          <move-area :point="game.curr_point"/>
          <army-view :armys="game.army_list" :singo="singo" />
          <point-view :point="game.curr_point" :singo="singo"/>
          <action-view/>
          <left-change/>
          <animate-view/>
        </div>
      </el-main>
      <el-footer class="bars">%%%%%%%%%%%%%%%%%%%%%%%%%%%%</el-footer>
    </el-container>
    <region-mes
      :bg_color="game.bg_color"
      :curr_color="game.curr_color"
      :region="game.curr_region"
    />
  </div>
</template>

<script>
// import region from "./region_map";

import { GetRecordById, SaveUserRecord } from "@/api";
import RegionViewList from "../map_base/RegionViewList";
import ArmyView from "../map_base/ArmyView.vue";
import UnitMes from "./map_mes/UnitMes.vue";
import RegionMes from "./map_mes/RegionMes.vue";
import PointView from "../map_base/PointView.vue";
import MoveArea from "../map_base/MoveArea.vue"
import ActionView from "../map_base/ActionView.vue"
import AttachView from "../map_base/AttachArea.vue"
import LeftChange from "../map_base/LeftChangeView.vue"
import AnimateView from "../map_base/AnimateView.vue"
import TombView from "../map_base/TombView.vue"
export default {
  components: {
    RegionViewList,
    ArmyView,
    UnitMes,
    RegionMes,
    PointView,
    MoveArea,
    ActionView,
    AttachView,
    LeftChange,
    AnimateView,
    TombView,
  },
  data() {
    return {
      // 当前地图
      game: {},
      // 当前变化信号
      singo: 1,
    };
  },
  computed: {
    mapStyle() {
      return {
        width: this.$appHelper.getMapSize(this.game.game_map.column),
        height: this.$appHelper.getMapSize(this.game.game_map.row),
      };
    },
  },
  methods: {
    // 获取记录
    getRecord() {
      const map = this.$state.getters.game;
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
      setInterval(() => {
        if (this.singo < 1000) {
          this.singo++;
        } else {
          this.singo = 0;
        }
      }, 500);
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
    },
    // 检测游戏是否可以开始
    checkGame() {
      let isOk = false;
      // gameWS正常连接
      isOk = this.$store.dispatch("testConnect");
      if (!isOk) {
        return isOk;
      }
      // store.game 存在

      return isOk;
    },
  },
  created() {
    // 检测webscoket连接
    let status = this.checkGame();
    if (!status) {
      this.$router.push("/");
      return;
    }
    this.game = this.$store.getters.game;
    this.$appHelper.setWidthBack();
    this.startWorker();
    window.cVue = this;
    window.store = cVue.$store;
  },
};
</script>

<style lang="scss">
#gameCore {
  width: 100%;
  height: 100%;
  position: relative;
  color: rgb(129, 0, 0);
  .el-container {
    width: 65%;
    height: 100%;
    float: left;
    border: 1px solid #eee;
    padding-right: 20px;
  }
  .el-main {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    &:hover {
      cursor: pointer;
    }
    .base_map {
      cursor: hand;
      position: absolute;
      img {
        float: left;
      }
    }
  }
}
</style>