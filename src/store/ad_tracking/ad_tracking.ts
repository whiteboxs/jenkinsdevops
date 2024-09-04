
import { defineStore } from "pinia";
import { all_ad_tracking } from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const usead_trackingstore = defineStore('ad_tracking', () => {
    //定义数据state
    const ad_trackinginfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)


    

    //异步请求
    const getall_ad_tracking = async (data:any) => {
        const res = await all_ad_tracking(data)
        console.log('res',res)
        ad_trackinginfo.value = res.data
        count.value = res.data.count
        console.log('ad_trackinginfo',ad_trackinginfo.value)
      }



    //对象的方式return供组件使用
    return {
    getall_ad_tracking,
    ad_trackinginfo,
    count,
    }
})
