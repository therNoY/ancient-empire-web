<template>
  <!--展示特效-->
  <div>
    <div v-for="(animate,index) in animates" :key="index">
      <img
        v-if="animate"
        :src="animate.animImg"
        :style="{
          top: $appHelper.getPosition(animate.row),
          left: $appHelper.getPosition(animate.column),
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    animates() {
      return this.$store.getters.animates;
    },

  },
};
</script>

<style lang="scss" scoped>
img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
</style>