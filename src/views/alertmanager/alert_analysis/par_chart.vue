<template>
  <el-form :model="query" style="display: flex; justify-content: flex-end;">
    <el-form-item label="统计范围" >
        <el-select clearable v-model="query.days" size="small" @change="handledaysChange" >
            <el-option v-for="option in days_list" :key="option.value" :label="option.label" :value="option.value"></el-option>
        </el-select>
    </el-form-item>
  </el-form>
    <div>  
        <v-chart :autoresize="true" :option="state.option" style="height: 400px"></v-chart>
    </div>
</template>

<script setup lang="ts" >
import { onMounted, ref,reactive } from 'vue'
import{ search_alert_type_count } from '@/http/alert/alert_analysis'



// 获取表格数据,点击菜单后才加载
onMounted(() => {
    //折线图
    init_par_Chart()
  
})


const query = ref<any>({
   days: 3
});


const state = reactive({
  option: {},

})


const days_list = ref([
    { label: '3天', value: '3' },
    { label: '7天', value: '7' },
    { label: '14天', value: '14' }
])


// 监听 el-select 的 change 事件，更新 days
const handledaysChange = (value:any) => {
    query.value.days = value
    //disposeChart()
    init_par_Chart()
};





const init_par_Chart = async () => {
      // 如果有之前的 ECharts 实例，先销毁它  
    try {
        const res = await search_alert_type_count(query.value);
         //去重筛选组名称
        const alertname = Array.from(new Set(res.data.data.map((item: { alertname: string }) => item.alertname)));
        const time = Array.from(new Set(res.data.data.map((item: { count_time: string }) => item.count_time)));
        // 构建 series 数据
        const seriesData = alertname.map(name => {
            const countData = <any>[]
            time.forEach(day => {
            // 查找对应的ip地址和天数一样的
            const dataForDay = res.data.data.find((item: {alertname:string, count_time: string }) => item.alertname === name && item.count_time === day);
            // 如果有对应的则返回值，如果没有返回0到列表
            countData.push(dataForDay ? dataForDay.count : 0);
            });
            return {
                name: name,
                type: 'bar',
                label: {
                show: true,
                formatter: function(params:any) {
                    // 当数据为 0 时不显示标签
                    return params.value === 0 ? '' : params.value;
                },
                fontSize: 16,
                rich: {
                    name: {}
                },
                position:'insideBottom',
                distance: 15,
                align: 'left',
                verticalAlign: 'middle',
                rotate: 90,
            },
            emphasis: {
                focus: 'series'
            },
                data: countData
            };
  });
        getparChart(alertname,seriesData,time) //从接口中请求到数据
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
   

       
const getparChart = (alertname:any,seriesData:any,time:any) => {  
    state.option =   {
        title: {
            text: '告警类型统计',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        legend: {
            data: alertname,
            left: '20%'
 
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
            }
        },
        xAxis: [
            {
            type: 'category',
            axisTick: { show: false },
            data: time
            }
        ],
        yAxis: [
            {
            type: 'value'
            }
        ],
        series: seriesData
}
};

  


</script>



<style scoped>


</style>
  