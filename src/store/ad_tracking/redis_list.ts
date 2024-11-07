
import { defineStore } from "pinia";
import { all_redis } from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const useredis_liststore = defineStore('redis_list', () => {
    //定义数据state
    const redisinfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)


    

    //异步请求
    const getall_redis = async (data:any) => {
        const res = await all_redis(data)
        console.log('res',res)
        redisinfo.value = res.data
        count.value = res.data.count
        console.log('redisinfo',redisinfo.value)
      }



    //对象的方式return供组件使用
    return {
    getall_redis,
    redisinfo,
    count,
    }
})
