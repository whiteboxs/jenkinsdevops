import { defineStore } from "pinia";
import { all_scheduler_task,all_cron_task,all_task_func } from '@/http/system/crontab'
import { ref} from 'vue'
export const usecrontabStore = defineStore('crontab', () => {
  // 定义数据state


  const all_cron_task_info = ref<any>([]);

  const all_scheduler_task_info = ref<any>([]);

  const all_task_func_info = ref<any>([]);
  //总数
  const cron_task_count =ref(0)
 
  const get_all_cron_task = async(data:any) => {
    const res = await all_cron_task(data)
    all_cron_task_info.value= res.data.data
    cron_task_count.value = res.data.count
  }

   
  const get_all_scheduler_task = async(data:any) => {
    const res = await all_scheduler_task(data)
    console.log('scheduler_task_info',res.data.data)
    all_scheduler_task_info.value= res.data.data
  }

  const get_all_task_func = async() => {
    const res = await all_task_func()
    all_task_func_info.value= res.data.data
  }

  return {
    get_all_cron_task,
    get_all_scheduler_task,
    get_all_task_func,
    cron_task_count,
    all_cron_task_info,
    all_scheduler_task_info,
    all_task_func_info
  }
},
);