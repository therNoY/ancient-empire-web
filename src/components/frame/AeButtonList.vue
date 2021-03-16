<template>
  <div class="ae-button-list" v-if="buttonList.length > 0">
    <div v-for="(button, index) in buttonList" v-bind:key="index">
      <ae-button
        v-if="index == 0"
        :width="buttonWidth"
        :marginLeft="buttonMarginLeft / 2"
        @onClick="onClick(index)"
      >
        {{ button }}
      </ae-button>
      <ae-button
        @onClick="onClick(index)"
        v-else
        :width="buttonWidth"
        :marginLeft="buttonMarginLeft"
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
  },
  methods: {
    onClick(index) {
      this.$emit("onClick", index);
    },
  },
  computed: {
    buttonWidth() {
      return 36 / this.buttonList.length;
    },
    buttonMarginLeft() {
      return 64 / this.buttonList.length;
    },
  },
};
</script>

<style>
.ae-button-list {
  width: 100%;
}
</style>