import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox,  } from 'element-plus';
import router from '../router/index'
//pinia
import {useAuthStore} from '@/store/login'
//接口
import {refresh_token} from '@/http/api'
//loading
import { showLoading, hideLoading } from '@/utils/loading'


//增加新的请求参数类型
declare module 'axios' {
  //请求自定义参数
  interface AxiosRequestConfig {
      // 是否显示加载框
      ifLoading?: boolean
      // // 是否允许重复请求
      // repeatRequest?: boolean
      // // 登录 token
      // isToken?: any;
  }
}

// 创建 Axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 30000, // 请求超时时间
  withCredentials: false, // 允许发送跨域凭证
});


    // 请求拦截器：在发送请求前做一些处理
http.interceptors.request.use(
  (config) => { 
     //加载动画
     if (config?.ifLoading) showLoading();
    const token = useAuthStore().userinfo.access_token
    const refreshToken = useAuthStore().userinfo.refresh_token;
    if (refreshToken && config.headers &&  config.url?.indexOf('/token/refresh') !== -1  ) {
      config.headers['Authorization'] = `Bearer ${refreshToken}`;
    } else if (token  && config.headers && config.url?.indexOf('/token/refresh') ==-1)  {  
      config.headers['Authorization'] = `Bearer ${token}`;
      
    } 
    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么   
    return Promise.reject(error);
  }
);



let flag = false
// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {;
    console.log('response.data',response.data)
    // 关闭加载 动画
    if (response.config?.ifLoading) hideLoading();
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
  async (error)  => {
    //console.log('error',error)
    // 关闭加载 动画
    if (error.response.config?.ifLoading) hideLoading();
    if (error && error.response) {
        if (flag) return
        switch (error.response.status ) {
          case 401:
            error.message = '当前页面已失效，请重新登录'
            if (error.response.status === 401 && error.response.config.url.indexOf('/token/refresh') !==-1) {
              flag = true; // 设置 flag 为 true，避免重复弹窗
              ElMessageBox.confirm(
                  '当前页面已失效，请重新登录',
                  {
                      confirmButtonText: '确定',
                      type: 'warning',
                  }).then(() => {
                
                const usestore =useAuthStore()
                // 在这里执行退出系统的操作，例如清理本地存储或使JWT失效等
                usestore.logout();
                // 导航到登录页面
                router.replace('/login');
                })
                // 跳转完成后重置 flag 为 false
                flag = false
                
            } else if (error.response.status === 401 && error.response.config.url.indexOf('/token/refresh') ==-1) {
              const res = await refresh_token()
              if (res.data.msg) {
                  // 更新token
                  useAuthStore().updateToken(res.data.access_token);
                    // 修改请求配置，使用新的access_token
                  error.config.headers['Authorization'] = `Bearer ${res.data.access_token}`;
                  // 重新发送被拦截的请求
                  return await http(error.config)
              }
            }
          case 400:
            error.message = '错误请求'
          break;
          case 403:
            error.message = '拒绝访问'
            break;
          case 404:
            error.message = '请求错误,未找到该资源'
            // window.location.href = "/NotFound"
            break;
          case 405:
            error.message = '请求方法未允许'
            break;
          case 408:
            error.message = '请求超时'
            break;
          case 500:
            error.message = '服务器端出错'
            break;
          case 501:
            error.message = '网络未实现'
            break;
          case 502:
            error.message = '网络错误'
            break;
          case 503:
            error.message = '服务不可用'
            break;
          case 504:
            error.message = '网络超时'
            break;
          case 505:
            error.message = 'http版本不支持该请求'
            break;
        default:
            error.message = `连接错误${error.response.status}`
          }
        } else {
          // 超时处理
          if (JSON.stringify(error).includes('timeout')) {
              error.message = '服务器响应超时，请刷新当前页'
          } else {
              error.message = '连接服务器失败'
          }
      }
      //提示
      ElMessage.error(error.message)
  
      /***** 处理结束 *****/
      return Promise.resolve(error)
  })

export default http;