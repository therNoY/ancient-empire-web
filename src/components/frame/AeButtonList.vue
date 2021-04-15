<!--按钮集合-->
<template>
  <div class="ae-button-list" v-if="buttonList.length > 0">
    <div
      v-for="(button, index) in buttonList"
      v-bind:key="index"
      class="ae-button-list-item"
    >
      <ae-button
        v-if="index == 0"
        :width="buttonWidth"
        @onClick="onClick(index)"
        :marginLeft="buttonMarginLeft / 2"
      >
        {{ button }}
      </ae-button>
      <ae-button
        @onClick="onClick(index)"
        v-else
        :width="buttonWidth"
        :marginLeft="buttonWidth"
      >
        {{ button }}
      </ae-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttonList: {
      type: Array,
      default: [],
    },
    clickAction: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onClick(index) {
      this.$emit("onClick", index);
      if (this.clickAction && this.clickAction[index] && this.clickAction[index] instanceof Function) {
        this.clickAction[index]();
      }
    },
  },
  computed: {
    buttonWidth() {
      return 50 / this.buttonList.length;
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