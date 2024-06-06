import { defineStore } from "pinia";
import { allalert_webhook } from '@/http/alert/api'
import { ref} from 'vue'
export const usealertwebgroupStore = defineStore('alertwebgroup', () => {
  // 定义数据state


  const alertwebgroupinfo = ref<any>([]);

  //总数
  const count =ref(0)

  const getalertwebgroup = async(data:any) => {
    const res = await allalert_webhook(data)
    console.log('allalert_webhook',res.data)
    alertwebgroupinfo.value= res.data
    count.value = res.data.count
  }


  return {
    alertwebgroupinfo,
    getalertwebgroup,
    count
  }
},
);