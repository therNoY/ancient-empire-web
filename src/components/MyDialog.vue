<template>
  <div class="container">
    <div class="popup">
      <header class="popup-header">
        <slot name="header">
          <button type="button" class="btn-close" @click="close">x</button>
        </slot>
      </header>
      <section class="popup-body">
          <slot />
      </section>
      <footer class="popup-footer">
        <slot name="footer">
          <button type="button" class="btn-green" @click="login">登录</button>
          <button type="button" class="btn-green" @click="close">确定</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "popup",
  methods: {
    close() {
      this.$emit("close");
    },
    login() {
      this.$emit("login");
    }
  }
};
</script>

<style>
.container {
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
.popup {
  background: #242a43;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}
.popup-footer {
  padding: 15px;
}
.popup-header {
  color: #b0b8ac;
  justify-content: space-between;
}
.popup-footer {
  justify-content: flex-end;
}
.popup-body {
  color: rgb(255, 255, 255);
  font-size: 17px;
  font-weight: 530;
  -webkit-text-stroke: 0.4px #000000;
  position: relative;
  padding: 30px 80px;
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
.btn-green {
  float: left;
  margin-top: 5%;
  margin-left: 15%;
  height: 40px;
  width:30%;
  color: rgb(255, 255, 255);
  font-size: 16px;
  cursor: pointer;
  -webkit-text-stroke: 0.4px #000000;
  background-color: #5a5c59;
  border-top: 2px #818181 solid;
  border-left: 2px #818181 solid;
  border-right: 2px #494949 solid;
  border-bottom: 2px #494949 solid;
}
</style>