<template>
  <!--坟墓-->
  <div class="tomb">
    <img
      v-for="(tomb,index) in tombs"
      :key="index"
      src="../../assets/images/unit/tomb.png"
      @click="operationTomb(tomb)"
      :style="{
        top: $appHelper.getPosition(tomb.row),
        left: $appHelper.getPosition(tomb.column),
      }"
    />
  </div>
</template>

<script>
import eventype from "../../manger/eventType";
export default {
  props:{
  },
  methods:{
    // 鼠标点击坟墓
    operationTomb(tomb) {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_TOMB, tomb);
      }
    },
    tombs() {
      return this.$store.getters.game.tomb_list;
    },
  }
};
</script>

<style lang="scss" scoped>
.tomb img {
  position: absolute;
  cursor: pointer;
}
</style>