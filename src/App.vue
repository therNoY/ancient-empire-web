<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
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
/*士兵*/
.unit_soldier {
  clip: rect(0px, 24px, 24px, 0px);
}
.unit_soldier2 {
  clip: rect(24px, 24px, 48px, 0px);
}
/*弓手*/
.unit_archer {
  clip: rect(0px, 48px, 24px, 24px);
}
.unit_archer2 {
  clip: rect(24px, 48px, 48px, 24px);
}
/*水元素*/
.unit_water_element {
  clip: rect(0px, 72px, 24px, 48px);
}
.unit_water_element2 {
  clip: rect(24px, 72px, 48px, 48px);
}
/*女巫*/
.unit_witch {
  clip: rect(0px, 96px, 24px, 72px);
}
.unit_witch2 {
  clip: rect(24px, 96px, 48px, 72px);
}
/*精灵*/
.unit_elf {
  clip: rect(0px, 120px, 24px, 96px);
}
.unit_elf2 {
  clip: rect(24px, 120px, 48px, 96px);
}
/*狼*/
.unit_wolf {
  clip: rect(0px, 144px, 24px, 120px);
}
.unit_wolf2 {
  clip: rect(24px, 144px, 48px, 120px);
}
/*石头人*/
.unit_stone {
  clip: rect(0px, 168px, 24px, 144px);
}
.unit_stone2 {
  clip: rect(24px, 168px, 48px, 144px);
}
/*投石器*/
.unit_catapult {
  clip: rect(0px, 192px, 24px, 168px);
}
.unit_catapult2 {
  clip: rect(24px, 192px, 48px, 168px);
}
/*龙*/
.unit_dragon {
  clip: rect(0px, 216px, 24px, 192px);
}
.unit_dragon2 {
  clip: rect(24px, 216px, 48px, 192px);
}
/*领主*/
.unit_loader {
  clip: rect(0px, 240px, 24px, 216px);
}
.unit_loader2 {
  clip: rect(24px, 240px, 48px, 216px);
}
</style>
