<template> 
    <el-form :model="query" style="display: flex; justify-content: flex-end;">
    <el-form-item label="统计天数" >
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
import { onMounted, ref, reactive} from 'vue'
import{search_webhook_alert_count } from '@/http/alert/alert_analysis'



// 获取表格数据,点击菜单后才加载
onMounted(() => {
    //折线图
    init_line_Chart()
  
})



const query = ref<any>({
   days: 7
});

const days_list = ref([
    { label: '7天', value: '7' },
    { label: '30天', value: '30' },
    { label: '60天', value: '60' }
])


// 监听 el-select 的 change 事件，更新 days
const handledaysChange = (value:any) => {
    query.value.days = value
    console.log('query.value.days',query.value.days)
    //disposeChart()
    init_line_Chart()
};

const state = reactive({
  option: {},

})

const init_line_Chart = async () => {
      // 如果有之前的 ECharts 实例，先销毁它  
    try {
        const res = await search_webhook_alert_count(query.value);
         //去重筛选组名称
        const groupname = Array.from(new Set(res.data.data.map((item: { webhook_name: string }) => item.webhook_name)));
        //去重筛选日期
        const time = Array.from(new Set(res.data.data.map((item: { count_time: string }) => item.count_time)));
        // 构建 series 数据
        const seriesData = groupname.map(name => {
            const countData = res.data.data
                .filter((item:{webhook_name:string}) => item.webhook_name === name)
                .map((item:{count:number}) => item.count);
            return {
                name: name,
                type: 'line',
                stack: 'Total',
                data: countData
            };
        });
        getlineChart(groupname,time,seriesData) //从接口中请求到数据
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



const getlineChart = (groupname:any,time:any,seriesData:any) => {  
    state.option = {
            title: {
            text: '群组告警数'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: groupname
        },
        grid: {
            left: '2%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
           
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time,
            axisLabel: {
                interval: 'auto'  // 自动计算间隔
            }
        },
        yAxis: {
            type: 'value'
        },
        series: seriesData
        };
    }

      
</script>



<style scoped>


</style>
  