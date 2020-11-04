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
          <attach-view />
          <tomb-view />
          <move-area :point="game.curr_point" />
          <army-view :armys="game.army_list" :singo="singo" />
          <point-view :point="game.curr_point" :singo="singo" />
          <action-view />
          <left-change />
          <animate-view />
        </div>
      </el-main>
      <el-footer class="bars">
        <army-mes />
      </el-footer>
    </el-container>
    <region-mes
      :bg_color="game.bg_color"
      :curr_color="game.curr_color"
      :region="game.curr_region"
    />

    <buy-unit></buy-unit>
  </div>
</template>

<script>
import { GetRecordById, SaveUserRecord } from "@/api";
import RegionViewList from "../map_base/RegionViewList";
import ArmyView from "../map_base/ArmyView.vue";
import UnitMes from "./map_mes/UnitMes.vue";
import RegionMes from "./map_mes/RegionMes.vue";
import PointView from "../map_base/PointView.vue";
import MoveArea from "../map_base/MoveArea.vue";
import ActionView from "../map_base/ActionView.vue";
import AttachView from "../map_base/AttachArea.vue";
import LeftChange from "../map_base/LeftChangeView.vue";
import AnimateView from "../map_base/AnimateView.vue";
import TombView from "../map_base/TombView.vue";
import BuyUnit from "./unit_map/BuyUnit.vue";
import ArmyMes from "./map_mes/ArmyMes.vue";
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
    BuyUnit,
    ArmyMes,
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
    // 点击购买单位
    buyUnit() {
      console.log("购买单位");
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
  .el-floor {
    margin: auto;
    width: 100%;
    height: 10px;
    background: blanchedalmond;
  }
}
</style>