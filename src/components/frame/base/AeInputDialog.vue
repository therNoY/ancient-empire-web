<template>
  <ae-base-dialog :title="title" v-model="showModel">
    <ae-input
      v-model="inputValue"
      :label="label"
      :placeholder="placeholder"
    ></ae-input>

    <ae-button-list
      :buttonList="buttonList"
      @onClick="onClick"
    ></ae-button-list>
  </ae-base-dialog>
</template>

<script>
import dialogShow from "@/mixins/frame/dialogShow.js";

export default {
  mixins: [dialogShow],
  props: {
    title: {
      type: String,
      default: "请输入",
    },
    label: {
      type: String,
      default: null,
    },
    buttonList: {
      type: Array,
      default: () => ["确定", "取消"],
    },
    placeholder: {
      type: String,
      default: "请输入...",
    },
  },
  data() {
    return {
      inputValue: null,
    };
  },
  methods: {
    onDialogCreate() {
      this.inputValue = null;
    },
    onClick(index) {
      if (index == 0) {
        if (this.inputValue === null || this.inputValue === '') {
          this.$appHelper.errorMsg("输入不能为空!!");
          return;
        }
        this.$emit("input", false);
        this.$emit("ok", this.inputValue);
        this.$emit("close");
      } else {
        this.$emit("input", false);
        this.$emit("close");
      }
    },
  },
};
</script>

<style>
</style>
