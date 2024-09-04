<template>
    <div>
      <el-drawer 
            v-model="drawer" 
            title="监控管理" 
            size="25%"
            close-on-press-escape
            >
        <el-form
            ref="ruleFormRef"
            :model="monitorForm"
            status-icon
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
            >
            <el-form-item label="实例名" prop="hostanme">
                <el-input v-model="monitorForm.aliname" autocomplete="off" disabled/>
            </el-form-item>
            <el-form-item label="内网ip" prop="ip">
                <el-input v-model="monitorForm.ip" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="监控操作" prop="monitor_hand">
                <el-radio-group v-model="monitorForm.monitor_hand">
                    <el-radio label="add">添加</el-radio>
                    <el-radio label="remove">移除</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="监控类型" prop="monitor_type">
                    <el-select-v2
                        clearable
                        filterable
                        v-model="monitorForm.monitor_type"
                        :options="monitor_type_options"
                        placeholder="请选择(可多选)"
                        style="width: 240px"
                        multiple
                    />
            </el-form-item>
            <el-form-item label="监控组名"  prop="group">
                <el-select 
                    v-model="monitorForm.group" placeholder="请选择监控组"
                    filterable
                    clearable
                    >
                    <el-option :label="item" :value="item" v-for="item in monitorgroups" :key="item" />
                    <template #footer>
                      <el-button v-if="!isAdding" text bg  @click="addgroup">
                          添加新监控组
                        </el-button>
                        <template v-else>
                          <el-input
                            v-model="monitorForm.group"
                            class="option-input"
                            placeholder="输入新的监控组名"
                          />
                          <el-button type="primary"  @click="onConfirm">
                            确认
                          </el-button>
                          <el-button  @click="clear">取消</el-button>
                        </template>
                      </template>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onmonitor(ruleFormRef)">提交</el-button>
                <el-button @click="resetForm()">取消</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    </div>
  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { monitor,monitor_check } from '@/http/api';
  import { ref,defineEmits,computed,defineProps} from 'vue';
  import { ElMessage, ElMessageBox,ElDrawer } from 'element-plus';
  import { monitor_group } from '@/http/api';


 
 

  // 编辑用户  
  const drawer = ref(false)

  
  // 使用 TypeScript 类型注解  
  interface monitorFormint {  
    aliname: string;  
    ip: string;  
    group: string;  
    monitor_hand: string;  
    monitor_type: Array<string>;  
    // 定义其他属性...
    }
  
  // 定义一个ref对象绑定表单，这个ref用于检查表单是否符合要求
  const ruleFormRef = ref<FormInstance>()
  const monitorForm = ref<monitorFormint>({
    aliname:'',
    ip: '',  
    group:'',
    monitor_hand:'add',
    monitor_type:[],
  })

  //  取消
  const resetForm = () => {
     drawer.value=false
     monitorForm.value.aliname=''
     monitorForm.value.ip=''
     monitorForm.value.group='',
     monitorForm.value.monitor_hand='',
     monitorForm.value.monitor_type=[],
     // 重置表单
     ruleFormRef.value?.resetFields();
  }
  

  //  抽屉关闭后监控检查后的回调
const closeDr=() =>{
  drawer.value=false
    ruleFormRef.value?.resetFields();
    monitorForm.value={
    aliname:'',
    ip: '',  
    group:'',
    monitor_hand:'add',
    monitor_type:[],
  }
}


  //验证添加的账号字段
  const env = (_: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('请选择主机工作环境'))
    } else {
      callback()
    }
  }

  const group = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请选择监控组'))
    } else {
      callback()
    }
  }

  const monitor_hand = (_: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('请选择监控执行'))
    } else {
      callback()
    }
  }
  const monitor_type = (_: any, value: any, callback: any) => {
    if (!value || value.length === 0 ) {
      callback(new Error('请选择监控项目'))
    } else {
      callback()
    }
  }
  
  const rules = ref<FormRules>({
      env: [{ required: true,validator: env, trigger: 'blur' }],
      group: [{ required: true,validator: group, trigger: 'blur' }],
      monitor_hand: [{ required: true,validator: monitor_hand, trigger: 'blur' }],
      monitor_type: [{ required: true,validator: monitor_type, trigger: 'blur' }],
  })



const monitor_type_options = computed(() => {
  return monitor_options.value
    .map(item => ({ value: item.name+':'+item.port, label: item.name }));
});



