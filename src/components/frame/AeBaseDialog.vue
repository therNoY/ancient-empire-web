<!--基础弹框-->
<template>
  <div class="ae-base-dialog-container" :style="dialogContiner" v-if="value">
    <div class="ae-base-dialog-popup" :style="popupStyle">
      <div class="ae-base-dialog-popup-header">
        <span>{{ title }}</span>
        <button type="button" class="btn-close" @click="close">x</button>
      </div>
      <div class="ae-base-dialog-popup-main">
        <slot />
      </div>
    </div>
    <ae-tip v-model="showTip" :closeTip="closeTip" @ok="closeOk"></ae-tip>
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
      default: "42",
    },
    title: {
      type: String,
      default: "",
    },
    closeTip: {
      type: String,
      default: "确定要关闭么?",
    },
    showCloseTip: {
      type: Boolean,
      default: false,
    },
    // fixedDialog为true的时候有用
    top:{
      type: Number,
      default: 10,
    },
    fixedDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showTip: false,
    };
  },
  methods: {
    close() {
      if (this.showCloseTip) {
        this.showTip = true;
      } else {
        this.$emit("input", false);
        this.$emit("close");
      }
    },
    closeOk() {
      this.$emit("input", false);
      this.$emit("close");
    },
  },
  computed: {
    dialogContiner() {
      if (!this.fixedDialog) {
        return {
          display: "flex",
          backgroundColor: "rgba(167, 167, 167, 0.3)",
          left: 0,
          top: 0,
        };
      } else {
        return {
          top: this.top + "%",
          left: (100 - this.width) / 2 + "%",
        };
      }
    },
    popupStyle() {
      if ((this.width + "").indexOf("px") > 0) {
        return {
          width: this.width,
        };
      }
      if (!this.fixedDialog) {
        return {
          width: this.width + "%",
        };
      } else {
        return {
          width: this.width * 1.3 + "%",
        };
      }
    },
  },
  watch:{
    value(v){
      if (v) {
        this.$emit("open");
      }
    }
  }
};
</script>

<style lang="scss" scope>
.ae-base-dialog-container {
  position: fixed;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.ae-base-dialog-popup {
  background: #242a43;
  box-shadow: 2px 2px 20px 1px;
  overflow-y: 10%;
  display: flex;
  flex-direction: column;
  border: 2px #afb7aa solid;
  box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.692);
  padding-left: 1%;
  padding-right: 1%;
  padding-bottom: 1%;
}
.ae-base-dialog-popup-main {
  padding-bottom: 2%;
}
.ae-base-dialog-popup-header {
  color: #b0b8ac;
  justify-content: space-between;
  margin-top: 15px;
  margin-bottom: 15px;
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

.ae-close-tip {
  font-size: 16px;
  color: rgb(195, 195, 195);
  margin-top: 8%;
  margin-bottom: 8%;
}
</style>
