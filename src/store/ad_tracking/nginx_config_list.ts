
import { defineStore } from "pinia";
import { all_nginx_config} from '@/http/ad_tracking/nginx'
import { ref } from "vue";

export const usenginx_configstore = defineStore('nginx_config', () => {
    //定义数据state
    const nginx_configinfo = ref<any>([{
    }])

    //ecs总数
    const count =ref(0)



    //异步请求
    const getnginx_config = async (data:any) => {
        const res = await all_nginx_config(data)
        console.log('res',res)
        nginx_configinfo.value = res.data.data
        count.value = res.data.count
        console.log('nginx_config',nginx_configinfo.value)
      }



    //对象的方式return供组件使用
    return {
    nginx_configinfo,
    getnginx_config,
    count,
    }
})
