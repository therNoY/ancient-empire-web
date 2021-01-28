<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #464846;
}
html,body,#app{
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
.el-dialog{
  margin-top: 5vh !important;
}
.el-dialog__header{
  padding:  1% 3%;
}
.el-dialog__title{
  font-size: 13px;
}
.el-dialog__body {
    padding:  3% 3%;
    background: white;
    width: 94%;
    float: left;
}
.el-rate__icon {
  font-size: 14px;
  margin-right: 0px;
  width: 50%;
}
.el-table th{
  padding: 8px, 0 !important;
}
</style>
