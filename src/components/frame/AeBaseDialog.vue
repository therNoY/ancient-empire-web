<template>
  <div class="ae-base-dialog-container" v-if="value">
    <div class="ae-base-dialog-popup" :style="popupStyle">
      <div class="ae-base-dialog-popup-header">
        <span>{{ title }}</span>
        <button type="button" class="btn-close" @click="close">x</button>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      default: '42',
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    close() {
      console.log("close  close");
      this.$emit("input", false);
      this.$emit("close");
    },
  },
  computed: {
    popupStyle() {
      if ((this.width + "").indexOf("px") > 0) {
        return {
          width: this.width,
        };
      }
      return {
        width: this.width + "%",
      };
    },
  },
};
</script>

<style lang="scss" scope>
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
.ae-base-dialog-popup-header {
  color: #b0b8ac;
  justify-content: space-between;
  margin-top: 2%;
  span {
    font-size: 18px;
  }
}

.btn-close {
  border: none;
  font-size: 20px;
  cursor: pointer;
  float: right;
  font-weight: bold;
  color: #b0b8ac;
  background: transparent;
}
</style>