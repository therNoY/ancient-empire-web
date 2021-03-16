<template>
  <transition name="msg" appear>
    <div
      :class="['box-item', boxClass]"
      v-if="info.show"
      :style="{ top: info.top + 'px' }"
    >
      <div class="msg-container">
        {{ info.msg }}
      </div>
      <span>
        <i class="iconfont icon-cc-close"></i>
      </span>
    </div>
  </transition>
</template>


<script >
export default {
  data() {
    return {
      info: {
        show: true,
        msg: "ddddddd",
        type: "info",
        top: "20",
      },
    };
  },
  created() {
    window.AeMessage = this;
  },
  computed: {
    boxClass() {
      const type = this.info.type;
      return type ? `box-item-${type}` : "";
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.box-item {
  height: 10px;
  position: fixed;
  min-width: 380px;
  // element-ui抄来的样式
  border-width: 1px;
  border-style: solid;
  border-color: #ebeef5;
  border-radius: 4px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background-color: #edf2fcbe;
  transition: opacity 0.3s, transform 0.4s, top 0.4s;
  padding: 15px 15px 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &-success {
    background-color: #f0f9ebb9;
    border-color: #e1f3d8;
  }
  &-warning {
    background-color: #fdf6ecc5;
    border-color: #faecd8;
  }
  &-error {
    background-color: #fef0f0c9;
    border-color: #fde2e2;
  }
}

.msg-container {
  display: flex;
  align-items: center;
  .iconfont {
    margin-right: 5px;
  }
}

.msg-enter-active {
  animation: anim 0.5s;
}

.msg-leave-active {
  animation: anim 0.5s reverse;
}

@keyframes anim {
  0% {
    opacity: 0;
    transform: translate(-50%, -200%);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>