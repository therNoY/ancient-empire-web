<!-- 城堡的title -->
<template>
  <div>
    <img
      src="../../assets/images/Region/castle_title.png"
      @click="getCastleTitle(title.row, title.column)"
      :style="castleTitleStyle"
    />
  </div>
</template>

<script>
  export default {
    props:["title"],
    methods: {
      getCastleTitle(){

      }
    },
    computed: {
      castleTitleStyle(){
        return{
          top: this.$appHelper.getPosition(this.title.row),
          left: this.$appHelper.getPosition(this.title.column)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
div{
  img{
    position: absolute;
    pointer-events: none;
  }
}
</style>