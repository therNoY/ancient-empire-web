// 作为单位信息的缓存存在
import { GetUnitInfo, GetRegionInfo } from '@/api'

const info = {
  state: {
    unitInfo: {},
    currentUnitInfo: {},
    regionInfo: {},
    currentRegionInfo: {},
  },

  mutations: {
    // 增加单位信息缓存
    addUnitInfo(store, unit_info) {
      store.unitInfo[unit_info.key] = unit_info.info;
    },
    // 设置当前单位
    currentUnitInfo(store, currentUnitInfo) {
      store.currentUnitInfo = currentUnitInfo;
    },
    // 增加单位信息缓存
    addRegionInfo(store, region_info) {
      store.regionInfo[region_info.key] = region_info.info;
    },
    // 设置当前地形信息
    currentRegionInfo(store, currentRegionInfo) {
      store.currentRegionInfo = currentRegionInfo;
    },
  },

  actions: {
    // 获取单位信息
    getUnitInfo(store, key) {
      return new Promise((resolve, reject) => {
        let args = { idLevelInfo: key };
        GetUnitInfo(args).then(resp => {
          let unitInfo = {};
          unitInfo.key = key;
          unitInfo.info = resp.res_val;
          store.commit("addUnitInfo", unitInfo);
          resolve(unitInfo.info);
        }).catch(error => {
          reject(error)
        })
      })

    },
    // 获取地形
    getRegionInfo(store, type) {
      return new Promise((resolve, reject) => {
        let args = { type: type };
        GetRegionInfo(args).then(resp => {
          let regionInfo = {};
          regionInfo.key = type;
          regionInfo.info = resp.res_val;
          store.commit("addRegionInfo", regionInfo);
          store.commit("currentRegionInfo", regionInfo.info);
          resolve(regionInfo.info);
        }).catch(error => {
          reject(error)
        })
      })

    }
  }
}

export default info
