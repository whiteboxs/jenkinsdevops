import { defineStore } from "pinia";
import { ref } from 'vue'
export const useallrouteoStore = defineStore('router', () => {
  // 定义数据state


  const routeinfo = ref<any>([]);


  //定义修改数据的方法 action
  const updaterouteinfo = (newrouteinfo:any) => {
    // 在这里可以进行登录验证逻辑，验证成功后将token存储在state中
    routeinfo.value = newrouteinfo;
    // 还可以将token存储在本地或cookie等地方，以便在页面刷新后保持认证状态
    // localStorage.setItem('token', newToken);
};







  return {
    routeinfo,
    updaterouteinfo,
  }
},

);