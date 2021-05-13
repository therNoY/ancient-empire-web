<template>
  <div>
    <ae-base-dialog v-model="show" :title="title" width="35">
      <div class="start_comment">
        <div class="start_comment_label">打分</div>
        <div class="start_comment_item">
          <el-rate v-model="comment.start"></el-rate>
        </div>
      </div>
      <div>
        <ae-input
          label="评论"
          placeholder="请输入评论..."
          v-model="comment.comment"
        />
      </div>
      <ae-button-list
        :buttonList="buttonList.map((a) => a.name)"
        :clickAction="buttonList.map((a) => a.action)"
      ></ae-button-list>
    </ae-base-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "评价",
    },
  },
  data() {
    return {
      show: false,
      comment: {
        comment: "",
        start: 5,
      },
      buttonList: [
        { name: "确 定", action: this.ok },
        { name: "取 消", action: () => (this.show = false) },
      ],
    };
  },
  methods: {
    showComment() {
      this.show = true;
      this.comment.comment = "";
      this.comment.start = 5;
    },
    ok() {
      this.$emit("ok", this.comment);
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.start_comment {
  padding: 2%;
  .start_comment_item {
    float: left;
  }
  .start_comment_label {
    width: 20%;
    float: left;
    height: 20px;
    font-size: 14px;
    color: white;
  }
}
</style>
