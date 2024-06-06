import { defineStore } from "pinia";
import { allloginlog} from '@/http/api'
import { ref} from 'vue'
export const useloginlogStore = defineStore('loginlog', () => {
  // 定义数据state


  const loginloginfo = ref<any>([]);
  //总数
  const count =ref(0)
 
  const getloginlog = async(data:any) => {
    const res = await allloginlog(data)
    console.log('logget',res.data)
    loginloginfo.value= res.data
    count.value = res.data.count
  }


  return {
    loginloginfo,
    getloginlog,
    count
  }
},
);