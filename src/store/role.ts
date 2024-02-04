import { defineStore } from "pinia";
import { getallroles } from '../http/api'
import { ref } from 'vue'
export const useallroleStore = defineStore('allrole', () => {
  // 定义数据state


  const allroleinfo = ref<any>([]);

  // 定义getter
  //const isAuthenticated = computed(() => !!userinfo.value);
//获取id
 // const userid = computed(() => userinfo.value.user_id);
  
  // 定义修改数据的方法 action
  // const login = (newToken) => {
  //     // 在这里可以进行登录验证逻辑，验证成功后将token存储在state中
  //     userinfo.value = newToken;
  //     // 还可以将token存储在本地或cookie等地方，以便在页面刷新后保持认证状态
  //     // localStorage.setItem('token', newToken);
  // };

 
  const getallrole = async () => {
    const res = await getallroles()
    allroleinfo.value= res.data.data
    // console.log('allroleinfo.value',allroleinfo.value)
  }

  return {
    allroleinfo,
    getallrole
  }
},
);