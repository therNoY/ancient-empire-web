<template>
  <div class="body">
    <!--左侧导航-->
    <div class="bar">
      <el-col :span="12">
        <el-menu default-active="/admin/index" @select="router">
          <el-menu-item index="/admin/index">
            <i class="el-icon-menu"></i>
            <span slot="title">主页</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>单位设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin/unit/base" @click>基础数据</el-menu-item>
              <el-menu-item index="/admin/unit/level" @click>单位等级数据</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-grid"></i>
              <span>地形设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin/region">基础设置</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>全局设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">作弊</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  created() {},
  methods: {
    router(index, indexPath) {
      this.$router.push(index);
    }
  }
};
</script>

<style lang="css" scoped>
.body {
  height: 100%;
  width: 100%;
}
.bar {
  width: 15%;
  float: left;
  height: 100%;
  background-color: #ffffff;
}
.content {
  float: right;
  width: 85%;
  height: 100%;
}
.el-col-12 {
  width: 100%;
}
</style>