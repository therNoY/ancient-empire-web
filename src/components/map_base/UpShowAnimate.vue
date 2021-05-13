<template>
  <div>
    <!--升级-->
    <div class="level_up" v-if="showLevelUp">
      <img
        :src="upImg"
        :style="style"
      />
    </div>
  </div>
</template>

<script>
export default {
  props:{
  },
  data() {
    return {
      
    }
  },
  computed: {
    style(){
      let top = (this.site.row - 1) * 24 + "px";
      let left = (this.site.column - 2) * 24 + "px";
      return {top: top, left: left}
    },
    upImg(){
      return this.$appHelper.getTemplateImg(this.value);
    },
    showLevelUp(){
      return this.$store.getters.actionState.levelUpInfo;
    },
    site(){
      return this.$store.getters.actionState.levelUpSite;
    }
  }
};
</script>

<style lang="css" scoped>
.level_up img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
</style>