import axios ,{ AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox,  } from 'element-plus';
import router from '../router/index'
import {baseURL_dev,baseURL_pro} from '../config/baseURL'
//pinia
import {useAuthStore} from '../store/login.ts'
//接口
import {refresh_token} from '../http/api.ts'



//import{logout} from '../components/commonheader.vue'
//const BASE_URL = 'http://192.168.3.173:9002' // 设置基础 URL

// 创建 Axios 实例
const http = axios.create({
  baseURL: baseURL_dev,
  timeout: 10000, // 请求超时时间
  withCredentials: false, // 允许发送跨域凭证
});


    // 请求拦截器：在发送请求前做一些处理
http.interceptors.request.use(
  (config) => { 
        const token = useAuthStore().userinfo.access_token
        const refreshToken = useAuthStore().userinfo.refresh_token;
        if (refreshToken && config.headers &&  config.url?.indexOf('/token/refresh') !== -1  ) {
            config.headers['Authorization'] = `Bearer ${refreshToken}`;
        } else if (token  && config.headers && config.url?.indexOf('/token/refresh') ==-1)  {  
          config.headers['Authorization'] = `Bearer ${token}`;
        } 
    return config;
  },
  (error) => {
    // 对请求错误做些什么   
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code < 200 || data.code > 399) {
      ElMessage.error(data.msg || response.status);
      return Promise.reject('error');
    } else {
      return response;
    }
  },
  async (error) => {
    if (error.response) {
      const { status, config } = error.response;
      if (status === 401) {
        if (config.url?.includes('/token/refresh')) {
          ElMessageBox.confirm('当前页面已失效，请重新登录', {
            confirmButtonText: '确定',
            type: 'warning',
          }).then(() => {
            const usestore = useAuthStore();
            usestore.logout();
            router.replace('/login');
          });
        } else {
          try {
            const res = await refresh_token();
            if (res.data.msg) {
              useAuthStore().updateToken(res.data.access_token);
              return await http.request(config);
            }
          } catch (refreshError) {
            ElMessage.error('刷新token失败，请重新登录');
            const usestore = useAuthStore();
            usestore.logout();
            router.replace('/login');
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

// let flag = false
// // 响应拦截器
// http.interceptors.response.use(
//   (response) => {;
//       console.log('response.data',response.data)
//     if ( response.data.code < 200 || response.data.code > 399) {
//       ElMessage({
//         message: response.data.msg || response.status,
//         type: 'error',
//         duration: 5 * 1000
//       })
//       return Promise.reject('error')
//     } else {
//       // ElMessage.success(response.data.msg); //全局提醒暂时关闭
//       return response
//     }
//   },
//   async (error)  => {
//     //console.log('error',error)
//     if (error && error.response) {
//         if (flag) return
//         switch (error.response.status ) {
//           case 401:
//             if (error.response.status === 401 && error.response.config.url.indexOf('/token/refresh') !==-1) {
//               flag = true;
//               ElMessageBox.confirm(
//                   '当前页面已失效，请重新登录',
//                   {
//                       confirmButtonText: '确定',
//                       type: 'warning',
//                   }).then(() => {
                
//                 const usestore =useAuthStore()
//                 // 在这里执行退出系统的操作，例如清理本地存储或使JWT失效等
//                 usestore.logout();
//                 // 导航到登录页面
//                 router.replace('/login');
//                 })
//                 // 跳转完成后重置 flag 为 false
//                 flag = false
                
//             } else if (error.response.status === 401 && error.response.config.url.indexOf('/token/refresh') ==-1) {
//               const res = await refresh_token()
//               if (res.data.msg) {
//                   // 更新token
//                   useAuthStore().updateToken(res.data.access_token);
//                     // 修改请求配置，使用新的access_token
//                   //error.config.headers['Authorization'] = `Bearer ${res.data.access_token}`;
//                   // 重新发送被拦截的请求
//                   return await http(error.config)
//               }
//             }
//         } 
//       } 
//     return Promise.reject(new Error(error.response || 'Error')); 
//   }
// )

export default http;