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
</style>
