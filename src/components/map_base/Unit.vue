<template>
  <div>
    <img v-if="unit_id" style="cursor: pointer;" :src="unitImg" />
  </div>
</template>

<script>
export default {
  props: {
    unit_id: {
      
    },
    color: {
      type: String,
      default: "blue",
    },
  },
  computed: {
    unitImg() {
      return this.$appHelper.getUnitImg(this.unit_id, this.color);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>