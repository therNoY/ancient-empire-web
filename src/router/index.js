import Vue from 'vue'
import Router from 'vue-router'
import Demo from '@/components/Demo'
import Home from '@/components/Home'
import MapEdit from '@/components/map_manger/MapEdit'
import EncounterMap from '@/components/encounter/EncounterMap'
import Index from '@/components/play_game/Index'

import AdminLogin from '@/components/admin_mange/AdminLogin'
import AdminHome from '@/components/admin_mange/AdminHome'
import AdminIndex from '@/components/admin_mange/AdminIndex'
import AdminUnitBase from '@/components/admin_mange/AdminUnitBase'
import AdminUnitLevel from '@/components/admin_mange/AdminUnitLevel'
import AdminRegion from '@/components/admin_mange/AdminRegion'

import Test from '@/components/Test'
import RequestTest from '@/components/RequestTest'
import Animation from '@/components/Animation'
import Try from '@/components/Try'
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
      path: '/encounter',
      name: 'EncounterMap',
      component: EncounterMap
    },
    {
      path: '/play',
      name: 'Index',
      component: Index
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
    },
    {
      path: '/rt',
      name: 'RequestTest',
      component: RequestTest
    },
    {
      path: '/demo',
      name: 'Demo',
      component: Demo
    }, {
      path: '/test',
      name: 'Test',
      component: Test
    }, {
      path: '/try',
      name: 'Try',
      component: Try
    }, {
      path: '/ws',
      name: 'WebSocket',
      component: WebSocket
    }
  ]
})
