<!--简单显示单位-->
<template>
  <div v-if="unit_id">
    <img v-show="singo % 2 == 0" :src="unitImg" />
    <img v-show="singo % 2 != 0" :src="unitImg2" />
  </div>
</template>

<script>
export default {
  props: {
    unit_id: {},
    color: {
      type: String,
      default: "blue",
    },
    singo: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    unitImg() {
      return this.$appHelper.getUnitImg(this.unit_id, this.color);
    },
    unitImg2() {
      return this.$appHelper.getUnitImg(this.unit_id, this.color, "_2");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>