<template>
  <div>
    <el-dialog
      width="30%"
      :title="dialog_title"
      :visible.sync="show"
      append-to-body
      id="unitChooseBody"
    >
      <div style="float: left">
        <div
          class="selectOneUnit"
          @click="clickUnit(unit)"
          v-for="unit in unit_list"
        >
          <el-tooltip
            :content="unit.description"
            placement="bottom"
            effect="light"
          >
            <unit :unit_id="unit.id" :color="color"></unit>
          </el-tooltip>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Unit from "./Unit.vue";

export default {
  components: { Unit },
  props: {
    color: {
      type: String,
      default: "blue",
    },
    dialog_title: {
      type: String,
      default: "选择其他单位",
    },
    unit_list: {
      type: Array,
    },
  },
  methods: {
    clickUnit(unit) {
      this.$emit("clickUnit", unit);
    },
  },
  data() {
    return {
      show: false,
    }
  },
};
</script>

<style lang="scss" scoped>
.selectOneUnit {
  float: left;
  width: 48px;
  height: 48px;
}
</style>