<template>
  <div id="app">
    <router-view />
    <ae-loading style="z-index: 99999"></ae-loading>
    <ae-tip
      v-model="showGlobalTip"
      :buttonList="buttonList"
      :closeTip="closeTip"
      @ok="tipOk"
    ></ae-tip>
    <ae-input-dialog
      ref="aeInputDialog"
      :title="inputDialog.title"
      :label="inputDialog.label"
      :placeholder="inputDialog.placeholder"
      v-model="showGlobalInputDialog"
      @ok="inputDialogOk"
    ></ae-input-dialog>
    <ae-message
      :mes="mes"
      :show="show"
      :type="type"
      style="z-index: 999999"
    ></ae-message>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      showGlobalTip: false,
      showGlobalInputDialog: false,
      tipCallback: null,
      inputCallback: null,
      closeTip: null,
      inputDialog:{
        title:null,
        label:null,
        placeholder:"请输入..."
      },
      mes: null,
      show: false,
      type: "info",
      buttonList: undefined,
    };
  },
  methods: {
    showTip({ message, callback, buttonList }) {
      (this.buttonList = buttonList), (this.showGlobalTip = true);
      this.closeTip = message;
      this.tipCallback = callback;
    },
    showMessage({ type, mes }) {
      this.type = type;
      this.mes = mes;
      if (this.show) {
        return;
      }
      this.show = true;
      setTimeout(() => {
        this.show = false;
      }, 1000);
    },
    showInputDialog({ title, label, placeholder, callback }) {
      this.inputDialog.title = title;
      this.inputDialog.label = label;
      this.inputDialog.placeholder = placeholder;
      this.showGlobalInputDialog = true;
      this.inputCallback = callback;
    },
    tipOk() {
      if (this.tipCallback && this.tipCallback instanceof Function) {
        this.tipCallback();
      }
    },
    inputDialogOk(res){
      if (this.inputCallback && this.inputCallback instanceof Function) {
        this.inputCallback(res);
      }
    }
  },
  created() {
    this.$eventBus.regist(this, "showTip");
    this.$eventBus.regist(this, "showMessage");
    this.$eventBus.regist(this, "showInputDialog");
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #464846;
}
html,
body,
#app {
  height: 100%;
  width: 100%;
}
button:focus,
button:active:focus,
button.active:focus,
button.focus,
button:active.focus,
button.active.focus {
  outline: none;
  border-color: transparent;
  box-shadow: none;
  color: #fff;
}
.el-dialog {
  margin-top: 5vh !important;
}
.el-dialog__header {
  padding: 1% 3%;
}
.el-dialog__title {
  font-size: 13px;
}
.el-dialog__body {
  padding: 3% 3%;
  background: white;
  width: 94%;
  float: left;
}
.el-rate__icon {
  font-size: 14px;
  margin-right: 0px;
  width: 50%;
}
.el-table th {
  padding: 8px, 0 !important;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #5a5c59 !important;
}
input:-webkit-autofill {
  -webkit-text-fill-color: #ffffff !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
.el-table::before {
  z-index: -1;
}
.el-tabs__item {
  color: white;
}
.el-form-item__label {
  color: aliceblue !important;
}
.el-upload {
  text-align: left;
  width: 100%;
}
</style>
