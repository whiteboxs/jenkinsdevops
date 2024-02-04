import axios ,{ AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox,  } from 'element-plus';
import { diffTokenTime } from '../utils/auth.ts';
import router from '../router/index'
import {baseURL_dev} from '../config/baseURL'
//pinia
import {useAuthStore} from '../store/login.ts'

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
      (config: AxiosRequestConfig) => { 
        // if (localStorage.getItem('userinfo')) {
          // if (diffTokenTime()) {
          //     const usestore =useAuthStore()
          //       // 在这里执行退出系统的操作，例如清理本地存储或使JWT失效等
          //     usestore.logout();
          //       // 导航到登录页面
          //       router.replace('/login');
          //     };
          //   }
        //pinia拿token数据
        const usestore =useAuthStore()
        const token = usestore.userinfo.token
        
        if (token && config && config.headers) {  
          config.headers['Authorization'] = `Bearer ${token}`;  
        } else {  
          console.error('token没有找到.headers not defined');  
        }  
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 响应拦截器
http.interceptors.response.use(
  (response) => {;
     console.log('response.data',response.data)
    if ( response.data.code < 200 || response.data.code > 399) {
      ElMessage({
        message: response.data.msg || response.status,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      // ElMessage.success(response.data.msg); //全局提醒暂时关闭
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    console.log('error.response,',error.response)
    if (error.response.status === 401 ) {
      //提示
      ElMessageBox.alert('当前页面已失效，请重新登录', '提示', {});
      const usestore =useAuthStore()
      // 在这里执行退出系统的操作，例如清理本地存储或使JWT失效等
      usestore.logout();
      // 导航到登录页面
      router.replace('/login');
    } else {
      ElMessage({
      message: error.response.data || '系统出错',
      type: 'error'
    });
    return Promise.reject(new Error(error.response.data || 'Error'));
   }
  }
)


export default http;