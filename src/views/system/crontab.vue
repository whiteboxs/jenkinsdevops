<template>
  <div>
		<div class="container">
        <el-form :model="query" ref="queryFormRef" :rules="rules" :inline="true" label-width="auto">
          <el-form-item label="任务名称">
              <el-select
                v-model="query.task_name"
                placeholder="请选择任务名称"
                clearable
                style="width: 170px"
                @keyup.enter="handleSearch(queryFormRef)"
                @visible-change ="allcrontab.get_all_task_func"
                >
                <el-option :label="item.task_name" :value="item.task_name" v-for="item in allcrontab.all_task_func_info" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="任务类型">
              <el-select
                v-model="query.trigger"
                placeholder="请选择任务类型"
                clearable
                style="width: 170px"
                @keyup.enter="handleSearch(queryFormRef)"
                >
                <el-option :label="item.name" :value="item.trigger" v-for="item in task_types" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleSearch(queryFormRef)">搜索</el-button>
                <el-button icon="Refresh" @click="handleReset(queryFormRef)">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
              type="primary" plain icon="Plus"  @click="handleAdd" v-permiss="72" >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button plain type="success" icon="VideoPlay" :disabled="multiple" @click="handleadd_scheduler_task">运行任务</el-button>
        </el-col>
         <el-col :span="2">
            <el-tooltip content="刷新" placement="top">
                <el-button icon="Refresh" circle size="small"  @click="handleRefresh"/>
            </el-tooltip>     
        </el-col>
          </el-row>
      <el-table :data="allcrontab.all_cron_task_info"  border class="table"  
        header-cell-class-name="table-header"  
        @selection-change="handleSelectionChange"
        width="auto">
            <el-table-column type="selection" width="55" align="center" > </el-table-column>
            <el-table-column prop="id" label="ID"  align="center" width="55"></el-table-column>
            <el-table-column prop="task_name" label="任务名称" align="center">
            </el-table-column>
            <el-table-column prop="trigger" label="任务类型" align="center">
                <template #default="scope">
                    <el-tag>{{ getTaskTypeName(scope.row.trigger) }}</el-tag>  
                </template>
            </el-table-column>

            <el-table-column prop="func" label="执行函数" align="center">
                <template #default="scope">
                <el-tag >{{ scope.row.func }}</el-tag>
            </template>
            </el-table-column>
            <el-table-column prop="execute_time" label="执行时间" align="center">
                <template #default="scope">
                  <el-text class="mx-1" type="primary" >{{getexecute_time(scope.row)}}</el-text>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="运行状态" align="center" width="110">
              <template #default="scope">
                    <div class="mb-4"> 
                      <el-tag type='success' v-if="scope.row.status" >{{'运行中'}}</el-tag>
                        <el-tag type='danger' v-else>{{'未运行'}}</el-tag>
                    </div>
                  </template>
            </el-table-column>
            <el-table-column prop="scheduler_status" label="下次执行时间" align="center">
                <template #default="scope">
                  <el-text class="mx-1" type="danger" v-if="scope.row.scheduler_status=='paused'" >{{'暂停'}}</el-text>
                  <el-text class="mx-1" type="primary" v-else >{{scope.row.scheduler_status}}</el-text>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="300">
                <template #default="scope">
                    <el-button type="success" plain icon="VideoPlay" @click="handlestart(scope.row)">
                        启动
                    </el-button>
                    <el-button type="danger" plain icon="VideoPause" @click="handlepause(scope.row)">
                        暂停
                    </el-button>
                    <el-button type="primary" plain icon="Edit" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="pagination">
            <el-pagination 
            v-model:current-page="query.pagenum" 
            :page-size="query.pagesize" 
            :page-sizes="[10, 20, 30, 40]"
            background layout="total, sizes, prev, pager, next, jumper" 
            :total=allcrontab.cron_task_count
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" />
        </div>
        <el-dialog
            v-model="dialogVisible"
            title="计划任务管理"
            width="50%"
            @close="closeDr(taskFormRef)"
          >
          <el-form
              ref="taskFormRef"
              :model="taskForm"
              status-icon
              :rules="rules"
              label-width="80"
              class="demo-ruleForm"
              label-position="top" fit
              >
              <el-row :gutter="24">
                <el-col :span="6"><div class="grid-content ep-bg-purple" />
                  <el-form-item label="任务名称" prop="task_name">
                    <el-select
                      v-model="taskForm.task_name"
                      placeholder="请选择任务名称"
                      clearable
                      style="width: 150px"
                      >
                      <el-option :label="item.task_name" :value="item.task_name" v-for="item in allcrontab.all_task_func_info" :key="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6"><div class="grid-content ep-bg-purple" />
                  <el-form-item label="任务类型" prop="trigger">
                    <el-select
                      v-model="taskForm.trigger"
                      placeholder="请选择任务类型"
                      clearable
                      style="width: 150px"
                      >
                      <el-option :label="item.name" :value="item.trigger" v-for="item in task_types" :key="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6"><div class="grid-content ep-bg-purple" />
                  <el-form-item label="执行时间" 
                  prop="run_date" v-if="taskForm.trigger==='date'">
                    <div class="demo-datetime-picker" >
                        <div class="block">
                        <el-date-picker
                          v-model="taskForm.run_date"
                          type="datetime"
                          placeholder="选择一个时间"
                          format="YYYY-MM-DD HH:mm:ss"
                          value-format="YYYY-MM-DD HH:mm:ss"
                        />
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="执行时间"  prop="cron_time" v-if="taskForm.trigger==='cron'">
                    <div class="example-basic">
                      <el-select-v2
                          clearable
                          filterable
                          v-model="taskForm.day_of_week"
                          :options="weekoptions"
                          placeholder="请选择星期(可选)"
                          style="width: 220px"
                          multiple
                      />
                      <el-time-picker v-model="taskForm.cron_time" placeholder="选择时间(必选)" value-format="HH:mm:ss"/>
                    </div>
                  </el-form-item>
                  <el-form-item label="执行时间" v-if="taskForm.trigger==='interval'">
                    <div class="example-basic" >
                      <el-row :gutter="150">
                      <el-col :span="12">
                        <el-input
                          v-model="taskForm.week"
                          style="width: 170px"
                          clearable
                          >
                        <template #prepend>间隔周数 </template>
                        </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="taskForm.day"
                          style="width: 170px"
                          clearable
                          >
                        <template #prepend>间隔天数 </template>
                        </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="taskForm.hour"
                          style="width: 170px"
                          clearable
                          >
                        <template #prepend>间隔小时 </template>
                        </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="taskForm.minute"
                          style="width: 170px"
                          clearable
                        >
                        <template #prepend>间隔分钟</template>
                       </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="taskForm.second"
                          style="width: 170px"
                          clearable
                        >
                        <template #prepend>间隔秒数 </template>
                        </el-input>
                      </el-col>
                      </el-row>
                    </div>
                  </el-form-item>
              </el-col>
          </el-row>
          </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="resetForm()">取消</el-button>
                <el-button type="primary" @click="submitForm(taskFormRef)">
                  提交
                </el-button>
                
              </div>
            </template>
          </el-dialog>
        <crontabEdit ref="editref" :weekoptions=weekoptions :task_types="task_types" @onupdate="allcrontab.get_all_cron_task(query)"/>
   </div>
