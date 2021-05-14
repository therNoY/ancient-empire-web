<!--按钮集合-->
<template>
  <div class="ae-button-list" v-if="buttonList.length > 0">
    <div
      v-for="(button, index) in buttonList"
      :key="index"
      class="ae-button-list-item"
    >
      <ae-button
        v-if="index == 0"
        :size="size"
        :width="buttonWidth"
        @onClick="onClick(index)"
        :marginLeft="buttonMarginLeft / 2"
      >
        {{ button }}
      </ae-button>
      <ae-button
        @onClick="onClick(index)"
        v-else
        :size="size"
        :width="buttonWidth"
        :marginLeft="flontLeft"
      >
        {{ button }}
      </ae-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttonConfig: {
      type: Function,
      default: null,
    },
    buttonList: {
      type: Array,
      default: () => [],
    },
    clickAction: {
      type: Array,
      default: () => [],
    },
    factor: {
      type: Number,
      default: 50,
    },
    size:{
       type: Number,
      default: 0.75,
    }
  },
  methods: {
    onClick(index) {
      this.$emit("onClick", index);
      if (
        this.clickAction &&
        this.clickAction[index] &&
        this.clickAction[index] instanceof Function
      ) {
        this.clickAction[index]();
      }
    },
  },
  created() {
    if (this.buttonConfig) {
      let res = this.buttonConfig();
      if (res instanceof Array) {
        this.buttonList = res[0];
        this.clickAction = res[1];
      }
    }
  },
  computed: {
    buttonWidth() {
      return this.factor / this.buttonList.length;
    },
    flontLeft() {
      return (100 - this.factor) / this.buttonList.length;
    },
    buttonMarginLeft() {
      return 36 / this.buttonList.length;
    },
  },
};
</script>

<style>
.ae-button-list {
  width: 100%;
}
.ae-button-list-pine {
  width: 100%;
}
</style>
