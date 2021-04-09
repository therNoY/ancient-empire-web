<template>
  <div id="gameCore">
    <unit-mes
      :bg_color="game.bg_color"
      :curr_color="game.curr_color"
      :unitInfo="game.curr_unit"
      :region="game.curr_region"
    />
    <div class="game_core_container">
      <el-container>
        <el-main>
          <div class="base_map" :style="mapStyle">
            <region-view-list
              ref="regionViewList"
              :regions="game.game_map.regions"
              :row="game.game_map.row"
              :column="game.game_map.column"
              @clickRegion="clickRegion"
            />
            <attach-view />
            <tomb-view :tombs="tombs"/>
            <move-area :point="game.curr_point" />
            <army-view @unitOnClick="clickUnit" :armys="game.army_list" :singo="singo" />
            <point-view :point="game.curr_point" :singo="singo" />
            <action-view />
            <left-change />
            <animate-view  />
            <up-show-animate v-model="$store.getters.actionState.levelUpInfo"
            :site="$store.getters.actionState.levelUpSite"
            ></up-show-animate>
          </div>
        </el-main>
      </el-container>
      <army-mes class="army_mes" :curr_color="game.curr_color" />
    </div>

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
import eventype from "../../manger/eventType";
import UpShowAnimate from '../map_base/UpShowAnimate.vue';
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
    UpShowAnimate,
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
      let mapCount = document.body.clientWidth * 0.65;
      let w = this.game.game_map.column * 24;
      if (mapCount > w) {
        return {
          float: "left",
          marginLeft: (mapCount - w) / 2 + "px",
          width: w + "px",
          height: this.$appHelper.getMapSize(this.game.game_map.row),
        };
      } else {
        return {
          width: w + "px",
          height: this.$appHelper.getMapSize(this.game.game_map.row),
        };
      }
    },
    tombs(){
      return this.$store.getters.game.tomb_list; 
    }
  },
  methods: {
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
      let isOk = true;
      // gameWS正常连接
      // isOk = this.$store.dispatch("testConnect");
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
    clickRegion(index) {
      // 点击了其他的单位 或者已经行动过了
      if (this.$appHelper.isPlayer(this)) {
        this.$appHelper.sendEvent(eventype.CLICK_REGION, null, null, index);
      }
    },
    clickUnit(unit) {
      if (this.$appHelper.isPlayer(this)) {
        if (
          this.$store.getters.game.curr_color == unit.color &&
          !unit.done
        ) {
          // 点击了自己的可以行动的单位
          this.$appHelper.sendEvent(eventype.CLICK_ACTIVE_UNIT, {
            row: Math.round(unit.row),
            column: Math.round(unit.column),
          });
        } else {
          // 点击了其他的单位 或者已经行动过了
          this.$appHelper.sendEvent(eventype.CLICK_UN_ACTIVE_UNIT, {
            row: Math.round(unit.row),
            column: Math.round(unit.column),
          });
        }
      }
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
  .unit-mes {
    float: left;
    width: 16%;
  }
  .game_core_container {
    height: 100%;
    float: left;
    width: 68%;
    .el-container {
      width: 100%;
      height: 90%;
      float: left;
      .el-main {
        width: 100%;
        height: 94%;
        margin-top: 2%;
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
    .army_mes {
      float: left;
      height: 10%;
    }
  }

  .region-mes {
    width: 16%;
    height: 100%;
  }
}
</style>