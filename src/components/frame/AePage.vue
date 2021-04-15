<template>
  <div class="ae-page">
    <div class="ae-page-left-button" @click="pageDes">&lt;</div>
    <div
      class="ae-page-num"
      v-for="(pageNum, key) of getPageCount"
      v-bind:key="key"
      :style="widthStyle(pageNum)"
      @click="clickPageNum(pageNum)"
    >
      {{ pageNum }}
    </div>
    <div class="ae-page-right-button" @click="pageAdd">&gt;</div>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0,
    },
    pageSize:{
      type: Number,
      default: 10,
    }
  },
  data() {
    return {
      pageNow: 1,
    };
  },
  methods: {
    widthStyle(index) {
      if (index && index == this.pageNow) {
        return {
          color: "#5a5c59",
        };
      }
    },
    clickPageNum(index) {
      this.pageNow = index;
      this.$emit("onPageNowChange", this.pageNow);
    },
    pageDes() {
      if (this.pageNow > 1) {
        this.pageNow = this.pageNow - 1;
        this.$emit("onPageNowChange", this.pageNow);
      }
    },
    pageAdd() {
      if (this.pageNow < this.pageCount) {
        this.pageNow = this.pageNow + 1;
        this.$emit("onPageNowChange", this.pageNow);
      }
    },
  },
  computed: {
    pageCount() {
      if (this.count % this.pageSize == 0) {
        return this.count / this.pageSize;
      } else {
        return Number.parseInt(this.count / this.pageSize) + 1;
      }
    },
    getPageCount() {
      let returnArry = [];
      if (this.pageCount < 10 || this.pageNow <= 5) {
        for (let i = 0; i < Math.min(9, this.pageCount); i++) {
          returnArry.push(i + 1);
        }
      } else {
        let max =
          this.pageCount > this.pageNow + 4 ? this.pageNow + 4 : this.pageCount;
        for (let i = 9; i > 0; i--) {
          returnArry.push(max - i + 1);
        }
      }
      return returnArry;
    },
  },
};
</script>

<style  lang="scss" scope>
.ae-page {
  float: left;
  height: 20px;
  width: 100%;
  color: rgb(255, 255, 255);
  margin-top: 1%;
  margin-bottom: 1%;
  font-size: 13px;
  .ae-page-left-button {
    float: left;
    width: 5%;
    cursor: pointer;
  }
  .ae-page-right-button {
    float: left;
    width: 5%;
    cursor: pointer;
  }
  .ae-page-num {
    float: left;
    cursor: pointer;
    width: 10%;
    color: white;
  }
}
</style>