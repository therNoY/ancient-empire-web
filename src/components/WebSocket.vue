<template>
  <div>
    <el-input v-model="name"  placeholder="请输入名字"></el-input>
    <el-button @click="changeName">改变名字</el-button>
    <el-button @click="connect">开始连接</el-button>
    <el-button @click="send">发送消息</el-button>
    <div>{{mesList.length}}</div>
    <div v-for="(mes, index) in mesList" :key="index">{{mes}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: null,
      mesList: this.$store.state.ws.magList
    };
  },
  methods: {
    connect() {
      console.log(window.location.host);
      if (this.$store.state.ws.stompClient == null) {
        this.$store.dispatch("wsConnection");
      }
    },
    changeName(){
      this.$store.commit("changeName", this.name);
      console.log(this.$store.state.ws.name);
    },
    send() {
      this.$store.dispatch("wsSendMes", "总部总部 我是客户")
    },
  },
  created() {
    console.log(this.$store.state.ws.action);
    this.name = this.$store.state.ws.name;
  }
};
</script>

<style lang="css" scoped>
</style>