</template>

<script setup lang="ts" name="crontab">
import { ref, onMounted, computed  } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { usecrontabStore } from '@/store/system/crontab';
import { add_cron_task,add_scheduler_task, del_cron_task,pause_scheduler_task,start_scheduler_task } from '@/http/system/crontab';
import type { FormInstance,FormRules } from 'element-plus'


//编辑
import crontabEdit from '@/components/system/crontabEdit.vue';


//计划任务store
const  allcrontab = usecrontabStore()

onMounted(() => {
  allcrontab.get_all_cron_task(query.value)
  allcrontab.get_all_scheduler_task(query.value)

	
})


const queryFormRef = ref<FormInstance>()
const query = ref({
        task_name: '',
        trigger: '',
        func:'',
        status:'',
        scheduler_status:'',
        pagenum: 1,
        pagesize: 10
});


// 搜索
const handleSearch = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
    if (valid) {
        query.value.pagenum = 1
        query.value.pagesize = 10
        console.log(query.value)
        allcrontab.get_all_cron_task(query.value)
      } else {
      return false
    }
  })
};


// 重置
const handleReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    query.value = {
        task_name: '',
        trigger: '',
        func:'',
        status:'',
        scheduler_status:'',
        pagenum: 1,
        pagesize: 10
    };
    allcrontab.get_all_cron_task(query.value)
};


