import { log } from "util";
import store from ".";

const getters = {
  // 游戏用户有关
  user: state => state.user.user,
  token: state => state.user.token,
  admin_token: state => state.user.admin_token,

  // 游戏核心数据
  game: state=> state.gameCore.game,
  template: state=> state.gameCore.template,
  mapState: state=> state.gameCore.mapState,
  cUnit: state=> state.gameCore.game.curr_unit,
  cRegion: state=> state.gameCore.game.curr_region,

  // 移动有关
  moveAreas: state=> state.move.moveAreas,
  moveLine: state=>state.move.moveLine,
  moveLength:state=>state.move.moveLength,
  // 行为有关
  action:state=>state.action.action,
  leftChanges:state=>state.action.leftChanges,
  animates:state=>state.action.animates,
  // 攻击有关
  attachArea:state=>state.attach.attachArea,
  attachPoint:state=>state.attach.attachPoint,

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
