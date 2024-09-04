
import { defineStore } from "pinia";
import { all_nginx_server} from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const useallnginx_serverstore = defineStore('allnginx_server', () => {
    //定义数据state
    const nginx_serverinfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)



    //异步请求
    const getnginx_server = async (data:any) => {
        const res = await all_nginx_server(data)
        nginx_serverinfo.value = res.data.data
        count.value = res.data.count
        console.log('nginx_server',nginx_serverinfo.value)
      }



    //对象的方式return供组件使用
    return {
    nginx_serverinfo,
    getnginx_server,
    count,
    }
})
