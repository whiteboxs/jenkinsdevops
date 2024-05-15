import { defineStore } from "pinia";
import { alloperlog } from '../http/api'
import { ref} from 'vue'
export const useoperlogStore = defineStore('operlog', () => {
  // 定义数据state


  const operloginfo = ref<any>([]);

 
  const getoperlog = async(data:any) => {
    const res = await alloperlog(data)
    console.log('logget',res.data)
    operloginfo.value= res.data
  }


  return {
    operloginfo,
    getoperlog
  }
},
);