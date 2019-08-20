import axios from 'axios'
import store from '../store'
import { baseUrl } from './env'

// 创建axios实例
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  
  if (config.url.indexOf("/root/") >= 0) {
    console.log("request 拦截 加adminToken");
    if (store.getters.admin_token) {
      config.headers['Authorization'] = "Bearer " + store.getters.admin_token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
  }else if (config.url.indexOf("/api/") >= 0) {
    console.log("request 拦截 加apiToken");
    if (store.getters.token) {
      console.log(store.getters.token);
      config.headers['Authorization'] = "Bearer " + store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }else {
      console.log("没有token");
    }
  }
  
  return config;
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    // console.log("response拦截");
    return response.data
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

/**
 * 封装的发送请求的函数
 * vue Vue实例
 * url 发送的Url
 * data jsons数据
 * type 请求类型 目前有 POST 和 GET
 */
export function request (url = '', data = {}, type = 'POST')  {
  type = type.toUpperCase();
  if (type == 'GET') {
    console.log("get 类型请求");
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
    return new Promise((resolve, reject) => {
      service.get(url, {})
        .then(function (response) {
          // 返回结果
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
  } else if (type == 'DELETE') {
    console.log("delete 类型请求");
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
    return new Promise((resolve, reject) => {
      service.delete(url, {})
        .then(function (response) {
          // 返回结果
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
  } else if (type == 'POST') {
    console.log("post");
    return new Promise((resolve, reject) => {
      service.post(url, data, {})
        .then(function (response) {
          // 返回结果
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
  } else if (type == 'PUT') {
    console.log("put");
    return new Promise((resolve, reject) => {
      service.put(url, data, {})
        .then(function (response) {
          // 返回结果
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
  }

}

