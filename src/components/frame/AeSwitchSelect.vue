<!-- 加减选择器 -->
<template>
  <div class="ae-switch-select">
    <div v-if="label" class="ae-switch-label">{{ label }}</div>
    <ae-button
      class="ae-switch-select-right-button"
      :width="100"
      :height="23"
      @onClick="getRightItem"
    >
      &lt;
    </ae-button>
    <div class="ae-switch-select-body">{{ showValue }}</div>
    <ae-button
      class="ae-switch-select-left-button"
      :width="100"
      :height="23"
      @onClick="getLeftItem"
    >
      &gt;
    </ae-button>
  </div>
</template>

<script>
import AeButton from "./AeButton.vue";
export default {
  components: { AeButton },
  props: {
    value: {},
    items: {
      type: Array,
    },
    form: {},
    label: {
      type: String,
    },
    default: {},
  },

  data() {
    return {
      key: null,
      showIndex: 0,
    };
  },
  created() {
    window.AeSwithSelectVue = this;
    if (!this.value && this.default) {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        if (item.key == this.default) {
          this.$emit("input", item.key);
          break;
        }
      }
    }
  },
  watch: {
    value(v) {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        if (item.key == v) {
          this.key = item.key;
          this.showIndex = i;
          break;
        }
      }
    },
  },
  methods: {
    getRightItem() {
      if (this.showIndex > 0) {
        this.$emit("input", this.items[this.showIndex - 1].key);
      } else {
        this.$emit("input", this.items[this.items.length - 1].key);
      }
    },
    getLeftItem() {
      if (this.showIndex < this.items.length - 1) {
        this.$emit("input", this.items[this.showIndex + 1].key);
      } else {
        this.$emit("input", this.items[0].key);
      }
    },
  },
  computed: {
    showValue() {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        if (item.key == this.value) {
          return item.value;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-switch-select {
  width: 96%;
  height: 20px;
  float: left;
  padding: 2%;
  .ae-switch-label {
    float: left;
    width: 20%;
    font-size: 14px;
    padding-top: 1%;
  }
  .ae-switch-select-right-button {
    width: 10%;
    float: left;
  }
  .ae-switch-select-body {
    width: 30%;
    font-size: 14px;
    padding-top: 1%;
    float: left;
    color: blanchedalmond;
  }
  .ae-switch-select-left-button {
    width: 10%;
    float: left;
  }
}
</style>