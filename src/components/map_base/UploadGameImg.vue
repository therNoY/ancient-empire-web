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
  },
  data() {
    return {
      uploadUrl: null,
      loading: false,
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      console.log(file);
    },
    uploadSuccess(res, file) {
      this.loading.close();
      if (res.res_code == 0) {
        console.log("上传文件成功保存文件名", res.res_val);
        this.$emit("success", res.res_val)
      }else {
        this.$message.error(res.res_mes)
        this.$emit("error", res.res_val)
      }
    },
    uploadError(files, fileList) {
      this.loading.close();
      this.$message.error("系统异常,请联系游戏开发商");
      this.$emit("error")
    },
  },
  created() {
    if (this.templateId) {
      this.uploadUrl =
        baseUrl + "/uploadTemplateImg?template_id=" + this.templateId;
    } else {
      this.uploadUrl = baseUrl + "/uploadTemplateImg";
    }
  },
};
</script>

<style lang="scss" scoped>
</style>