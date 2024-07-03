
import { defineStore } from "pinia";
import { allsilences } from '@/http/alert/alert'
import { ref } from "vue";

export const useallsilencesstore = defineStore('allsilences', () => {
    //定义数据state
    const silenceslist = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)



    //异步请求
    const getsilenceslist = async (data:any) => {
        const res = await allsilences(data)
        silenceslist.value = res.data.data
        count.value = res.data.count
        console.log('silenceslist',silenceslist.value)
      }



    //对象的方式return供组件使用
    return {
    silenceslist,
    getsilenceslist,
    count,
    }
})
