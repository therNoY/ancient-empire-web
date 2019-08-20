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





