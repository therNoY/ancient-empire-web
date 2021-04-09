<template>
  <div id="app">
    <router-view />
    <ae-loading></ae-loading>
    <!-- <ae-message></ae-message> -->
  </div>
</template>

<script>
import AeLoading from "./components/frame/AeLoading.vue";
import AeMessage from "./components/frame/AeMessage.vue";
export default {
  components: { AeLoading, AeMessage },
  name: "App",
  data() {
    return {};
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
</style>
