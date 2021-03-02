import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import MapEdit from '@/components/map_manger/MapEdit'
import EncounterMap from '@/components/encounter'
import GameIndex from '../components/game_core/Index.vue'
import GameMonitor from '../components/game_core/GameMonitor.vue'
import Demo from '@/components/Demo'

import AdminLogin from '@/components/template_mange/AdminLogin'
import Setting from '@/components/template_mange/MySetting'
import UserRecord from '@/components/map_manger/UserRecord'
import TemplateManger from '@/components/template_mange/TemplateManger'
import UnitMesManger from '@/components/template_mange/UnitMesManger'
import AdminRegion from '@/components/template_mange/AdminRegion'

import WebSocket from '@/components/WebSocket'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/mapEdit',
      name: 'MapEdit',
      component: MapEdit
    },
    {
      path: '/demo',
      name: 'Demo',
      component: Demo
    },
    {
      path: '/encounter',
      name: 'EncounterMap',
      component: EncounterMap
    },
    {
      path: '/monitor',
      name: 'GameMonitor',
      component: GameMonitor
    },
    {
      path: '/userRecord',
      name:"userRecord",
      component: UserRecord,
    },
    {
      path: '/gameIndex',
      name: 'GameIndex',
      component: GameIndex
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: AdminLogin
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
      children: [{
        path: '/templateManger/:model',
        name: 'TemplateManger',
        component: TemplateManger,
      }, {
        path: '/unitMesManger',
        name: 'UnitMesManger',
        component: UnitMesManger,
      }, {
        path: '/userMapManger',
        name: 'UserMapManger',
        component: MapEdit,
      }, {
        path: '/admin/region',
        name: 'AdminRegion',
        component: AdminRegion,
      }]
    }, {
      path: '/ws',
      name: 'WebSocket',
      component: WebSocket
    }
  ]
})
