
import { defineStore } from "pinia";
import { getusertickets } from '@/http/api'
import { ref } from "vue";

export const usemyticketstore = defineStore('userselfticket', () => {
    //定义数据state
    const myticketlist = ref<any>([])

    //订单总数
    const count =ref(0)



    //异步请求
    const getmytickets = async (queryform:any) => {
        const res = await getusertickets(queryform)
        myticketlist.value = res.data.data
        count.value = res.data.count
        console.log('请求带的参数',myticketlist.value)
      }



    //对象的方式return供组件使用
    return {
    getmytickets,
    myticketlist,
    count,
    }
})
