  import { defineStore } from "pinia";
  import { getenvironments } from '../http/api'
  import { ref } from 'vue'
  export const useenvironmentstore = defineStore('environment', () => {
      //定义数据state
      const environmentlist = ref<any>([])

      //定义修改数据的方法 action 同步+异步




      //异步请求
      const getenvironment = async () => {
          const res = await getenvironments()
          environmentlist.value = res.data.data
        }


      //对象的方式return供组件使用
      return {
      getenvironment,
      environmentlist
      }
  })

