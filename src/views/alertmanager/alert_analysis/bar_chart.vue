<template>
      <el-form :model="query" style="display: flex; justify-content: flex-end;">
    <el-form-item label="统计范围" >
        <el-select clearable v-model="query.days" size="small" @change="handledaysChange" >
            <el-option v-for="option in days_list" :key="option.value" :label="option.label" :value="option.value"></el-option>
        </el-select>
    </el-form-item>
    </el-form>
     <div >
      <v-chart :autoresize="true" :option="state.option" style="height: 400px"></v-chart>
    </div>
  </template>
  
  
  <script setup lang="ts" >
  import { onMounted, ref,reactive} from 'vue'
  import{search_alert_ip_count} from '@/http/alert/alert_analysis'
import { number } from 'echarts';
  
  


  // 获取表格数据,点击菜单后才加载
  onMounted(() => {
      //条形图
      init_bar_Chart()
  })
  const query = ref<any>({
     days:3,
     query_time:[]
  });
  const days_list = ref([
    { label: '3天', value: '3' },
    { label: '7天', value: '7' },
    { label: '14天', value: '14' }
])


// 监听 el-select 的 change 事件，更新 days
const handledaysChange = (value:any) => {
    query.value.days = value
    console.log('query.value.days',query.value.days)
    init_bar_Chart()
};



  const state = reactive({
  option: {},

})
  
const init_bar_Chart = async() => {
  const res = await search_alert_ip_count(query.value);
    // 对后端返回的数据进行处理
    const mergedData = <any>[];

    res.data.data.forEach((item:{ count: number,instance:string,count_time:string}) => {
        const instance = item.instance;
        const ipAddress = instance.includes('/') ? instance.match(/\/\/([^:/]+)/)![1] : instance.split(':')[0]; // 提取IP地址
        const countTime = item.count_time; // 假设这是用于判断时间的字段

        // 查找是否已经存在相同 ipAddress 的条目
        const existingItem = mergedData.find((entry:{ipAddress: string,countTime: string}) => entry.ipAddress === ipAddress && entry.countTime === countTime);
        if (existingItem) {
            // 如果存在，则累加 count
            existingItem.count += item.count;
        } else {
            // 如果不存在，则添加新条目
            mergedData.push({
                ip: ipAddress,
                count: item.count,
                count_time:countTime
            });
        }
});
   //去重筛选组名称
   const ip_address =  Array.from(new Set(mergedData.map((item: { ip: string }) => item.ip)));
   //去重筛选日期
   const time = Array.from(new Set(mergedData.map((item: { count_time: string }) => item.count_time)));
   // 构建 series 数据
   const seriesData = ip_address.map(ip => {
      const countData = <any>[]
      time.forEach(day => {
      // 查找对应的ip地址和天数一样的
      const dataForDay = mergedData.find((item: {ip:string, count_time: string }) => item.ip === ip && item.count_time === day);
      // 如果有对应的则返回值，如果没有返回0到列表
      countData.push(dataForDay ? dataForDay.count : 0);
      });
            return {
                name: ip,
                type: 'bar',
                stack: 'total',
                label: {
                  show: true,
                  formatter: function(params:any) {
                    // 当数据为 0 时不显示标签
                    return params.value === 0 ? '' : params.value;
                }
                },
                emphasis: {
                  focus: 'series'
                },
                data: countData
            };
  });



   console.log('merged',seriesData,ip_address,time)
  getPieChart(seriesData,time) //从接口中请求到数据
}

const getPieChart = (seriesData:any,time:any) => {  
    state.option = {
      title: {
            text: '告警主机统计',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {
          left: '20%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: time
        },
        series: seriesData
        };
}
  </script >
  
  
  <style scoped>
  
  
  </style>
  