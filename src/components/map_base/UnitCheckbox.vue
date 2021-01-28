<!--单位多选-->
<template>
  <div id="unit-check-box">
    <div class="removeAbleUnit" v-for="(unit, index) in localUnitList">
      <click-point :disabled="disabled"  @clickPoint="removeUnitFromList(unit, index)">
        <unit class="unit" :unit_id="unit.id"></unit>
      </click-point>
    </div>
    <el-button class="addButton" @click="showAddAbleUnit" icon="el-icon-plus" circle></el-button>

    <unit-choose-list
    ref="unitChooseList"
      :dialog_title="dialog_title"
      :unit_list="addAbleUnitList"
      @clickUnit="addUnit"
    ></unit-choose-list>

  </div>
</template>

<script>
import { GetAddTempAbleUnit } from "@/api";
import Unit from "./Unit.vue";
import UnitChooseList from "./UnitChooseList.vue";
import ClickPoint from '../frame/ClickPoint.vue';
export default {
  components: { Unit, UnitChooseList, ClickPoint },
  props: {
    template_id: {},
    dialog_title:{
      type:String,
      default:"添加单位"
    },
    disabled:{
      type:Boolean,
      default:false,
    },
    color: {
      type: String,
      default: "blue",
    },
    value:{
      type:Array,
    }
  },
  data() {
    return {
      removeList: {},
      localUnitList:[],
      addAbleUnitList:[],
    };
  },
  methods: {
    // 移除单位
    removeUnitFromList(unit, index) {
      this.localUnitList.splice(index, 1);
      this.$emit("input", this.localUnitList);
    },
    // 展示可以添加的模板
    showAddAbleUnit(){
      let args = { template_id: this.template_id, filter:this.localUnitList.map(unit=>unit.id) };
      GetAddTempAbleUnit(args).then(resp => {
        if (resp && resp.res_code == 0) {
          this.$refs.unitChooseList.show = true;
          this.addAbleUnitList = resp.res_val;
        }
      });
    },
    addUnit(unit){
      this.$refs.unitChooseList.show = false;
      this.localUnitList.push(unit);
      this.$emit("addUnit", unit);
      this.$emit("input", this.localUnitList);
    }
  },
  created() {
    this.localUnitList = this.value;
    window.UnitCheckboxVue = this;
  },
};
</script>

<style lang="scss">
#unit-check-box {
  float: left;
  .removeAbleUnit {
    float: left;
    margin-left: 20px;
    margin-top: 10px;
    padding-right: 10px;
    .unit {
      width: 30px;
    }
  }
  .addButton{
    float: left;
    margin-left: 10px;
    margin-top: 10px;
  }
  .selectOneUnit {
    float: left;
    width: 48px;
    height: 48px;
  }
}
</style>