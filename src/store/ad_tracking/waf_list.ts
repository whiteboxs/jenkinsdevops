
import { defineStore } from "pinia";
import { all_waf } from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const usewaf_liststore = defineStore('waf_list', () => {
    //定义数据state
    const wafinfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)


    

    //异步请求
    const getall_waf = async (data:any) => {
        const res = await all_waf(data)
        console.log('res',res)
        wafinfo.value = res.data
        count.value = res.data.count
        console.log('wafinfo',wafinfo.value)
      }



    //对象的方式return供组件使用
    return {
    getall_waf,
    wafinfo,
    count,
    }
})
