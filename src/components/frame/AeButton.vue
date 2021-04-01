<template>
  <div class="ae-button-body">
    <button :disabled="disabled" type="button" class="ae-button" :style="btnStyle" @click="click">
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 按钮所占父容器的宽度
     */
    width: {
      type: Number,
      default: 20,
    },
    height: {
      type: Number,
      default: 30,
    },
    marginLeft: {
      type: Number,
      default: 10,
    },
    size: {
      type: Number,
      default: 14,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click() {
      this.$emit("onClick");
    },
  },
  computed: {
    btnStyle() {
      return {
        width: this.width + "%",
        fontSize: this.size + "px",
        height: this.height + "px",
        marginLeft: this.marginLeft + "%",
      };
    },
  },
};
</script>

<style>
.ae-button {
  float: left;
  margin-top: 5%;
  color: rgb(255, 255, 255);
  cursor: pointer;
  -webkit-text-stroke: 0.2px #2a2a2a;
  background-color: #5a5c59;
  border-top: 2px #818181 solid;
  border-left: 2px #818181 solid;
  border-right: 2px #494949 solid;
  border-bottom: 2px #494949 solid;
  border-radius: 3px;
}

.ae-button:hover {
  box-shadow: 0 1px 8px 0 rgba(255, 255, 255, 0.322);
}
</style>