<template>
  <div class="ae-input">
    <div v-if="label" class="ae-input-label">{{ label }}</div>
    <input
      :type="type"
      :style="inputStyle"
      v-model="inputValue"
      :disabled="!editAble"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
export default {
  props: {
    editAble: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "text",
    },
    value: {
    },
    default: {
    },
    width: {
      type: Number,
      default: 70,
    },
    height: {
      type: Number,
      default: 20,
    },
    placeholder: {
      type: "",
      default: "请输入",
    },
    label: {
      type: String,
    },
  },
  data() {
    return {
      inputValue: "",
    };
  },
  watch: {
    inputValue(value) {
      this.$emit("input", value);
      this.$emit("onChange", value);
    },
  },
  created() {
    this.inputValue = this.value;
    window.AeInputVue = this;
  },
  mounted() {
    if (this.default) {
      this.inputValue = this.default;
    }
  },
  computed: {
    inputStyle() {
      return {
        width: this.width + "%",
        height: this.height + "px",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-input {
  width: 96%;
  float: left;
  padding: 2%;
  height: 20px;
  .ae-input-label {
    width: 20%;
    float: left;
    height: 20px;
    font-size: 14px;
    padding-top: 2%;
    color: white;
  }
}

input {
  outline: none;
  float: left;
  height: 20px;
  margin-left: 1%;
  background-color: #696565be;
  border-top: 2px #494949 solid;
  border-left: 2px #494949 solid;
  border-right: 2px #818181 solid;
  border-bottom: 2px #818181 solid;
  -webkit-text-fill-color: white; /*输入文字、placeholder颜色*/
  font-size: 14px;
}

input:disabled {
  border-top: 2px #ffffff00 solid;
  border-left: 2px #ffffff00 solid;
  border-right: 2px #ffffff00 solid;
  border-bottom: 2px #ffffff00 solid;
}
</style>