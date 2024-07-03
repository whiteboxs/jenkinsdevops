import { defineStore } from "pinia";
import { allsilences_policy } from '@/http/alert/alert'
import { ref} from 'vue'
export const usesilences_policyStore = defineStore('silences_policy', () => {
  // 定义数据state


  const silences_policyinfo = ref<any>([]);

  //总数
  const count =ref(0)

  const getsilences_policy = async(data:any) => {
    const res = await allsilences_policy(data)
    silences_policyinfo.value= res.data
    count.value = res.data.count
  }


  return {
    silences_policyinfo,
    getsilences_policy,
    count
  }
},
);