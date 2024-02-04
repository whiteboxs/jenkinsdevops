
import { defineStore } from "pinia";
import { getticket_processing } from '../http/api'
import { ref } from "vue";

export const usemyticket_processing = defineStore('ticket_processing', () => {
    //定义数据state
    const myticket_processinglist = ref<any>([])

    //订单总数
    const count =ref(0)



    //异步请求
    const getmyticket_processing = async (queryform: any) => {
        const res = await getticket_processing(queryform)
        myticket_processinglist.value = res.data.data
        count.value = res.data.count
        console.log('请求带的参数feeback',myticket_processinglist.value)
      }



    //对象的方式return供组件使用
    return {
    getmyticket_processing,
    myticket_processinglist,
    count,
    }
})
