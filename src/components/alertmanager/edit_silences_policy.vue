<template>
    <div>
      <el-drawer v-model="drawer" 
					         title="编辑静默策略" 
							 @close="closeDr()">
							 
						<el-form
							ref="ruleFormRef"
							:model="editForm"
							status-icon
							:rules="rules"
							label-width="110px"
							class="demo-ruleForm"
							>
              <el-form-item label="策略名称" prop="name">
                    <el-input v-model="editForm.name" autocomplete="off" style="width: 240px"/>
              </el-form-item>
                  <el-form-item label="告警组" prop="group">
                          <el-select-v2
                              clearable
                              filterable
                              v-model="editForm.group"
                              :options="monitorgroups"
                              placeholder="请选择(可多选,搜索)"
                              style="width: 240px"
                              multiple
                          />
              </el-form-item>
              <el-form-item label="告警地址" prop="instance">
                  <el-select-v2
                                      clearable
                                      filterable
                                      v-model="editForm.instance"
                                      :options="monitorinstances"
                                      placeholder="请选择(可多选,搜索)"
                                      style="width: 240px"
                                      multiple
                                  />
              </el-form-item>
              <el-form-item label="告警级别" prop="serverity">
                          <el-select-v2
                              clearable
                              filterable
                              v-model="editForm.serverity"
                              :options="alert_serverity"
                              placeholder="请选择(可多选,搜索)"
                              style="width: 240px"
                              multiple
                          />
              </el-form-item>
              <el-form-item label="静默开始时间" prop="starttime">
                  <div class="example-basic">
                        <el-time-picker v-model="editForm.starttime" placeholder="静默开始时间" value-format="HH:mm:ss"/>
                  </div>
              </el-form-item>
              <el-form-item label="静默结束时间" prop="endtime">
                   <div class="example-basic">
                        <el-time-picker v-model="editForm.endtime" placeholder="静默结束时间" value-format="HH:mm:ss"/>
                  </div>
              </el-form-item>
							<el-form-item>
								<el-button type="primary" @click="onupdate(ruleFormRef)">提交</el-button>
								<el-button @click="resetForm()">取消</el-button>
							</el-form-item>
						</el-form>
					</el-drawer>
    </div>
  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { ref,defineEmits,computed,defineProps,onMounted} from 'vue';
  import { ElMessage, ElMessageBox,ElDrawer } from 'element-plus';
  import { update_silences_policy } from '@/http/alert/alert';
  import { monitor_group,monitor_instance } from '@/http/api'


 
 

  // 开关
  const drawer = ref(false)

  onMounted(() => {
    monitor_instancelist()
    monitor_grouplist()
})


  
  // 定义一个ref对象绑定表单，这个ref用于检查表单是否符合要求
  const ruleFormRef = ref<FormInstance>()
  const  editForm = ref({
      id:0,
      name: '',
      instance:[],
      group:[],
      serverity:[],
      starttime: '',
      endtime:'',
      create_time:'',
  })
  
  //  取消
  const resetForm = () => {
     drawer.value=false
     editForm.value.name=''
     editForm.value.instance=[],
     editForm.value.group=[],
     editForm.value.serverity=[],
     editForm.value.starttime=''
     editForm.value.endtime=''
  }
  


  //  抽屉关闭后监控检查后的回调
const closeDr=() =>{
  drawer.value=false
    ruleFormRef.value?.resetFields();
    editForm.value={
    id:0,
    name: '',
    instance:[],
    group:[],
    serverity:[],
    starttime: '',
    endtime:'',
    create_time:'',
  }
}


// 获取监控组
const monitorgroups = ref([])
const monitor_grouplist = async () => {
  const res = await monitor_group()
  const mapgrouops = res.data.monitor_group.map((item:any) => {
  return { value: item, label: item };
  });
  monitorgroups.value = mapgrouops
}

// 获取监控主机
const monitorinstances = ref([])
const monitor_instancelist = async () => {
  const res = await monitor_instance()
  const mapinstances = res.data.data.map((item:any) => {
  return { value: item, label: item };
  });
  monitorinstances.value = mapinstances
}

//告警级别
const alert_serverity = ref([
  {
    value: 'warning',
    label: 'warning',
  },
  {
    value: 'critical',
    label: 'critical',
  }])
//验证
//验证添加的账号字段

const validname= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('策略名称名不能为空'))
  } else {
    callback()
  }
}


const validserverity= (_: any, value: any, callback: any) => {
  if (!value.length) {
    callback(new Error('告警级别名不能为空'))
  } else {
    callback()
  }
}

const validstarttime= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('静默开始时间不能为空'))
  } else {
    callback()
  }
}

const validendtime= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('静默结束时间不能为空'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
    name: [{ validator: validname, required: true, trigger: 'blur' }],
    serverity: [{ validator: validserverity, required: true, trigger: 'blur' }],
    starttime: [{ validator: validstarttime, required: true, trigger: 'blur' }],
    endtime: [{ validator: validendtime, required: true, trigger: 'blur' }],

})



  
  
  const open = (row:any) => {
     editForm.value.id=row.id,
     editForm.value.name=row.name,
     editForm.value.instance=row.instance,
     editForm.value.group=row.group,
     editForm.value.serverity=row.serverity,
     editForm.value.starttime=row.starttime,
     editForm.value.endtime=row.endtime,
     drawer.value = true
     console.log('传入子主件', editForm.value)
  }
  defineExpose({
    open
  })
  
  // 更新
  const emit = defineEmits(['onupdate'])
  

  const onupdate = async (formEl: FormInstance | undefined) => {  
    if (!formEl) return;  
    formEl.validate(async (valid) => {  
      if (valid) {  
        // 编辑操作  
        const res = await update_silences_policy(editForm.value.id,editForm.value);  
        console.log('编辑提交', editForm.value);  
        ElMessage.success(res.data.msg);  
        drawer.value = false;  

        // 通知父组件更新操作  
        emit('onupdate');  
      } else {  
        // 处理表单验证失败的情况...  
      }  
    });  
  };   
  
  
  
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

.option-input {
  width: 100%;
  margin-bottom: 8px;
}
  
  
  </style>
  