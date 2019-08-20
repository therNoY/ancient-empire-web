<template>
  <div>
    <div>
      <button v-on:click="makeFade">fade</button>
      <transition name="fade">
        <p class="army2" v-if="show"  :style="{top:top, left:left}">消失和出现</p>
      </transition>
    </div>

    <div>
      <button @click="show2 = !show2">slide-fade</button>
      <transition name="slide-fade">
        <p v-if="show2">hello</p>
      </transition>
    </div>

    <div v-show="false">
      <button @click="show3 = !show3">bounce</button>
      <transition name="bounce">
        <p v-if="show3">MESSAGE</p>
      </transition>
    </div>

    <span></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      top : "100px",
      left : "50px",
    };
  },
  methods: {
    makeFade() {
      this.show = !this.show
      this.top = "120px";
      this.left = "120px";
    }
  },
};
</script>

<style lang="css" scoped>
/*demo1*/
.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
/*demo2*/
.slide-fade-enter-active {
  transition: all 1s 66;
}
.slide-fade-leave-active {
  transition: all 1s linear;
}
.slide-fade-enter {
  transform: translateX(200px);
  opacity: 1;
}
.slide-fade-leave-to {
  transform: translateX(200px);
  opacity: 1;
}
/*demo3*/
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.army2 {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 80px;
  left: 20px;
  transition: all 0.5s linear;
  background-color: aquamarine;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>