import { defineStore } from "pinia";
import { branch} from '../http/api'
import { ref } from 'vue'
export const useallbransh = defineStore('branch', () => {
  // 定义数据state


  const branchlist = ref<any>([]);

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

 
  const getbranch = async(id:any) => {
    const res = await branch(id)
    branchlist.value= res.data.data
    console.log('res',res.data.data);
    console.log('branchlist',branchlist.value);
  }



  return {
    branchlist,
    getbranch
  }
},
);