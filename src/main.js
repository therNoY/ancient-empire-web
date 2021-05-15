// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import axios from 'axios'
import animated from 'animate.css'
import appHelper from '../src/utils/appHelper'
import eventBus from '../src/manger/EventBus'
import VueI18n from 'vue-i18n'

import AeComplexDialog from "./components/frame/base/AeComplexDialog.vue";
import AeSwitchSelect from "./components/frame/base/AeSwitchSelect.vue"
import AeBaseDialog from "./components/frame/base/AeBaseDialog.vue"
import AeButton from "./components/frame/base/AeButton";
import AeInput from "./components/frame/base/AeInput.vue"
import AeRangeSelect from "./components/frame/base/AeRangeSelect.vue"
import AeButtonList from "./components/frame/base/AeButtonList.vue"
import AeClickPoint from "./components/frame/base/AeClickPoint.vue"
import AeDataGrid from "./components/frame/base/AeDataGrid.vue"
import AeDynamic from "./components/frame/base/AeDynamic.vue"
import AeForm from "./components/frame/base/AeForm.vue"
import AeInputDialog from "./components/frame/base/AeInputDialog.vue"
import AeMessage from "./components/frame/base/AeMessage.vue"
import AeLoading from "./components/frame/base/AeLoading.vue"
import AePage from "./components/frame/base/AePage.vue"
import AeTabForm from "./components/frame/base/AeTabForm.vue"
import AeTip from "./components/frame/base/AeTip.vue"
import AeTransfer from "./components/frame/base/AeTransfer.vue"

import './permission' // 引入权限控制器

Vue.use(ElementUI)
Vue.use(animated)
Vue.use(VueI18n)
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$appHelper = appHelper;
Vue.prototype.$eventBus = eventBus;
appHelper.store = store;


Vue.component("AeComplexDialog", AeComplexDialog);
Vue.component("AeBaseDialog", AeBaseDialog);
Vue.component("AeButton", AeButton);
Vue.component("AeInput", AeInput);
Vue.component("AeSwitchSelect", AeSwitchSelect);
Vue.component("AeRangeSelect", AeRangeSelect);
Vue.component("AeButtonList", AeButtonList);
Vue.component("AeClickPoint", AeClickPoint);
Vue.component("AeDataGrid", AeDataGrid);
Vue.component("AeDynamic", AeDynamic);
Vue.component("AeForm", AeForm);
Vue.component("AeInputDialog", AeInputDialog);
Vue.component("AeLoading", AeLoading);
Vue.component("AeMessage", AeMessage);
Vue.component("AeTabForm", AeTabForm);
Vue.component("AePage", AePage);
Vue.component("AeTip", AeTip);
Vue.component("AeTransfer", AeTransfer);

/**
 * 国际化
 */
const i18n = new VueI18n({
  // 定义默认语言为中文 
  locale: 'zh',
  messages: {
    'zh': require('@assets/languages/zh.json'),
    'en': require('@assets/languages/en.json')
  }
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  i18n
})
