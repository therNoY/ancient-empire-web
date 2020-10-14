import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import MapEdit from '@/components/map_manger/MapEdit'
import EncounterMap from '@/components/encounter'
import GameIndex from '../components/game_core/Index.vue'
import Demo from '@/components/Demo'

import AdminLogin from '@/components/admin_mange/AdminLogin'
import AdminHome from '@/components/admin_mange/AdminHome'
import AdminIndex from '@/components/admin_mange/AdminIndex'
import AdminUnitBase from '@/components/admin_mange/AdminUnitBase'
import AdminUnitLevel from '@/components/admin_mange/AdminUnitLevel'
import AdminRegion from '@/components/admin_mange/AdminRegion'

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
      path: '/admin/home',
      name: 'AdminHome',
      component: AdminHome,
      children: [{
        path: '/admin/index',
        name: 'AdminIndex',
        component: AdminIndex,
      }, {
        path: '/admin/unit/base',
        name: 'AdminUnitBase',
        component: AdminUnitBase,
      }, {
        path: '/admin/unit/level',
        name: 'AdminUnitLevel',
        component: AdminUnitLevel,
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
