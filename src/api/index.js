import {request} from './request'

export const GetTest = (url) => request(url, "", "GET");
export const PostTest = (url, args) => request(url, args, "POST");

export const Login = (args) => request('/user/login', args, "POST");
export const Register = (args) => request('/user/register', args, "POST");

export const AdminLogin = (args) => request('/admin/login', args, "POST");
export const GetUnitData = (args) => request('/root/unit', args, "GET");
export const SaveUnit = (args) => request('/root/unit', args, "PUT");

export const GetUnitLevel = (args) => request('/root/unitLevel', args, "GET");
export const SaveUnitLevel = (args) => request('/root/unitLevel', args, "PUT");

export const GetRegionData = (args) => request('/root/region', args, "GET");
export const SaveRegion = (args) => request('/root/region', args, "PUT");

export const CheckPwd = (args) => request('/api/user/checkPwd', args, "POST");
export const changeUserInfo = (args) => request('/api/user', args, "PUT");
export const ChangeUserSetting = (args) => request('/api/user/useSetting', args, "PUT");

export const GetInitUserMap = () => request('/api/userMap/init', '', "GET");
export const SaveTempMap = (args) => request('/api/userMap/saveTemp', args, "POST");
export const SaveMap = (args) => request('/api/userMap', args, "POST");
export const SimpleDrawing = (args) => request('/api/userMap/simpleDrawing', args, "POST");
export const GetUserMap = () => request('/api/userMap', '', "GET");
export const DelUserMap = (url) => request(url, '', "DELETE");

// 获取遭遇地图
export const GetEncounterMap = () => request("/encounterMap", '', "GET");
// 初始化map 信息
export const InitEncounterMap = (args) => request("/encounter/initSetting", args, "GET");
// 生成record
export const RecordInit = (args) => request("/record/init", args, "POST");
// 获取记录
export const GetRecordById =(url) => request(url, '', "GET");

// 获取一个单位的详细信息
export const GetUnitInfo =(args) => request('/unitInfo', args, "GET");

export const GetRegionInfo =(args) => request('/regionInfo', args, "GET");

// 获取所有的地图
export const GetUnitInfoList =(args) => request('/unitInfo/list', args, "GET");

// 保存游戏
export const SaveUserRecord =(args) => request('/unitInfo/list', args, "GET");


