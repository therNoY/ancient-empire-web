<template>
  <div class="ae-range-select">
    <ae-input
      class="ae-range-select-input"
      type="number"
      placeholder="最小值"
      :width="100"
      v-model="min"
      :disabled="!editAble"
      @onChange="minValueChange"
    />
    <div class="ae-range-select-mid">-</div>
    <ae-input
      class="ae-range-select-input"
      type="number"
      :width="100"
      placeholder="最大值"
      v-model="max"
      :disabled="!editAble"
      @onChange="maxValueChaneg"
    />
  </div>
</template>

<script>
export default {
  props: {
    minKey: {
      type: String,
    },
    maxKey: {
      type: String,
    },
    editAble: {
      type: Boolean,
      default: true,
    },
    minValue: {},
    maxValue: {},
  },
  data() {
    return {
      min: null,
      max: null,
    };
  },
  methods: {
    minValueChange() {
      this.$emit("minKeyChange", this.min, this.minKey);
    },
    maxValueChaneg() {
      this.$emit("maxKeyChange", this.max, this.maxKey);
    },
  },
  created() {
    this.min = Number.parseInt(this.minValue);
    this.max = Number.parseInt(this.maxValue);
    window.RangeSelect = this;
  },
  watch: {
    minValue(v) {
      this.min = Number.parseInt(v);
    },
    maxValue(v) {
      this.max = Number.parseInt(v);
    },
  },
};
</script>

<style lang="scss"  scoped>
.ae-range-select {
  width: 100%;
  .ae-range-select-mid {
    width: 2%;
    float: left;
    color: white;
    font-size: 14px;
    padding-top: 15px;
  }
  .ae-range-select-input {
    width: 30%;
    float: left;
  }
}
</style>