import { request } from './request'

export const GetTest = (url) => request(url, "", "GET");
export const PostTest = (url, args) => request(url, args, "POST");

// 用户操作
export const Login = (args) => request('/user/login', args, "POST");
export const Register = (args) => request('/user/register', args, "POST");

export const AdminLogin = (args) => request('/admin/login', args, "POST");

/**
 * 获取用户名称
 * @param {*} args 
 * @returns 
 */
export const GetUserNameById = (args) =>  request('/api/user/name', args, "GET");

/**
 * 保存单位信息
 * @param {} args 
 */
export const SaveUnitInfo = (args) => request('/api/unitMes', args, "PUT");

/**
 * 根据单位id获取等级信息
 * @param {} args 
 */
export const GetUnitLevelInfoById = (id) => request('/api/unitLevel/' + id, '', "GET");
/**
 * 获取模板的所有单位信息 用于缓存
 * @param {*} args 
 */
export const GetUnitLevelByTemp = (args) => request('/api/unitLevel/list/' + args, '', "GET");
/**
 * 获取单位分页数据
 * @param {} args 
 */
export const GetUnitMesList = (args) => request('/api/unitMes/list', args, "POST");
/**
 * 获取全部单位信息
 * @param {*} args 
 */
export const GetAllUserUnitMes = (args) => request('/api/unitMes/all', args, "POST");
/**
 * 获取单位的能力信息
 * @param {*} id 
 */
export const GetUnitAbilityInfo = (id) => request('/api/unitAbility/' + id, '', "GET");
/**
 * 获取所有的能力信息
 */
export const GetAllAbilityInfo = () => request('/api/ability/list', '', "GET");

export const GetUnitLevel = (args) => request('/root/unitLevel', args, "GET");
export const SaveUnitLevel = (args) => request('/root/unitLevel', args, "PUT");

export const GetRegionData = (args) => request('/root/region', args, "GET");
export const SaveRegion = (args) => request('/root/region', args, "PUT");

/**
 * 修改密码
 * @param {*} args 
 * @returns 
 */
export const ChangePwd = (args) => request('/api/user/changePwd', args, "POST");
/**
 * 修改用户info
 * @param {*} args 
 * @returns 
 */
export const ChangeUserInfo = (args) => request('/api/user', args, "PUT");
export const ChangeUserSetting = (args) => request('/api/user/useSetting', args, "PUT");

// 用户地图有关
/**
 * 获取草稿地图
 * @returns 
 */
export const GetInitUserMap = () => request('/api/userMap/draft', '', "GET");
/**
 * 保存临时地图
 * @param {*} args 
 * @returns 
 */
export const SaveTempMap = (args) => request('/api/userMap/saveTemp', args, "POST");
/**
 * 保存地图
 * @param {*} args 
 * @returns 
 */
export const SaveMap = (args) => request('/api/userMap', args, "POST");
/**
 * 优化地图
 * @param {*} args 
 * @returns 
 */
export const SimpleDrawing = (args) => request('/api/userMap/simpleDrawing', args, "POST");
/**
 * 获取用户创建的地图
 * @returns 
 */
export const GetUserMapList = () => request('/api/userMap/list', '', "GET");
/**
 * 获取用户下载的地图
 * @returns 
 */
export const GetUserDownloadMap = () => request('/api/userMap/download/list', '', "GET");
/**
 * 获取世界地图
 * @returns 
 */
export const GetWorldMapList = () => request('/api/worldMap/list', '', "GET");
/**
 * 根据ID获取地图 可以不展示某些单位
 * @param {*} id 
 * @returns 
 */
export const GetUserMapById = (id) => request('/api/userMap/' + id, '', "GET");
/**
 * 根据ID获取地图 可以不展示某些单位
 * @param {*} id 
 * @returns 
 */
export const GetUserMapWithConfig = (config) => request('/api/userMap/withConfig', config, "POST");

export const DelUserMap = (id) => request('/api/userMap/' + id, '', "DELETE");

/**
 * 获取遭遇地图
 */
