<template>
  <div>
    <!--展示单位可以进行行动 攻击 召唤 购买 修复-->
    <div class="actionLogo" v-if="mapStatus == 'showAction'" v-for="action in unitActions">
      <img
        :src="$appHelper.getActionImg(action.name)"
        @click="doAction(action.name)"
        :style="{top: $appHelper.getUnitPosition(action.row), left: $appHelper.getUnitPosition(action.column)}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["mapStatus", "unitActions"],
  methods: {
    // 展示单位将要进行的行动
    doAction(name) {
      if (name == "attack") {
        // 攻击
        this.$store.dispatch("getAttachArea");
        this.$store.commit("setMapStatus", "willAttach");
        this.$store.commit("changeBeAttachUnit", {});
      } else if (name == "end") {
        // 结束
        this.$store.dispatch("getEndResult");
        this.$store.commit("setMapStatus", "noAction");
      } else if (name == "buy") {
        // 购买
        this.$store.commit("changeLordWillBuy", true);
        this.$store.dispatch("getCanByUnit");
      } else if (name == "move") {
        // 将军移动
        this.$store.commit("setMapStatus", "end");
        // 获取可移动区域
        let indexInfo = {};
        indexInfo.index = this.$store.getters.mapSt.currentUnitIndex;
        this.$store.commit("changeMoveArea", []);
        this.$store.dispatch("getMoveArea", indexInfo);
      } else if (name == "occupied") {
        // 占领
        this.$store.dispatch("getOccupiedResult");
      }else if (name == "repair") {
        // 修复
        this.$store.dispatch("getRepairResult");
      } else if (name == "summon") {
        // 召唤
        this.$store.dispatch("getAttachArea");
        this.$store.commit("setMapStatus", "willSummon");
      } else {
        alert(1);
      }
    }
  }
};
</script>

<style lang="css" scoped>
.actionLogo img {
  position: absolute;
  cursor: pointer;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
</style>