const monitor_options = ref([
  {
  'name': 'node-exporter',
  'port': 9100,
  },
  {
  'name': 'process-exporter',
  'port': 9256,
  },
])


// 获取监控组
const monitorgroups = ref<string[]>([])
const monitor_grouplist = async () => {
  const res = await monitor_group()
  monitorgroups.value = res.data.monitor_group
}



  
const isAdding = ref(false)  
const addgroup = () => {
  isAdding.value = true
}
const onConfirm = () => {
  if (monitorForm.value.group) {
    monitorgroups.value.push(monitorForm.value.group);  
    clear()
  }
}
const clear = () => {
  monitorForm.value.group = ''
  isAdding.value = false
}


  


  
  
  const openmonitor = (row:any) => {
    monitorForm.value.aliname = row.InstanceName
    monitorForm.value.ip = row.inip
    monitor_grouplist()
    drawer.value = true
    console.log('传入子主件', monitorForm.value)
  }
  defineExpose({
    openmonitor
  })
  
  // 更新
  const emit = defineEmits(['onmonitor'])
  

  const onmonitor = async (formEl: FormInstance | undefined) => {  
    if (!formEl) return;  
    formEl.validate(async (valid) => {  
      if (valid) {  
        ElMessageBox.confirm(
        '确定'+ monitorForm.value.monitor_hand + ' ' + monitorForm.value.aliname + '的监控配置吗?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {

          const res = await monitor(monitorForm.value)
          // 提示成功
          ElMessage.success(res.data.msg);
          ElMessageBox.alert(monitorForm.value.monitor_type + res.data.msg);   
          console.log('监控传入到后端的参数：',monitorForm.value)
          // 关闭窗口
          drawer.value = false;
          // 等待监控状态返回
          const maxWaitTime = 120000;  // 2分钟超时
          let currentWaitTime = 0;
          while (currentWaitTime < maxWaitTime) {
            // 根据是否是第一次等待来决定等待时间
            const waitTime = 2000;
            console.log(waitTime)
            // 等待2秒
            await new Promise(resolve => setTimeout(resolve, waitTime));
            // 获取监控状态
            const checkResult = await monitor_check(monitorForm.value);  
              console.log('checkResult',checkResult)
            // 判定构建状态
            if (monitorForm.value.monitor_hand == 'remove' && checkResult.data.data.length == 0){
              //每次循环前关闭上一次的提示
              ElMessageBox.close();
              ElMessageBox.alert(checkResult.data.msg)
              ElMessage.success(checkResult.data.msg);
              //更新
              emit('onmonitor');
              // 清除表单数据和验证信息
              monitorForm.value.monitor_type = [];
              monitorForm.value.group = '';
              monitorForm.value.monitor_hand = '';
              monitorForm.value.aliname = '';
              monitorForm.value.ip = '';
              ruleFormRef.value?.resetFields()
              return;
            } else
            if (monitorForm.value.monitor_hand == 'add' && checkResult.data.data.length > 0){
              //每次循环前关闭上一次的提示
              ElMessageBox.close();
              ElMessageBox.alert(checkResult.data.msg)
              ElMessage.success(checkResult.data.msg);
      
              //更新
              emit('onmonitor');
              // 清除表单数据和验证信息
              monitorForm.value.monitor_type = [];
              monitorForm.value.group = '';
              monitorForm.value.monitor_hand = '';
              monitorForm.value.aliname = '';
              monitorForm.value.ip = '';
              ruleFormRef.value?.resetFields()
              return;
            }
            else {
              //每次循环前关闭上一次的提示
              ElMessageBox.close();
              // 更新提示框内容
              ElMessageBox.alert(checkResult.data.msg,{
              showClose: false,
              closeOnClickModal: false,
              type: 'info'
              })
              ElMessage.success(checkResult.data.msg)
              console.log('监控状态检查中，请等待！', checkResult);
              }
            currentWaitTime += waitTime;
            if (currentWaitTime >= maxWaitTime) {
              ElMessageBox.close();
              ElMessageBox.alert('监控状态检查超时，请稍后重试！',{
              showClose: false,
              closeOnClickModal: false,
              type: 'error'
              })
              ElMessage.error('监控状态检查超时，请稍后重试！');
              return;
            }
          } 
        })
        .catch((error) => {
          console.error(error);
          ElMessage({
            type: 'info',
            message: '取消成功',
          })
        });
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
  