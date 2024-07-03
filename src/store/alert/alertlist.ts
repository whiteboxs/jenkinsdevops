
import { defineStore } from "pinia";
import { allalert } from '@/http/alert/alert'
import { ref } from "vue";

export const useallalertstore = defineStore('allalert', () => {
    //定义数据state
    const alertlist = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)



    //异步请求
    const getalertlist = async (data:any) => {
        const res = await allalert(data)
        alertlist.value = res.data.data
        count.value = res.data.count
        console.log('alaertlist',alertlist.value)
      }



    //对象的方式return供组件使用
    return {
    alertlist,
    getalertlist,
    count,
    }
})
