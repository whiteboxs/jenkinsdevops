
import { defineStore } from "pinia";
import { all_slb_ecs} from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const useslb_ecs_summarystore = defineStore('slb_ecs_summary', () => {
    //定义数据state
    const slb_ecsinfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)



    //异步请求
    const getallslb_ecs = async (data:any) => {
        const res = await all_slb_ecs(data)
        console.log('res',res)
        slb_ecsinfo.value = res.data
        count.value = res.data.count
        console.log('nginx_config',slb_ecsinfo.value)
      }



    //对象的方式return供组件使用
    return {
    getallslb_ecs,
    slb_ecsinfo,
    count,
    }
})
