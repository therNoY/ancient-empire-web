import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import MapEdit from '@/components/map_manger/MapEdit'
import GameIndex from '../components/game_core/Index.vue'
import GameMonitor from '../components/game_core/GameMonitor.vue'
import Demo from '@/components/Demo'

import UserRecord from '@/components/map_manger/UserRecord'

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
      path: '/demo',
      name: 'Demo',
      component: Demo
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
    }, {
      path: '/mapEdit/:mapId',
      name: 'MapEdit',
      component: MapEdit,
    }
    ,{
      path: '/ws',
      name: 'WebSocket',
      component: WebSocket
    }
  ]
})
