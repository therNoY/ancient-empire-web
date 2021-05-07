<template>
  <div>
    <ae-base-dialog title="上传图片" v-model="showModel">
      <div style="width: 100%; float: left">
        <upload-game-img
          class="uploadComp"
          @beforeUpload="checkSize"
          :unitId="unitId"
          :checkFunc="checkSize"
          @success="uploadSuccess"
        >
          <ae-button :width="80">上传</ae-button>
        </upload-game-img>
        <div
          class="uploadImg"
          v-for="(item, index) in uploadImg"
          :key="item.key"
        >
          <click-point @clickPoint="removeUnit(index)">
            <img :src="$appHelper.getUnitImg(item, 'temporary')" />
          </click-point>
        </div>
      </div>
      <ae-button-list
        :buttonList="saveButtonList"
        :clickAction="[previewUnit, createUnit]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog title="预览" :width="30" v-model="showPreview">
      <div v-for="(color,index) in colorList" :key = index class="previewImg">
        <img v-show="singo % 2 == 0" :src="$appHelper.getUnitImg(previewUnitImg.img1, color)" />
        <img v-show="singo % 2 != 0" :src="$appHelper.getUnitImg(previewUnitImg.img2, color)" />
      </div>
    </ae-base-dialog>
  </div>
</template>

<script>

import UploadGameImg from "./UploadGameImg.vue";
import ClickPoint from "../frame/ClickPoint.vue";
import dialogShow from "../../mixins/frame/dialogShow.js";
import AeButtonList from "../frame/AeButtonList.vue";
import AeBaseDialog from "../frame/AeBaseDialog.vue";
import { CreateUnitImg } from "@/api";
export default {
  mixins: [dialogShow],
  components: {
    UploadGameImg,
    ClickPoint,
    AeButtonList,
    AeBaseDialog,
  },
  props: {
    unitId: {
      default: "-1",
    },
  },
  data() {
    return {
      uploadImg: [],
      showPreview: false,
      saveButtonList: ["预览", "创建"],
      timerChangeSingo: null,
      singo: 0,
      colorList : ["blue", "red", "green", "black"],
      previewUnitImg: {},
    };
  },
  methods: {
    onDialogCreate() {
      let _this = this;
      if (this.timerChangeSingo == null) {
        this.timerChangeSingo = setInterval(() => {
          if (_this.singo < 1000) {
            _this.singo++;
          } else {
            _this.singo = 0;
          }
        }, 300);
      }
      this.uploadImg = [];
    },
    onDialogDestroy() {
      if (this.timerChangeSingo != null) {
        clearInterval(this.timerChangeSingo);
        this.timerChangeSingo = null;
      }
    },
    checkSize() {
      if (this.uploadImg.length > 1) {
        this.$appHelper.infoMsg("单位图片只能传两个");
        return false;
      }
      return true;
    },
    removeUnit(index) {
      this.uploadImg.splice(index, 1);
    },
    previewUnit() {
      console.log("预览");
      if (this.uploadImg.length != 2) {
        this.$appHelper.infoMsg("单位图片需要两张");
        return false;
      }
      let args = {};
      args.img_list = this.uploadImg;
      this.$appHelper.setLoading();
      CreateUnitImg(args)
        .then((resp) => {
          if (resp && resp.res_code == "0") {
            this.showPreview = true;
            this.previewUnitImg = resp.res_val;
          }
          this.$appHelper.setLoading();
        })
        .catch((error) => {
          this.$appHelper.setLoading();
        });
    },
    createUnit() {
        if (this.previewUnitImg && this.previewUnitImg.img1 && this.previewUnitImg.img2) {
            this.$emit("input", false);
            this.$emit("uploadOk", this.previewUnitImg);
        } else {
            this.$appHelper.infoMsg("请先预览,看是否复合要求")
        }
    },
    uploadSuccess(fileName) {
      this.uploadImg.push(fileName);
    },
  },
  created() {
      window.UploadUnitImg = this;
  },
};
</script>

<style lang="scss" scope>
.uploadComp {
  width: 30%;
  float: left;
}
.uploadImg {
  margin-top: 2%;
  float: left;
  margin-left: 3%;
}
.previewImg{
    width: 30px;
    float: left;
    margin-left: 5%;
}
</style>