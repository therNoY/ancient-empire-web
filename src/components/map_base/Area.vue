<template>
  <div>
    <img
        src="../../assets/images/assist/alpha.png"
        @click="showAimArea(moveArea.row, moveArea.column)"
        :style="{
          top: $appHelper.getPosition(moveArea.row),
          left: $appHelper.getPosition(moveArea.column, 2),
        }"
      />
  </div>
</template>

<script>
  export default {
    props:["row","column"]
  }
</script>

<style lang="scss" scoped>

</style>