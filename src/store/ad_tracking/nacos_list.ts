
import { defineStore } from "pinia";
import { all_nacos } from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const usenacos_liststore = defineStore('nacos_list', () => {
    //定义数据state
    const nacosinfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)


    

    //异步请求
    const getall_nacos = async (data:any) => {
        const res = await all_nacos(data)
        console.log('res',res)
        nacosinfo.value = res.data
        count.value = res.data.count
        console.log('nacosinfo',nacosinfo.value)
      }



    //对象的方式return供组件使用
    return {
    getall_nacos,
    nacosinfo,
    count,
    }
})
