<template>
  <div class="army_mes" :style="$appHelper.getBkColor(curr_color)">
    <!--当前回合信息-->
    <div class="bar_mes">
      <el-tooltip content="金币" placement="top" effect="light">
        <div>
          <img src="../../../assets/images/assist/bar_money.png" />
          <span>&nbsp;{{ currentArmy.money }}</span>
        </div>
      </el-tooltip>

      <el-tooltip content="人口" placement="top" effect="light">
        <div>
          <img src="../../../assets/images/assist/bar_pop.png" />
          <span>&nbsp;{{ currentArmy.pop }} / {{ currentArmy.max_pop }}</span>
        </div>
      </el-tooltip>

      <el-tooltip content="回合" placement="top" effect="light">
        <div>
          <img src="../../../assets/images/assist/bar_round.png" />
          <span>&nbsp;&nbsp;{{ currentArmy.current_round }}</span>
        </div>
      </el-tooltip>

      <el-tooltip content="阵营" placement="top" effect="light">
        <div>
          <img src="../../../assets/images/assist/bar_camp.png" />
          <span>&nbsp;&nbsp;{{ currentArmy.camp }}</span>
        </div>
      </el-tooltip>
    </div>
    <div class="bar_button">
      <el-button size="mini" :type="getButtonType" @click="goHome"
        >主菜单</el-button
      >
      <!-- <el-button size="mini" :type="getButtonType">小地图</el-button> -->
      <el-button size="mini" v-if="type == 'encounter'" :type="getButtonType" @click="saveRecord"
        >保存游戏</el-button
      >
      <el-button size="mini" :type="getButtonType" @click="roundEnd"
        >结束回合</el-button
      >
    </div>

    <!--保存地图-->
    <ae-base-dialog title="保存记录" v-model="saveRecordDialog" :width="30">
      <div style="padding: 2%">
        <ae-input
          v-model="saveRecordName"
          label="记录名字"
          placeholder="请输入要保存的记录的名字"
        ></ae-input>
      </div>

      <ae-button
        style="margin-left: 65%; margin-top: 5%"
        :width="65"
        @onClick="saveDraftRecord"
        >确 定</ae-button
      >
    </ae-base-dialog>
  </div>
</template>

<script>
import eventype from "../../../manger/eventType";
import {RecordSaveAs} from "@/api"
export default {
  props: ["curr_color", "gameId", "type"],
  data(){
    return{
      saveRecordDialog:false,
      saveRecordName:null,
    }
  },
  methods: {
    roundEnd() {
      this.$appHelper.sendEvent(eventype.ROUND_END);
    },
    goHome() {
      this.$appHelper.showTip("确定要返回首页么? 游戏将会断开", () => {
        this.$router.push("/");
      });
    },
    saveRecord() {
      this.saveRecordDialog = true;
    },
    saveDraftRecord(){
      this.$appHelper.setLoading();
      let args = {};
      args.uuid = this.gameId;
      args.name = this.saveRecordName;
      RecordSaveAs(args).then(resp=>{
        this.$appHelper.infoMsg("保存成功")
        this.$appHelper.setLoading();
        this.saveRecordDialog = false;
      }).catch(error=>{
        this.$appHelper.setLoading();
      });
    },
  },
  computed: {
    currentArmy() {
      let game = this.$store.getters.game;
      let currArmy = game.army_list[game.curr_army_index];
      currArmy.max_pop = game.max_pop;
      currArmy.current_round = game.current_round;
      return currArmy;
    },
    getButtonType() {
      let color = this.curr_color;
      let bkColor = "primary";
      if (color) {
        if (color == "blue") {
          bkColor = "primary";
        } else if (color == "red") {
          bkColor = "danger";
        } else if (color == "green") {
          bkColor = "success";
        } else if (color == "black") {
          bkColor = "info";
        }
      }
      return bkColor;
    },
  },
};
</script>

<style lang="scss" scoped>
.army_mes {
  height: 100%;
  width: 100%;
  .bar_mes {
    margin-top: 15px;
    width: 40%;
    float: left;
    .el-tooltip {
      float: left;
      width: 60px;
      font-size: 13px;
      margin-right: 10px;
      img {
        margin-top: 3px;
        float: left;
      }
      span {
        display: block;
        float: left;
      }
    }
  }
  .bar_button {
    float: right;
    width: 60%;
    margin-top: 10px;
  }
}
</style>