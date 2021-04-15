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
import JsonViewer from 'vue-json-viewer'

import AeComplexDialog from "./components/frame/AeComplexDialog.vue";
import AeBaseDialog from "./components/frame/AeBaseDialog.vue"
import AeButton from "./components/frame/AeButton";
import AeTip from "./components/frame/AeTip.vue"
import AeInput from "./components/frame/AeInput.vue"

import AeRadioButton from "./components/frame/AeRadioButton.vue"

import './permission' // 引入权限控制器

Vue.use(ElementUI)
Vue.use(animated)
Vue.use(JsonViewer)
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$appHelper = appHelper;
Vue.prototype.$eventBus = eventBus;
appHelper.store = store;


Vue.component("AeComplexDialog", AeComplexDialog);
Vue.component("AeBaseDialog", AeBaseDialog);
Vue.component("AeButton", AeButton);
Vue.component("AeRadioButton", AeRadioButton);
Vue.component("AeTip", AeTip);
Vue.component("AeInput", AeInput);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  jsonData: {
    total: 25,
    limit: 10,
    skip: 0,
    links: {
      previous: undefined,
      next: function () {},
    },
    data: [
      {
        id: '5968fcad629fa84ab65a5247',
        firstname: 'Ada',
        lastname: 'Lovelace',
        awards: null,
        known: [
          'mathematics',
          'computing'
        ],
        position: {
          lat: 44.563836,
          lng: 6.495139
        },
        description: `Augusta Ada King, Countess of Lovelace (née Byron; 10 December 1815 – 27 November 1852) was an English mathematician and writer,
        chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer,
        the Analytical Engine. She was the first to recognise that the machine had applications beyond pure calculation,
        and published the first algorithm intended to be carried out by such a machine.
        As a result, she is sometimes regarded as the first to recognise the full potential of a "computing machine" and the first computer programmer.`,
        bornAt: '1815-12-10T00:00:00.000Z',
        diedAt: '1852-11-27T00:00:00.000Z'
      }, {
        id: '5968fcad629fa84ab65a5246',
        firstname: 'Grace',
        lastname: 'Hopper',
        awards: [
          'Defense Distinguished Service Medal',
          'Legion of Merit',
          'Meritorious Service Medal',
          'American Campaign Medal',
          'World War II Victory Medal',
          'National Defense Service Medal',
          'Armed Forces Reserve Medal',
          'Naval Reserve Medal',
          'Presidential Medal of Freedom'
        ],
        known: null,
        position: {
          lat: 43.614624,
          lng: 3.879995
        },
        description: `Grace Brewster Murray Hopper (née Murray; December 9, 1906 – January 1, 1992)
        was an American computer scientist and United States Navy rear admiral.
        One of the first programmers of the Harvard Mark I computer,
        she was a pioneer of computer programming who invented one of the first compiler related tools.
        She popularized the idea of machine-independent programming languages, which led to the development of COBOL,
        an early high-level programming language still in use today.`,
        bornAt: '1815-12-10T00:00:00.000Z',
        diedAt: '1852-11-27T00:00:00.000Z'
      }
    ]
  }
})
