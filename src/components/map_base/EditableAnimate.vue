<!--
  循环展示动画的组件
-->
<template>
  <div id="editAbleAnimate">
    <img v-if="animImg" :src="animImg" />
    <el-button
      class="editButton"
      @click="changeImg"
      icon="el-icon-edit-outline"
      circle
    ></el-button>
    <el-dialog title="修改动画" width="30%" :visible.sync="show" append-to-body>
      <div
        class="item"
        v-for="(item, index) in animImgList"
        :key="item.key"
        draggable="true"
        @dragstart="handleDragStart($event, item, index)"
        @dragenter="handleDragEnter($event, item, index)"
        @dragend="handleDragEnd($event, item, index)"
      >
        <el-tooltip content="拖动改变顺序" placement="bottom" effect="light">
          <click-point @clickPoint="clickPoint(index)">
            <img :src="$appHelper.getTemplateImg(item)" />
          </click-point>
        </el-tooltip>
      </div>

      <upload-game-img :templateId="template_id" @success="uploadSuccess">
        <el-button
          class="uploadButton"
          icon="el-icon-upload"
          type="primary"
          circle
        ></el-button>
      </upload-game-img>
    </el-dialog>
  </div>
</template>

<script>
import ClickPoint from "../frame/ClickPoint.vue";
import UploadGameImg from "./UploadGameImg.vue";
export default {
  components: { ClickPoint, UploadGameImg },
  props: {
    value: {
      type: String,
    },
    singo: {
      type: Number,
    },
    dialog_title: {
      type: String,
      default: "修改动画图片",
    },
    template_id: {
      default:1,
    },
  },
  data() {
    return {
      show: false,
      swapStartIndex: null,
      swapEndIndex: null,
    };
  },
  methods: {
    changeImg() {
      this.show = true;
    },
    clickPoint(index) {
      let list = this.animImgList;
      list.splice(index, 1);
      this.$emit("input", list.join(","));
    },
    handleDragStart(event, item, index) {
      this.swapStartIndex = index;
    },
    handleDragEnter(event, item, index) {
      this.swapEndIndex = index;
    },
    uploadSuccess(fileName) {
      let list = this.animImgList;
      list.push(fileName);
      this.$emit("input", list.join(","));
    },
    handleDragEnd(event, item, index) {
      if (this.swapStartIndex == index && this.swapEndIndex != null) {
        let list = this.animImgList;
        let temp =list[this.swapStartIndex];
        list[this.swapStartIndex] = list[
          this.swapEndIndex
        ];
        list[this.swapEndIndex] = temp;
        this.$emit("input", list.join(","));
      }
      this.swapStartIndex = null;
      this.swapEndIndex = null;
    },
  },
  computed: {
    animImgList(){
      return this.value.split(",");
    },
    animImg() {
      let list = this.value.split(",");
      if (list && list.length > 0) {
        let index = this.singo % list.length;
        let imgUrl = this.$appHelper.getTemplateImg(list[index]);
        return imgUrl;
      } else {
        return null;
      }
    },
  },
  created() {
    window.EditableAnimateVue = this;
  },
  destroyed() {},
};
</script>

<style lang="scss" scope>
.editButton {
  margin-right: 10px;
}
.uploadButton {
  float: left;
  margin-left: 20px;
  width: 30px;
  height: 30px;
}
.item {
  float: left;
  margin-left: 20px;
  cursor: move;
}
</style>