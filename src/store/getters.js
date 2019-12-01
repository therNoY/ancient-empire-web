import { log } from "util";

const getters = {
  user: state => state.user.user,
  token: state => state.user.token,
  admin_token: state => state.user.admin_token,

  recordId: state => state.app.recordId,
  record: state => state.app.record,
  mapSt: state => state.app.mapSt,
  mapDt: state => state.app.mapDt,
  mapAs: state => state.app.mapAs,
  unitInfo : state => state.info.unitInfo,
  currentUnitInfo: state => state.info.currentUnitInfo,
  regionInfo: state => state.info.regionInfo,
  currentRegion: state => state.info.currentRegionInfo,
  aiProperty: state => state.ai.aiProperty,
}
export default getters
