<template>
  <div>
    <button @click="changeLocation">动</button>
    <button @click="stop">停止</button>
    <button @click="changeFontStyle">变</button>
    <div ref="army" :class="{army: show==1, army2:show==2, army3:show==3}">
      12121
    </div>
    <div :style="{fontSize: fontSize + 'px', transitionDuration: (td*0.1) + 's'}">努力！奋斗</div>

    <button @click="move">move</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeColor: 'red',
      fontSize: 30,
      show: 1,
      timer: null,
      td : 5,
      top : "100px",
      left : "50px",
      look: false
    };
  },
  computed: {
  },
  methods: {
    move() {
      this.look = true;
      setTimeout(this.movelOgo, 1);
    },
    async movelOgo() {
      console.log("??");
      this.top  = "120px";
      this.left = "60px";
    },
    changeFontStyle() {
      this.fontSize = this.fontSize -5; 
      this. td = this.td + this.td
    },
    addShow() {
      console.log(this.show);
      this.show++;
      if (this.show >= 3) {
        window.clearInterval(this.timer);
      }
    },
    stop() {
      console.log(this.timer);
      console.log(this.show);
      window.clearInterval(this.timer);
      clearInterval(this.timer);
    },
    changeLocation() {
      this.timer = window.setInterval(this.addShow, 500);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  },
  created() {
    console.log("开始执行");
    setTimeout(function() {
      console.log("执行了");
    }, "1000");
    console.log("开始执行2");
    setTimeout(function() {
      console.log("执行了");
    }, "2000");
  }
};
</script>

<style lang="css" scoped>
.army {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 20px;
  left: 20px;
  transition: all 0.5s linear;
  background-color: aquamarine;
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
.army3 {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 80px;
  left: 80px;
  transition: all 0.5s linear;
  background-color: aquamarine;
}
</style>