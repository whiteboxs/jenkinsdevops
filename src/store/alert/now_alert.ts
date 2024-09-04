import {now_alert} from '@/http/alert/alert'
import { defineStore } from "pinia";
import { ref} from 'vue'


export const usenow_alertStore = defineStore('now_alert', () => {
    
  // 定义数据state

  const now_alert_info = ref<any>([]);

  //总数
  const count =ref(0)


  const get_now_alert = async () => {
      // 如果有之前的 ECharts 实例，先销毁它  
      const res = await now_alert();
      now_alert_info.value = res.data.data
      count.value = res.data.count
      console.log(now_alert_info.value)
  }


  return {
    now_alert_info,
    get_now_alert,
    count
  }
},
);