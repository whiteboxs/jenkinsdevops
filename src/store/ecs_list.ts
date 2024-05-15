
import { defineStore } from "pinia";
import { getall_ecs } from '../http/api'
import { ref } from "vue";

export const useecsstore = defineStore('ecs_list', () => {
    //定义数据state
    const ecslist = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)



    //异步请求
    const getecs = async (data:any) => {
        const res = await getall_ecs(data)
        ecslist.value = res.data.data
        count.value = res.data.TotalCount
        console.log('ecslit',ecslist.value)
      }



    //对象的方式return供组件使用
    return {
    getecs,
    ecslist,
    count,
    }
})
