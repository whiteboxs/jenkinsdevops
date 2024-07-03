<template>
   <el-form :model="query" style="display: flex; justify-content: flex-end;">
    <el-form-item label="统计范围" >
        <el-select clearable v-model="query.days" size="small" @change="handledaysChange" >
            <el-option v-for="option in days_list" :key="option.value" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div>  
   <v-chart autoresize :option="state.option" style="height: 400px"></v-chart>
 </div>
</template>


<script setup lang="ts" >
import { onMounted, ref,reactive} from 'vue'
import{search_policy_alert_count} from '@/http/alert/alert_analysis'


// 获取表格数据,点击菜单后才加载
onMounted(() => {
   //饼图
   init_pie()
})
const query = ref<any>({
   days: 1,
});



const days_list = ref([
    { label: '1天', value: '1' },
    { label: '7天', value: '7' },
    { label: '30天', value: '30' }
])

// 监听 el-select 的 change 事件，更新 days
const handledaysChange = (value:any) => {
    query.value.days = value
    //disposeChart()
    init_pie()
};




const state = reactive({
option: {},

})

const init_pie = async() => {
const res = await search_policy_alert_count(query.value);
 const chartData = res.data.data.map((item:{policy_name:string,alert_count:number}) => ({
     name: item.policy_name,
     value: item.alert_count
 }));
 console.log('pie',chartData)
 getPieChart(chartData) //从接口中请求到数据
}
const getPieChart = (chartData:any) => {  
 state.option = {
 tooltip: {
   trigger: 'item'
 },
 legend: {
   top: '5%',
   left: 'center'
 },
 title: {
     text: '静默策略匹配数量'
 },
 series: [{
     type: 'pie',
     radius: ['40%', '70%'],
     avoidLabelOverlap: false,
     itemStyle: {
     borderRadius: 10,
     borderColor: '#fff',
     borderWidth: 2
     },
     label: {
     show: false,
     position: 'center'
     },
     emphasis: {
       label: {
         show: true,
         fontSize: 40,
         fontWeight: 'bold'
       }
     },
     labelLine: {
       show: true
     },
     data: chartData
     }]
     };
   }
</script >


<style scoped>


</style>
