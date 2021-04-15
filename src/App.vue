<template>
  <div id="app">
    <router-view />
    <ae-loading></ae-loading>
    <ae-tip v-model="showGlableTip" :closeTip="closeTip" @ok="tipOk"></ae-tip>
    <!-- <ae-message></ae-message> -->
  </div>
</template>

<script>
import AeLoading from "./components/frame/AeLoading.vue";
import AeMessage from "./components/frame/AeMessage.vue";
import AeTip from "./components/frame/AeTip.vue";
export default {
  components: { AeLoading, AeMessage, AeTip },
  name: "App",
  data() {
    return {
      showGlableTip: false,
      callback: null,
      closeTip: null,
    };
  },
  methods: {
    showTip({ message, callback, invoke }) {
      this.showGlableTip = true;
      this.closeTip = message;
      this.callback = callback;
    },
    tipOk() {
      if (this.callback && this.callback instanceof Function
      ) {
        this.callback();
      }
    },
  },
  created() {
    this.$eventBus.regist(this, "showTip", "showTip");
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
.el-tabs__item{
  color: white;
}
.el-form-item__label {
  color: aliceblue !important;
}
</style>
