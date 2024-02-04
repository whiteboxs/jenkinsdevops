import { defineStore } from "pinia";
import { login } from '../http/api'
import { ref,computed } from 'vue'
export const useAuthStore = defineStore('login', () => {
  // 定义数据state


  const userinfo = ref<any>([]);

  // 定义getter
  const isAuthenticated = computed(() => !!userinfo.value);
//获取id
  const userid = computed(() => userinfo.value.user_id);
  
  // 定义修改数据的方法 action
  // const login = (newToken) => {
  //     // 在这里可以进行登录验证逻辑，验证成功后将token存储在state中
  //     userinfo.value = newToken;
  //     // 还可以将token存储在本地或cookie等地方，以便在页面刷新后保持认证状态
  //     // localStorage.setItem('token', newToken);
  // };

  const logout = () => {  
    // 在这里可以进行登出逻辑，清除token并执行其他操作
    userinfo.value = '';
    // 同样要清除本地存储的token
    //localStorage.removeItem('token');
  };
  const getuserinfo = async(logDate:any) => {
    const res = await login(logDate)
    userinfo.value= res.data
 

    
  }

  return {
    userinfo,
    isAuthenticated,
    logout,
    getuserinfo,
    userid
  }
},
    //开启数据缓存
    { persist: {
      enabled: true,
      strategies: [{
        key: 'gongdan',
        storage: localStorage,
     //   path: ['token']
      }]
    }
  });