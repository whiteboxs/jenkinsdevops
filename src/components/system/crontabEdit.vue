<template>
    <div>
      <el-dialog
            v-model="dialogVisible"
            title="计划任务管理"
            width="50%"
          >
          <el-form
              ref="editFormRef"
              :model="editForm"
              status-icon
              :rules="rules"
              label-width="80"
              class="demo-ruleForm"
              label-position="top" fit
              >
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="任务名称" prop="task_name">
                    <el-select
                      v-model="editForm.task_name"
                      placeholder="请选择任务名称"
                      clearable
                      style="width: 150px"
                      >
                      <el-option :label="item.task_name" :value="item.task_name" v-for="item in allcrontab.all_task_func_info" :key="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="任务类型" prop="trigger">
                    <el-select
                      v-model="editForm.trigger"
                      placeholder="请选择任务类型"
                      clearable
                      style="width: 150px"
                      >
                      <el-option :label="item.name" :value="item.trigger" v-for="item in props.task_types" :key="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="执行时间"  prop="run_date" v-if="editForm.trigger==='date'">
                    <div class="demo-datetime-picker" >
                        <div class="block">
                        <el-date-picker
                          v-model="editForm.run_date"
                          type="datetime"
                          placeholder="选择一个时间"
                          format="YYYY-MM-DD HH:mm:ss"
                          value-format="YYYY-MM-DD HH:mm:ss"
                        />
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="执行时间"  prop="cron_time" v-if="editForm.trigger==='cron'">
                    <div class="example-basic">
                      <el-select-v2
                          clearable
                          filterable
                          v-model="editForm.day_of_week_list"
                          :options="props.weekoptions"
                          placeholder="请选择星期(可选)"
                          style="width: 220px"
                          multiple
                      />
                      <el-time-picker v-model="editForm.cron_time" placeholder="选择时间(必选)" value-format="HH:mm:ss"/>
                    </div>
                  </el-form-item>
                  <el-form-item label="执行时间"  prop="cron_time" v-if="editForm.trigger==='interval'">
                    <div class="example-basic" >
                      <el-row :gutter="150">
                      <el-col :span="12">
                        <el-input
                          v-model="editForm.week"
                          style="width: 170px"
                          clearable
                          >
                        <template #prepend>间隔周数 </template>
                        </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="editForm.day"
                          style="width: 170px"
                          clearable
                          >
                        <template #prepend>间隔天数 </template>
                        </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="editForm.hour"
                          style="width: 170px"
                          clearable
                          >
                        <template #prepend>间隔小时 </template>
                        </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="editForm.minute"
                          style="width: 170px"
                          clearable
                        >
                        <template #prepend>间隔分钟</template>
                       </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="editForm.second"
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
                <el-button type="primary" @click="onupdate(editFormRef)">
                  提交
                </el-button>
                
              </div>
            </template>
          </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { ref,defineEmits,onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import { usecrontabStore } from '@/store/system/crontab';
  import { update_cron_task } from '@/http/system/crontab';
import { el } from 'element-plus/es/locale';

  //计划任务store
const  allcrontab = usecrontabStore()

onMounted(() => {
  allcrontab.get_all_task_func()

	
})
//  编辑计划任务开关
const dialogVisible = ref(false)
  // 定义一个ref对象绑定表单，这个ref用于检查表单是否符合要求
  const editFormRef = ref<FormInstance>()
  const  editForm = ref({
      id:0,
      task_name: '',
      trigger: '',
      run_date: '',
      cron_time: '',
      minute: '',
      hour: '',
      week: '',
      day_of_week_list: [],
      day_of_week: '',
      day: '',
      second: '',
  })
  
  //  取消
  const resetForm = () => {
    dialogVisible.value=false
     editForm.value.task_name=''
     editForm.value.trigger=''
     editForm.value.run_date=''
     editForm.value.cron_time=''  
     editForm.value.minute=''
     editForm.value.hour=''
     editForm.value.week=''
     editForm.value.day_of_week_list=[]
     editForm.value.day=''
     editForm.value.second=''
  }




  
//   const weekoptions =ref ([
// 	{value:0,label:'星期一'},
// 	{value:1,label:'星期二'},
// 	{value:2,label:'星期三'},
//   {value:3,label:'星期四'},
//   {value:4,label:'星期五'},
//   {value:5,label:'星期六'},
//   {value:6,label:'星期天'},
// ])



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

const props = defineProps({
    task_types: {
      type: Array<{ id: number, name: string,trigger: string }>,
      required: true
     },
     weekoptions:{
      type: Array<{ value: number, label: string }>,
      required: true
     }
})

  


const open = (row: any) => {  
  // 使用声明语句来更新 editForm 的值  
  editForm.value.id = row.id;  
  editForm.value.task_name = row.task_name;  
  editForm.value.trigger = row.trigger;  
  
  // 使用大括号来包围每个 if 语句的代码块  
  if (row.trigger === 'cron') {  
    editForm.value.run_date = '';  
    editForm.value.cron_time = `${row.hour}:${row.minute}:${row.second}`;  
    if (row.day_of_week != '') { 
      editForm.value.day_of_week_list = row.day_of_week.split(',').map(Number);  
    }
  }  
  
  if (row.trigger === 'date') {  
    editForm.value.run_date = row.run_date;  
  }  
  
  if (row.trigger === 'interval') {  
    editForm.value.minute = row.minute;  
    editForm.value.hour = row.hour;  
    editForm.value.week = row.week;  
    editForm.value.day = row.day;  
    editForm.value.second = row.second;  
  }  
  dialogVisible.value = true;  
  console.log('修改传入子组件', editForm.value);  
};

defineExpose({
  open
})
  
  // 更新
  const emit = defineEmits(['onupdate'])
  

  //格式化cron时间
const formatcron_time = (cron_time:any) => {
  if (editForm.value.cron_time) {
    const cronArray = cron_time.split(':')
    editForm.value.second = cronArray[2]
    editForm.value.minute = cronArray[1]
    editForm.value.hour = cronArray[0]
}
}
// 格式化星期的格式
const  day_of_weekStr = (day_of_week_list:any) => {  
    if (day_of_week_list) {
      editForm.value.day_of_week = day_of_week_list.join(',');  
    } else {
      editForm.value.day_of_week = '';
    }
    }  

//更新编辑
const onupdate = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  console.log('表单数据',editForm.value)
  //格式化cron的时间
  if (editForm.value.trigger == 'cron') {
    formatcron_time(editForm.value.cron_time)
    day_of_weekStr(editForm.value.day_of_week_list)
    console.log('格式化cron时间',editForm.value)
  }
  formEl.validate(async (valid) => {
    if (valid) {
        await update_cron_task(editForm.value.id,editForm.value).then((res:any)=>{
        ElMessage.success(res.data.msg)
			  dialogVisible.value=false
        emit('onupdate');  
        })
      } else {
      return false
    }
  })
}




  
  
  
  </script>
  
  
  
  <style scoped lang="less">

  .el-input {
    width: 300px;
  }
  
  .custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}

.el-input {
  margin-bottom: 5px;  
}
.el-row {
  margin-bottom: 20px;
}
  
  
  </style>
  