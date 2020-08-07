import axios from 'axios'

// 配置公共的url
axios.defaults.baseURL = process.env.VUE_APP_URL
// https://www.liulongbin.top:8888/api/private/v1/
// http://47.115.124.102:8888/api/private/v1
// 配置请求的拦截器
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
}, function (error) {
  return Promise.reject(error);
});

// 配置响应的拦截器
axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default axios 