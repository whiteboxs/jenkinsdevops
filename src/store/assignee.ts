import { defineStore } from "pinia";
import { getassignees } from '@/http/api'
import { ref } from 'vue'
export const useassigneestore = defineStore('assignee', () => {
    //定义数据state
    const assigneelist = ref<any>([])

    //定义修改数据的方法 action 同步+异步




    //异步请求
    const getassignee = async () => {
        const res = await getassignees()
        assigneelist.value = res.data.data
      }


    //对象的方式return供组件使用
    return {
    getassignee,
    assigneelist
    }
})
