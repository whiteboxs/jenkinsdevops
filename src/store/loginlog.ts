import { defineStore } from "pinia";
import { allloginlog} from '../http/api'
import { ref} from 'vue'
export const useloginlogStore = defineStore('loginlog', () => {
  // 定义数据state


  const loginloginfo = ref<any>([]);

 
  const getloginlog = async(data:any) => {
    const res = await allloginlog(data)
    console.log('logget',res.data)
    loginloginfo.value= res.data
  }


  return {
    loginloginfo,
    getloginlog
  }
},
);