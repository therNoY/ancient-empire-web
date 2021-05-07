<!--
    根据配置自动设置的表单
    支持类型
    input, switchSelect, userMapSelect
 -->
<template>
  <div>
    <div
      v-for="(form, index) in formConfig"
      v-bind:key="index"
      class="ae-form-item"
    >
      <div class="ae-form-lable">
        {{ form.des }}
      </div>
      <div class="ae-form-real-camp">
        <div v-if="form.type == 'input'">
          <ae-input
            v-model="formData[form.key]"
            :type="form.style"
            :default="form.default"
            :width="70"
            :editAble="edit && !form.disabled"
          ></ae-input>
        </div>
        <div v-else-if="form.type == 'switchSelect'">
          <ae-switch-select
            v-model="formData[form.key]"
            :default="form.default"
            :items="form.items"
            :editAble="edit && !form.disabled"
          ></ae-switch-select>
        </div>
        <div v-else-if="form.type == 'userMapSelect'">
          <user-map-select v-model="formData[form.key]"></user-map-select>
        </div>
        <div v-else-if="form.type == 'rangeSelect'">
          <ae-range-select
            :minValue="formData[form.minKey]"
            :maxValue="formData[form.maxKey]"
            :minKey="form.minKey"
            :maxKey="form.maxKey"
            :editAble="edit && !form.disabled"
            @minKeyChange="rangeMinKeyChange"
            @maxKeyChange="rangeMaxKeyChange"
          >
          </ae-range-select>
        </div>
        <div v-else-if="form.type == 'unitRadio'">
          <unit-radio
            :editAble="edit && !form.disabled"
            v-model="formData[form.key]"
            :unitList="form.unitList"
          ></unit-radio>
        </div>
        <div v-else-if="form.type == 'unitCheckbox'">
          <unit-checkbox
            :disabled="!edit || form.disabled"
            v-model="formData[form.key]"
          ></unit-checkbox>
        </div>
        <div v-else-if="form.type == 'editableAnimate'">
          <editable-animate
            :disabled="!edit || form.disabled"
            v-model="formData[form.key]"
            :singo="singo"
            :template_id="templateId"
          ></editable-animate>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UnitRadio from "../map_base/UnitRadio.vue";
import UnitCheckbox from "../map_base/UnitCheckbox.vue";
import UserMapSelect from "../map_base/UserMapSelect.vue";
import EditableAnimate from "../map_base/EditableAnimate.vue";

export default {
  components: { UserMapSelect, UnitRadio, UnitCheckbox, EditableAnimate },
  props: {
    formConfig: {
      type: Array,
    },
    edit: {
      type: Boolean,
      default: true,
    },
    dataObj: {
      type: Object,
      default: null,
    },
    closeBind: {
      type: Boolean,
      default: false,
    },
    singo: {
      type: Number,
      default: 0,
    },
    templateId:{
    }
  },
  data() {
    return {
      formData: {},
    };
  },
  methods: {
    getFormData() {
      for (let config of this.formConfig) {
        if (config.type == "rangeSelect") {
        }
        if (config.require && !this.formData[config.key]) {
          this.$appHelper.infoMsg(config.des + "不能为空");
          throw new Error("数据" + config.des + "不完整");
        }
      }
      return this.formData;
    },
    rangeMinKeyChange(value, key) {
      this.formData[key] = value;
    },
    rangeMaxKeyChange(value, key) {
      this.formData[key] = value;
    },
  },
  created() {
    if (this.dataObj) {
      if (this.closeBind) {
        // 关闭双向绑定
        this.formData = JSON.parse(JSON.stringify(this.dataObj));
      } else {
        this.formData = this.dataObj;
      }
    }
    window.AeFormVue = this;
  },
};
</script>

<style lang="scss"  scoped>
.ae-form-item {
  width: 100%;
  height: 40px;
  .ae-form-lable {
    width: 20%;
    float: left;
    color: white;
    font-size: 14px;
    padding-top: 15px;
  }
  .ae-form-real-camp {
    width: 80%;
    float: left;
  }
}
</style>
