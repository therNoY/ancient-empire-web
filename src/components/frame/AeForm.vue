<!-- 
    根据配置自动设置的表单
    支持类型 
    input, switchSelect, userMapSelect
 -->
<template>
  <div>
    <div v-for="(form, index) in formConfig" v-bind:key="index">
      <div v-if="form.type == 'input'">
        <ae-input
          v-model="formData[form.key]"
          :label="form.des"
          :default="form.default"
          :width="70"
        ></ae-input>
      </div>
      <div v-else-if="form.type == 'switchSelect'">
        <ae-switch-select
          v-model="formData[form.key]"
          :default="form.default"
          :items="form.items"
          :label="form.des"
          :form="form"
        ></ae-switch-select>
      </div>
      <div v-else-if="form.type == 'userMapSelect'">
        <user-map-select v-model="formData[form.key]"></user-map-select>
      </div>
    </div>
  </div>
</template>

<script>
import UserMapSelect from '../map_base/UserMapSelect.vue';
import AeInput from "./AeInput.vue";
import AeSwitchSelect from "./AeSwitchSelect.vue";
export default {
  components: { AeInput, AeSwitchSelect, UserMapSelect },
  props: {
    formConfig: {
      type: Array,
    },
  },
  data() {
    return {
      formData: {},
    };
  },
  created() {
    window.AeFormVue = this;
  },
};
</script>

<style scoped>
</style>