
import { defineStore } from "pinia";
import { all_rds } from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const userds_liststore = defineStore('rds_list', () => {
    //定义数据state
    const rdsinfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)


    

    //异步请求
    const getall_rds = async (data:any) => {
        const res = await all_rds(data)
        console.log('res',res)
        rdsinfo.value = res.data
        count.value = res.data.count
        console.log('rdsinfo',rdsinfo.value)
      }



    //对象的方式return供组件使用
    return {
    getall_rds,
    rdsinfo,
    count,
    }
})
