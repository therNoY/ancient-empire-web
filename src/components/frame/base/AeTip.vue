<template>
  <div>
    <div class="ae-base-dialog-container" style="z-index: 9999" v-if="value">
      <div class="ae-base-dialog-popup" style="width: 25%">
        <div class="ae-close-tip" v-html="closeTip"></div>
        <ae-button-list
          :buttonList="buttonList"
          @onClick="onClick"
        ></ae-button-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    closeTip: {
      type: String,
      default: "确定么?",
    },
    value: {
      type: Boolean,
      default: false,
    },
    buttonList: {
      type: Array,
      default: () => ["确定", "取消"],
    },
  },
  data() {
    return {};
  },
  methods: {
    onClick(index) {
      if (index == 0) {
        this.$emit("input", false);
        this.$emit("ok");
        this.$emit("close");
      } else {
        this.$emit("input", false);
        this.$emit("close");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-base-dialog-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(167, 167, 167, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.ae-base-dialog-popup {
  background: #242a43;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  border: 2px #afb7aa solid;
  box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.692);
  padding-left: 1%;
  padding-right: 1%;
  padding-bottom: 1%;
}

.ae-close-tip {
  font-size: 16px;
  color: rgb(195, 195, 195);
  margin-top: 8%;
  margin-bottom: 8%;
}
</style>
