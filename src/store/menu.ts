import { defineStore } from "pinia";
import { getallmenus } from '../http/api'
import { ref } from 'vue'
export const useallmenuStore = defineStore('allmenu', () => {
  // 定义数据state


  const allmenuinfo = ref<any>([]);

  //定义修改数据的方法 action
  const updateToken = (newToken:any) => {
    // 在这里可以进行登录验证逻辑，验证成功后将token存储在state中
    allmenuinfo.value.permiss = newToken;
    // 还可以将token存储在本地或cookie等地方，以便在页面刷新后保持认证状态
    // localStorage.setItem('token', newToken);
};
 
 
  const getallmenu = async () => {
    const res = await getallmenus()
    allmenuinfo.value= res.data.data
  }

  return {
    allmenuinfo,
    getallmenu
  }
},
);