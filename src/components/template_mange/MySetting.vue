<template>
  <div id="setting">
    <div class="bar">
      <el-col :span="12">
        <el-menu default-active="/templateManger" @select="router">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>模板管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/templateManger/myTemp" @click="$refs.routerView.init()">我的模板</el-menu-item>
              <el-menu-item index="/templateManger/myDownload" @click="$refs.routerView.init()">我的下载</el-menu-item>
              <el-menu-item index="/templateManger/download" @click="$refs.routerView.init()">下载模板</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>单位管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/unitMesManger" @click>单位信息管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>地图管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/userMapManger" @click>我的地图</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </div>
    <div class="content">
      <router-view ref="routerView"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    window.MySettingVue = this;
    this.$appHelper.setWidthBack();
    this.$router.push("templateManger/myTemp");
  },
  methods: {
    router(index, indexPath) {
      this.$router.push(index);
    },
  },
};
</script>

<style lang="scss">
#setting {
  height: 100%;
  width: 100%;
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
}
</style>