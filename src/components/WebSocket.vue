<template>
  <div>
    <el-input v-model="name" @change="changeName" placeholder="请输入名字"></el-input>
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
      mesList: this.$store.state.magList
    };
  },
  methods: {
    connect() {
      console.log(window.location.host);
      console.log(this.$store.state.stompClient);
      if (this.$store.state.stompClient == null) {
        this.$store.dispatch("wsConnection", this);
      }
    },
    changeName(value){
      this.$store.commit("changeName", value);
    },
    send() {
      this.$store.state.stompClient.send(
        "/marco",
        {name: this.name},
        "总部总部 我是客户"
      );
    },
  },
  created() {
    this.name = this.$store.state.name;
  }
};
</script>

<style lang="css" scoped>
</style>