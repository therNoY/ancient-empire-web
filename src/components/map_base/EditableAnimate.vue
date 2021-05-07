<!--
  循环展示动画的组件
-->
<template>
  <div class="editAbleAnimate">
    <ae-button
      class="editButton"
      :height="25"
      :size="0.5"
      :width="70"
      :disabled="disabled"
      @onClick="changeImg"
      >修改</ae-button
    >
    <img class="showImg" v-if="animImg" :src="animImg" />

    <ae-base-dialog title="修改动画" v-model="show">
      <upload-game-img
        class="uploadAnimateImg"
        :templateId="template_id"
        @success="uploadSuccess"
      >
        <ae-button :width="90" :height="27">添加</ae-button>
      </upload-game-img>
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
    </ae-base-dialog>
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
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
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
        let temp = list[this.swapStartIndex];
        list[this.swapStartIndex] = list[this.swapEndIndex];
        list[this.swapEndIndex] = temp;
        this.$emit("input", list.join(","));
      }
      this.swapStartIndex = null;
      this.swapEndIndex = null;
    },
  },
  computed: {
    animImgList() {
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
.editAbleAnimate {
  float: left;
  width: 100%;
  .editButton {
    float: left;
    padding-left: 1%;
    margin-top: 2%;
    width: 20%;
  }
  .showImg {
    float: left;
    margin-top: 3%;
  }
  .uploadAnimateImg {
    float: left;
    width: 10%;
  }
}

.item {
  float: left;
  margin-left: 3%;
  margin-top: 1%;
  cursor: move;
}
</style>