const task_status =ref ([
	{id:1,name:'已运行'},
	{id:0,name:'未运行'},
])

const weekoptions =ref ([
	{value:0,label:'星期一'},
	{value:1,label:'星期二'},
	{value:2,label:'星期三'},
  {value:3,label:'星期四'},
  {value:4,label:'星期五'},
  {value:5,label:'星期六'},
  {value:6,label:'星期天'},
])


const task_types =ref ([
	{id:1,name:'时间间隔任务',trigger:'interval'},
	{id:2,name:'特定时间任务',trigger:'cron'},
	{id:3,name:'一次性时间任务',trigger:'date'},
])

//映射任务类型
// 定义一个方法，用于根据 trigger 值返回对应的 name  
 const getTaskTypeName = (trigger:any) => {  
      const task = task_types.value.find((item:{trigger:any}) => item.trigger === trigger);  
      return task ? task.name : '未知任务类型';  
    };  




//执行时间显示处理
const getexecute_time = (row:any) => {
  if(row.trigger=='interval'){
    return  `间隔 ${row.week ?row.week+'周':''}${row.day?row.day+'天':''}${row.hour?row.hour+'小时':''}${row.minute?row.minute+'分钟':''}${row.second?row.second+'秒':''}`
  }else if(row.trigger=='cron'){
    // 调用 getDayOfWeekNames 函数来获取星期名称  
    const weekData = getDayOfWeekNames(row.day_of_week, weekoptions.value);  
    return  `${weekData} ${row.hour?row.hour+': ':''}${row.minute?row.minute + ': ':''}${row.second?row.second:''}`
  }else if(row.trigger=='date'){
    return row.run_date
  }
}

// 将 day_of_week 的值与 weekinfo 中的 id 比对，并返回对应的 name 数组  
const getDayOfWeekNames = (dayOfWeekStr:any, weekInfo:any) => {  
  const weekData = <any>[]
  // 将 day_of_week 字符串分割成数组  
  const dayOfWeekArr = dayOfWeekStr.split(',');
  console.log(11,dayOfWeekStr)
  // 遍历 dayOfWeekArr，查找 weekInfo 中对应的 name  
  dayOfWeekArr.map((weekId:string) => {  
    const dayintId = parseInt(weekId, 10)
    const dayInfo = weekInfo.find((info:any) => info.value === dayintId);  
    weekData.push(dayInfo ? dayInfo.label : '每天');
  });
  return weekData
};  


// 新增计划任务
const dialogVisible = ref(false)
// 定义一个ref对象绑定表单
const taskFormRef = ref<FormInstance>()
const taskForm = ref({
    task_name: '',
    trigger: '',
    run_date: '',
    cron_time: '',
    execute_time: '',
    minute: '',
    hour: '',
    week: '',
    day_of_week: '',
    day: '',
    second: '',
})




// row传入到详细按钮中  编辑
// 修改
const editref = ref<{ open: (row: any) => void } | null>(null)
const handleEdit = async (row:any) => {
  console.log('传入前', row)
  editref.value?.open(row)
}


//刷新
const handleRefresh = () => {
  allcrontab.get_all_cron_task(query.value)
}


//新增
const handleAdd = async () => {
  dialogVisible.value=true
  allcrontab.get_all_task_func()
}


//  取消
const resetForm = () => {
  dialogVisible.value=false
}

//验证添加的账号字段
const validtask_name = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('任务名称不能为空'))
  } else {
    callback()
  }
}


const validtrigger = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请选择任务类型'))
  } else {
    callback()
  }
}

const validrun_date = (_: any, value: any, callback: any) => {
  if (value=== '' ) {
    callback(new Error('请选择时间'))
  } else {
    callback()
  }
}

