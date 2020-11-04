<template>
  <div class="army_mes">
    <!--当前回合信息-->
    <div class="bar_mes">
      <el-tooltip content="金币1" placement="top" effect="light">
        <div>
          <img src="../../../assets/images/assist/bar_money.png" />
          <span>{{ currentArmy.money }}</span>
        </div>
      </el-tooltip>

      <el-tooltip content="人口" placement="top" effect="light">
        <div>
          <img src="../../../assets/images/assist/bar_pop.png" />
          <span>{{ currentArmy.pop }} / {{ currentArmy.max_pop }}</span>
        </div>
      </el-tooltip>

      <el-tooltip content="回合数" placement="top" effect="light">
        <div>
          <img src="../../../assets/images/assist/bar_round.png" />
          <span>{{ currentArmy.current_round }}</span>
        </div>
      </el-tooltip>

      <el-tooltip content="阵营" placement="top" effect="light">
        <div>
          <img src="../../../assets/images/assist/bar_camp.png" />
          <span>{{ currentArmy.camp }}</span>
        </div>
      </el-tooltip>
    </div>
    <div class="bar_button">
      <el-button size="mini" type="primary">主菜单</el-button>
      <el-button size="mini" type="primary">小地图</el-button>
      <el-button size="mini" type="primary">保存游戏</el-button>
      <el-button size="mini" type="primary">结束回合</el-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentArmy() {
      let game = this.$store.getters.game;
      let currArmy = game.army_list[game.curr_army_index];
      currArmy.max_pop = game.max_pop;
      currArmy.current_round = game.current_round;
      return currArmy;
    },
  },
};
</script>

<style lang="scss" scoped>
.army_mes {
  margin-top: 10px;
  .bar_mes {
    margin-top: 4px;
    float: left;
  }
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
</style>