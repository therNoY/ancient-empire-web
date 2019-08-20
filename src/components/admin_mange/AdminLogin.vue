<template>
  <div class="body">
    <el-card class="login-form-layout">
      <el-form
        autocomplete="on"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-position="left"
      >
        <h2 class="login-title color-main">ancientEmpire</h2>
        <el-form-item prop="user_name">
          <el-input
            name="user_name"
            type="text"
            v-model="loginForm.user_name"
            autocomplete="on"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            show-password
            @keyup.enter.native="handleLogin"
            v-model="loginForm.password"
            autocomplete="on"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px">
          <el-button style="width: 100%" type="primary" :loading="loading" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { AdminLogin } from "@/api";
export default {
  name: "login",
  data() {
    const validateuser_name = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("密码不能小于3位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        user_name: "admin",
        password: "admin"
      },
      loginRules: {
        user_name: [
          { required: true, trigger: "blur", validator: validateuser_name }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      dialogVisible: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.login();
        } else {
          console.log("参数验证不合法！");
          return false;
        }
      });
    },
    async login() {
      this.loading = true;
      const resp = await AdminLogin(this.loginForm);
      if (resp.res_code == 0) {
        this.loading = false;
        this.$store.commit("SET_ADMIN_TOKEN", resp.res_val);
        this.$router.push("/admin/index");
      }else {
        this.loading = false;
      }
    }
  },
  created() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#f7f7f7");
  }
};
</script>

<style scoped>
body {
  background-color: aliceblue !important;
}
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
