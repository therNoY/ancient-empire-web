<template>
  <div>
    <el-buttton @click="get">GET</el-buttton>
    <el-buttton @click="post">POST</el-buttton>
    <el-buttton @click="deleteTest">DELETE</el-buttton>
    <el-buttton @click="put">PUT</el-buttton>
  </div>
</template>

<script>
import {GetTest, PostTest, DeleteTest, PutTest} from '../api'
export default {
  methods: {
    async get() {
      const rep = await GetTest("get/1");
      console.log(rep);
    }
  },
};
</script>

<style lang="css" scoped>
</style>