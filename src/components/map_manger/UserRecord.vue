<template>
  <div class="container">
    <div class="popup">
      <header class="popup-header">
        <slot name="header">
          <span class="title">存档列表</span>
          <button type="button" class="btn-close" @click="close">x</button>
        </slot>
      </header>
      <section class="popup-body">
        {{ userRecordInfoList }}

      </section>
      <footer>
        <slot name="footer">
          <button class="info_but">登出</button>
          <button class="info_but">确定</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
import { getUserRecordList } from "@/api";
export default {
  props: ["isDisable"],
  data() {
    return {
      willChange: false,
      userRecordInfoList: {},
      queryCondition: "",
    };
  },

  methods: {
    close() {
      this.$emit("close");
    },
  },
  created() {
      let queryInfo = {};
      queryInfo.condition = this.queryCondition;
      getUserRecordList(queryInfo).then((resp) => {
        if (resp && resp.resp_code) {
          this.userRecordInfoList = resp.resp_value;
        }
      });
    },
};
</script>

<style lang="scss" scope>
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
.popup-header {
  color: #b0b8ac;
  justify-content: space-between;
}
.popup-body {
  color: rgb(255, 255, 255);
  font-size: 17px;
  font-weight: 530;
  -webkit-text-stroke: 0.4px #000000;
  position: relative;
}

.popup-body span {
  float: left;
  font-size: 14px;
  color: red;
}
.popup-body a {
  font-size: 14px;
  float: right;
}
.popup-body a:hover {
  cursor: pointer;
  color: #b0b8ac;
  text-decoration: underline;
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
.info_but {
  float: right;
  margin-right: 20%;
  margin-bottom: 10px;
  height: 30px;
  width: 20%;
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