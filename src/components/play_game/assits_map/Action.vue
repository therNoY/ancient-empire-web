<template>
  <div>
    <!--展示单位可以进行行动 攻击 召唤 购买 修复-->
    <div class="actionLogo" v-if="mapStatus == 'showAction'" v-for="action in unitActions">
      <img
        :src="actionImg(action.name)"
        @click="doAction(action.name)"
        :style="{top: position(1, action.row), left: position(1, action.column)}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["mapStatus", "unitActions"],
  computed: {
    position() {
      return function(num, row) {
        return (row - num) * 24 + "px";
      };
    },
    // 根据单位的action名字 来计算出图片
    actionImg() {
      return function(name) {
        return require("../../../assets/images/assist/action_" + name + ".png");
      };
    }
  },
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
        this.$store.commit("setMapStatus", "buy");
      } else if (name == "move") {
        // 将军移动
        this.$store.commit("setMapStatus", "end");
        // 获取可移动区域
        let indexInfo = {};
        indexInfo.index = this.$store.getters.mapSt.currentUnitIndex;
        this.$store.commit("changeMoveArea", []);
        this.$store.dispatch("getMoveArea", indexInfo);
      } else if (name == "occupied") {
        // 占领/修复
        this.$store.commit("setMapStatus", "end");
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