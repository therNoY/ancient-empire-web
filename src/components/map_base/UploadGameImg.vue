<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :before-upload="beforeAvatarUpload"
      :on-error="uploadError"
    >
      <slot></slot>
    </el-upload>
  </div>
</template>

<script>
import { baseUrl } from "../../api/env";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    templateId: {},
    unitId: {},
    checkFunc:{
      type:Function,
      default:null,
    }
  },
  data() {
    return {
      uploadUrl: null,
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      this.$emit("beforeUpload", file);
      if (this.checkFunc) {
        let res = this.checkFunc();
        if (!res) {
          return false;
        }
      }
      this.$appHelper.setLoading();
    },
    uploadSuccess(res, file) {
      this.$appHelper.setLoading();
      if (res.res_code == 0) {
        console.log("上传文件成功保存文件名", res.res_val);
        this.$emit("success", res.res_val);
      } else {
        this.$appHelper.errorMsg(res.res_mes);
        this.$emit("error", res.res_val);
      }
    },
    uploadError(files, fileList) {
     this.$appHelper.setLoading();
      this.$appHelper.errorMsg("系统异常,请联系游戏开发商");
      this.$emit("error");
    },
  },
  created() {
    if (this.templateId) {
      this.uploadUrl = baseUrl + "/upload/template/" + this.templateId;
    } else {
      this.uploadUrl = baseUrl + "/upload/unit/" + this.unitId;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>