<template>
  <div>
    <ae-base-dialog
      v-model="show"
      :title="title"
      width="35"
      :showCloseTip="false"
    >
      <el-form v-model="comment">
        <el-form-item label="打分">
          <el-rate v-model="comment.start"></el-rate>
        </el-form-item>
        <el-form-item label="评论">
          <el-input
            style="float: left; width: 70%"
            v-model="comment.comment"
            size="mini"
            type="textArea"
            placeholder="请输入评论..."
          ></el-input>
        </el-form-item>
      </el-form>
      <ae-button-list
        :buttonList="buttonList.map((a) => a.name)"
        :clickAction="buttonList.map((a) => a.action)"
      ></ae-button-list>
    </ae-base-dialog>
  </div>
</template>

<script>
import AeButtonList from "./AeButtonList.vue";
export default {
  components: { AeButtonList },
  props: {
    title: {
      type: String,
      default: "评价",
    },
    comment: {},
  },
  data() {
    return {
      show: false,
      buttonList: [
        { name: "确 定", action: this.ok },
        { name: "取 消", action: () => (this.show = false) },
      ],
    };
  },
  methods: {
    showComment() {
      this.show = true;
    },
    ok() {
      this.$emit("input", this.value);
      this.$emit("ok", this.value);
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>