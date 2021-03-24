import Axios from 'axios';
import store from './store';
import { ElMessage } from "element-plus";

const request = Axios.create({
  baseURL: '/api',
  timeout: 30000,
});

request.interceptors.request.use(function (config) {
  if (store.state.access_token) {
    config.headers['Authorization'] = `Bearer ${store.state.access_token}`;
  }
  return config;
})

request.interceptors.response.use(function (response) {
  if (response.data.errmsg) {
    ElMessage.error(response.data.errmsg);
    return Promise.reject(response.data.errmsg);
  }
  return response;
}, function (error) {
  ElMessage.error(error);
  if (error.response.status === 401) {
    store.commit('logout');
  }
  return Promise.reject(error);
})

export default request;
