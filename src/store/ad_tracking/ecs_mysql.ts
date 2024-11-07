
import { defineStore } from "pinia";
import { all_ecs_mysql} from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const useallecs_mysqlstore = defineStore('allecs_mysql', () => {
    //定义数据state
    const ecs_mysqlinfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)



    //异步请求
    const getecs_mysql = async (data:any) => {
        const res = await  all_ecs_mysql(data)
        ecs_mysqlinfo.value = res.data.data
        count.value = res.data.count
        console.log('ecs_mysqlinfo',ecs_mysqlinfo.value)
      }



    //对象的方式return供组件使用
    return {
    ecs_mysqlinfo,
    getecs_mysql,
    count,
    }
})