export const GetEncounterMap = () => request("/encounterMap", '', "GET");
export const GetUserTemp = (id) => request("/api/userTemp/" + id, '', "GET");

// 初始化map 信息
export const InitEncounterMap = (args) => request("/encounter/initSetting", args, "GET");
/**
 * 根据历史开始游戏
 * @param {*} args 
 * @returns 
 */
 export const MapInit = (args) => request("/api/map/init", args, "POST");
/**
 * 根据历史开始游戏
 * @param {*} args 
 * @returns 
 */
export const RecordInit = (args) => request("/api/record/init", args, "POST");
/**
 * 根据历史开始游戏
 * @param {*} args 
 * @returns 
 */
 export const RoomInit = (args) => request("/api/room/init", args, "POST");
// 根据Id获取存档
export const GetRecordById = (id) => request("/record/" + id, '', "GET");

// 获取一个单位的详细信息
export const GetUnitInfo = (args) => request('/unitInfo', args, "GET");
/**
 * 获取用户模板单位
 * @param {*} args 
 */
export const GetAllUserUnit = (args) => request('/api/userTemp/unitList', args, "POST");
/**
 * 保存模板信息
 * @param {*} args 
 */
export const SaveTemplateInfo = (args) => request('/api/userTemp/saveTemplate', args, "POST");

/**
 * 获取用户模板
 * @param {*} args 
 */
export const GetUserTemplate = (args) => request("/api/userTemp/page", args, "POST");
/**
 * 获取网络模板
 * @param {*} args 
 */
export const GetDownloadAbleTemplate = (args) => request("/api/userTemp/download/page", args, "POST");
/**
 * 下载模板
 * @param {} args 
 */
export const DownloadTemplate = (args) => request("/api/userTemp/downloadTemp", args, "POST");
/**
 * 获取用户下载的模板
 * @param {*} args 
 */
export const GetUserAttentionTemp = (args) => request("/api/userAttentionTemp/page", args, "POST");
/**
 * 获取用户的草稿模板
 * @param {*} args 
 */
export const GetUserDraftTemplate = (args) => request('/api/userTemp/draftTemplate', args, "GET");
/**
 * 获取用户的草稿模板
 * @param {*} args 
 */
export const RemoveUserTemplate = (args) => request('/api/userTemp/' + args.id, {}, "DELETE");
/**
 * 移除用户模板
 * @param {*} args 
 */
export const RemoveUserTemplateAttention = (args) => request('/api/userTempAttention/' + args.id, {}, "DELETE");


// 获取可以添加到当前模板的单位
export const GetAddTempAbleUnit = (args) => request('/api/userTemp/addAbleUnitList', args, "POST");

export const GetRegionInfo = (args) => request('/regionInfo', args, "GET");

// 获取所有的地图
export const GetUnitInfoList = (args) => request('/unitInfo/list', args, "GET");

// 保存游戏
export const SaveUserRecord = (args) => request('/unitInfo/list', args, "GET");
/**
 * 获取用户记录使用分页
 * @param {*} args 
 */
export const getUserRecordList = (args) => request('/api/userRecord/list', args, "POST")

export const SendMessage = (args) => request("/api/message/send", args, "POST");


/**
 * 获取房间号
 * @param {*} args 
 */
export const GetRoomListByPage = (args) =>request("/api/room/list", args, "POST");
/**
 * 创建房间
 * @param {*} args 
 * @returns 
 */
export const CreateRoom = (args) =>request("/api/room/save", args, "PUT");
/**
 * 玩家加入
 * @param {*} args 
 * @returns 
 */
export const PlayerJoinRoom = (args) =>request("/api/room/playerJoin", args, "PUT");

/**
 * 改变控制军队
 * @param {}} args 
 * @returns 
 */
export const ChangeArmy = (args) =>request("/api/room/changeArmy", args, "POST");
/**
 * 离开控制军队 
 * @param {*} args 
 * @returns 
 */
export const LevelCtlArmy = (args) =>request("/api/room/levelCtlArmy", args, "POST");

