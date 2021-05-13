<template>
  <div class="delete_black">
    <slot></slot>
    <span @click="clickPoint">
      <sup v-if="disabled" class="delete_content" style="cursor:not-allowed">{{ value }}</sup>
      <sup v-else class="delete_content" style="cursor: pointer;">{{ value }}</sup>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    disabled:{
      type:Boolean,
      default:false,
    },
    value: {
      type: String,
      default: "×",
    },
  },
  methods: {
    clickPoint() {
      if (!this.disabled) {
        this.$emit("clickPoint");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.delete_black {
  position: relative;
  vertical-align: middle;
  display: inline-block;
}
.delete_content {
  background-color: #f56c6cd2;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
  position: absolute;
  top: -5px;
  right: -10px;
  height: 14px;
  width: 14px;
  font-size: 12px;
  padding: 1px;
  border-radius: 10px;
  line-height: 14px;
  
  :hover {
    background-color: #f56c6c;
  }
}
</style>