const validcron_time = (_: any, value: any, callback: any) => {
  if (value ==='') {
    callback(new Error('请选择时间'))
  } else {
    callback()
  }
}




const rules = ref<FormRules>({
    task_name: [{ validator: validtask_name, required: true, trigger: 'blur' }],
    trigger: [{ validator: validtrigger, required: true, trigger: 'blur' }],
    cron_time: [{ validator: validcron_time, required: true, trigger: 'blur' }],	
    run_date: [{ validator: validrun_date, required: true, trigger: 'blur' }],	
})

//格式化cron时间
const formatcron_time = (cron_time:any) => {
  if (taskForm.value.cron_time) {
    const cronArray = cron_time.split(':')
    taskForm.value.second = cronArray[2]
    taskForm.value.minute = cronArray[1]
    taskForm.value.hour = cronArray[0]
}
}
// 格式化星期的格式
const  day_of_weekStr = (day_of_week:any) => {  
    if (day_of_week) {
      taskForm.value.day_of_week = day_of_week.join(',');  
    } else {
      taskForm.value.day_of_week = '';
    }
    }  

//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  console.log('表单数据',taskForm.value)
  //格式化cron的时间
  if (taskForm.value.trigger == 'cron') {
    formatcron_time(taskForm.value.cron_time)
    day_of_weekStr(taskForm.value.day_of_week)
    console.log('格式化cron时间',taskForm.value)
  }
  formEl.validate(async (valid) => {
    if (valid) {
        await add_cron_task(taskForm.value).then((res:any)=>{
        ElMessage.success(res.data.msg)
			  dialogVisible.value=false
			  //刷新页面
        allcrontab.get_all_cron_task(query.value)
        })
      } else {
      return false
    }
  })
}

//  关闭页面时的回调
const closeDr=(formEl: FormInstance | undefined) =>{
dialogVisible.value=false
if (!formEl) return;
	formEl.resetFields();
    taskForm.value={
    task_name:'',
    trigger:'',
    run_date:'',
    cron_time:'',
    execute_time: '',
    minute: '',
    hour: '',
    week: '',
    day_of_week: '',
    day: '',
    second: '',
}}


//多选模块
const multiple = ref(true);
const ids = ref([]);

/** 多选框选中数据 */
const handleSelectionChange = (selection:any) => {
    ids.value = selection.map((item: { id: number; }) => item.id);
    multiple.value = !selection.length;
    console.log('ids',ids.value)
}



/** 删除按钮操作 */
const handleDelete = async () => {
  const taskIds = ids.value;
        ElMessageBox.confirm(
        '是否确认删除编号为"' + taskIds + '?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            for (const id of taskIds) {
                // 在这里执行实际的删除操作
                await del_cron_task(id);
                ElMessage.success('操作完成');
             }
    //刷新页面
    allcrontab.get_all_cron_task(query.value)
}).catch(() => {});
}




//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    allcrontab.get_all_cron_task(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    allcrontab.get_all_cron_task(query.value)
  }


// 运行任务
const handleadd_scheduler_task = async () => {
  const taskIds = ids.value;
  for (const id of taskIds) {
    await add_scheduler_task(id).then((res:any)=>{
        ElMessage.success(res.data.msg)
    })
  }
  //刷新页面
  allcrontab.get_all_cron_task(query.value)
}


const handlestart = async (row:any) => {
    await start_scheduler_task(row.id).then((res:any)=>{
        ElMessage.success(res.data.msg)
        //刷新页面
        allcrontab.get_all_cron_task(query.value)
    })
}

const handlepause = async (row:any) => {
    await pause_scheduler_task(row.id).then((res:any)=>{
        ElMessage.warning(res.data.msg)
        //刷新页面
        allcrontab.get_all_cron_task(query.value)
      })
}


</script>

<style scoped>
.table {
	width: 100%;
	font-size: 14px;
    margin-top: 20px;
}

.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
.example-basic .el-date-editor {
  margin: 8px;
}

.mb-4 {
    text-align: center;
}
.mb-4 .el-button {
    margin-left: 0;
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}


.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.el-input {
  margin-bottom: 5px;  
  margin-left: 5px;
}


</style>
