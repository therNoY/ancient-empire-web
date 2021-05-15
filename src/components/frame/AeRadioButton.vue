<!--修改el样式-->
<template>
  <el-radio-button :label="label" id="ae-radio-button">
    <slot></slot>
  </el-radio-button>
</template>

<script>
export default {
  props: {
    label: {},
  },
};
</script>

<style lang="scss">
#ae-radio-button {
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #5a5c59;
    border-color: #ffffff;
    box-shadow: -1px 0 0 0 #ffffff;
  }
}
</style>
