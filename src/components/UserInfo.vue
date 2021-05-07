<template>
  <div>
    <ae-base-dialog
      v-model="showLogin"
      title="登录"
      @close="closeLoginDiaglog"
    >
      <ae-form ref="loginForm" :formConfig="formConfig"></ae-form>
      <ae-button-list
        :buttonList="loginButton"
        :clickAction="[getOldPassword, register, doLogin]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
      v-model="showRegister"
      title="注册"
      @close="closeLoginDiaglog"
    >
      <ae-form ref="registerForm" :formConfig="registerFormConfig"></ae-form>
      <ae-button-list
        :buttonList="registerButton"
        :clickAction="[doRegister, cancelRegistr]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
      title="用户信息"
      v-model="showUserInfo"
      v-if="showUserInfo"
    >
      <ae-form
        ref="userInfoForm"
        :dataObj="user"
        :edit="editAble"
        :formConfig="userInfoFormConfig"
      ></ae-form>
      <ae-button-list
        :buttonList="userInfoButton"
        :clickAction="[changeUserPwdShow, logout]"
      >
      </ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
      title="修改密码"
      v-model="showChangePwd"
      v-if="showChangePwd"
    >
      <ae-form
        v-if="showChangePwd"
        ref="changePwdForm"
        :formConfig="changePwdFormConfig"
      ></ae-form>
      <ae-button-list
        :buttonList="changePwdButton"
        :clickAction="[changePwd, cancelChangePwd]"
      >
      </ae-button-list>
    </ae-base-dialog>
  </div>
</template>

<script>
import { setUser, setToken } from "../utils/auth";
import { Login, Register, ChangePwd } from "../api";
import AeButtonList from "./frame/AeButtonList.vue";
import AeForm from "./frame/AeForm.vue";
import AeBaseDialog from "./frame/AeBaseDialog.vue";
export default {
  components: { AeButtonList, AeForm, AeBaseDialog },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showLogin: false,
      showUserInfo: false,
      showRegister: false,
      formConfig: [
        {
          type: "input",
          key: "user_name",
          des: "用户名/邮箱",
        },
        {
          type: "input",
          key: "password",
          des: "密码",
         style: "password",
        },
      ],
      registerFormConfig: [
        {
          type: "input",
          key: "email",
          des: "邮箱",
          require: true,
        },
        {
          type: "input",
          key: "user_name",
          des: "用户名",
          require: true,
        },
        {
          type: "input",
          key: "password",
          des: "密码",
         style: "password",
          require: true,
        },
        {
          type: "input",
          key: "re_password",
          des: "确认密码",
         style: "password",
          require: true,
        },
      ],
      userInfoFormConfig: [
        {
          type: "input",
          key: "user_name",
          des: "用户名",
          edit: false,
        },
      ],
      changePwdFormConfig: [
        {
          type: "input",
          key: "old_password",
          des: "原密码",
         style: "password",
          require: true,
        },
        {
          type: "input",
          key: "new_password",
          des: "新密码",
         style: "password",
          require: true,
        },
        {
          type: "input",
          key: "sure_password",
          des: "确认密码",
         style: "password",
          require: true,
        },
      ],
      user: {},
      showChangePwd: false,
      editAble: false,
      loginButton: ["找回密码", "注册", "登录"],
      userInfoButton: ["修改密码", "登出"],
      changePwdButton: ["修改", "取消"],
      registerButton: ["注册", "取消"],
    };
  },
  methods: {
    closeLoginDiaglog() {
      this.$emit("input", false);
      this.showLogin = false;
    },
    changeUserInfo() {
      this.editAble = true;
    },
    changeUserPwdShow() {
      this.showChangePwd = true;
    },
    cancelChangePwd() {
      this.showChangePwd = false;
    },

    changePwd() {
      let args = this.$refs.changePwdForm.getFormData();
      if (args.new_password != args.sure_password) {
        this.$appHelper.infoMsg("确认密码不正确");
        return;
      }
      this.$appHelper.setLoading();
      ChangePwd(args)
        .then((resp) => {
          if (resp.res_code == 0) {
            this.$appHelper.infoMsg("修改成功");
          } else {
            this.$appHelper.infoMsg(resp.res_mes);
          }
          this.$appHelper.setLoading();
          this.showChangePwd = false;
        })
        .catch((error) => {
          console.error(error);
          this.$appHelper.setLoading();
        });
    },

    logout() {
      this.$store.dispatch("logout");
      this.user.user_name = "";
      this.user.password = "";
      this.showUserInfo = false;
      this.editAble = false;
      this.showChangePwd = false;
      this.$emit("input", false);
    },

    doLogin() {
      this.user = this.$refs.loginForm.formData;
      console.log(this.user);
      // 验证
      if (this.user.user_name == null || this.user.user_name == "") {
        this.$appHelper.infoMsg("用户名/邮箱 不能为空");
        return;
      }
      this.$appHelper.setLoading();
      Login(this.user).then((resp) => {
        console.log(resp);
        if (resp.res_code == 0) {
          let loginUser = {};
          loginUser.user_name = resp.res_val.user_name;
          loginUser.password = resp.res_val.password;
          loginUser.user_id = resp.res_val.user_id;
          setUser(loginUser);
          let token = resp.res_val.token;
          console.log(token);
          setToken(token);
          this.$appHelper.infoMsg("登录成功");
          this.showLogin = false;
          this.showChangePwd = false;
          this.$emit("input", false);
        } else {
          this.$appHelper.infoMsg(resp.res_mes);
        }
        this.$appHelper.setLoading();
      });
    },
    doRegister() {
      let args = this.$refs.registerForm.getFormData();
      if (args.password != args.re_password) {
        this.$appHelper.infoMsg("确认密码不正确");
        return;
      }
      Register(args).then((resp) => {
        if (resp.res_code == 0) {
          this.$message("确认邮件已发出 请确认查收");
          this.close();
        } else {
          this.$appHelper.errorMsg(resp.res_mes);
        }
      });
    },
    cancelRegistr() {
      this.showRegister = false;
    },
    getOldPassword() {},
    register() {
      this.showRegister = true;
    },
  },
  watch: {
    value(v) {
      if (v) {
        console.log(
          "查看用户信息,",
          this.$store.getters.token,
          this.$store.getters.user
        );
        if (this.$store.getters.token) {
          this.user = this.$store.getters.user;
          this.showUserInfo = true;
          this.editAble = false;
          this.showChangePwd = false;
        } else {
          this.showLogin = true;
        }
      }
    },
  },
  created() {
    window.UserInfoVue = this;
  },
};
</script>

<style lang="scss" scope>
</style>