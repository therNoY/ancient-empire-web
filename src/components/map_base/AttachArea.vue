<template>
  <div v-if="attachArea.length > 0">
    <!--攻击范围区域-->
    <div class="attach_area" v-for="attachArea in attachArea">
      <img
        src="../../assets/images/assist/alpha.png"
        @click="clickAttachArea(attachArea)"
        :style="{
          top: $appHelper.getPosition(attachArea.row),
          left: $appHelper.getPosition(attachArea.column),
        }"
      />
    </div>
  </div>
</template>

<script>
import eventype from "../../manger/eventType";
export default {
  computed: {
    attachArea() {
      return this.$store.getters.attachArea;
    },
  },
  methods: {
    clickAttachArea(site) {
      if (this.$appHelper.mapCanClick()) {
        this.$appHelper.sendEvent(eventype.CLICK_ATTACH_AREA, site);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.attach_area img {
  position: absolute;
  cursor: pointer;
  clip: rect(0px, 24px, 24px, 0px);
}
</style>