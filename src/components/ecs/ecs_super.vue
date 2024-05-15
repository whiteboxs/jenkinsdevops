<template>
    <div>
      <el-drawer 
            v-model="drawer" 
            title="ecs_supervisor初始化" 
  
            >
        <el-form
            ref="ruleFormRef"
            :model="ecsinitForm"
            status-icon
            :rules="rules"
            label-width="120px"
            class="demo-ruleForm"
            >
            <el-form-item label="实例名/主机名" prop="hostanme">
                <el-input v-model="ecsinitForm.hostname" autocomplete="off" disabled/>
            </el-form-item>
            <el-form-item label="内网ip" prop="ip">
                <el-input v-model="ecsinitForm.ip" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="工作环境" prop="env" >
                <el-radio-group v-model="ecsinitForm.env">
                    <el-radio label="prod">生产环境</el-radio>
                    <el-radio label="gray">灰度环境</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="jar_application" prop="jar_application">
                <el-radio-group v-model="ecsinitForm.jar_application">
                    <el-radio label='app' >是</el-radio>
                    <el-radio label='' >否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="oninit(ruleFormRef)">提交</el-button>
                <el-button @click="resetForm()">取消</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    </div>
  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { init_supervisor } from '../../http/api';
  import { ref,defineEmits } from 'vue';
  import { ElMessage, ElMessageBox,ElDrawer } from 'element-plus';


 

  // 编辑用户  
  const drawer = ref(false)

  
  // 使用 TypeScript 类型注解  
  interface ecsForm {  
    hostname: string;
    ip: string;  
    env:string;
    jar_application: string;  
  }  
  
  // 定义一个ref对象绑定表单，这个ref用于检查表单是否符合要求
  const ruleFormRef = ref<FormInstance>()
  const ecsinitForm = ref<ecsForm>({
    hostname:'',
    ip: '',  
    env:'',
    jar_application:'',
  })
  
  //  取消
  const resetForm = () => {
     drawer.value=false
     ecsinitForm.value.env=''
     ecsinitForm.value.hostname=''
     ecsinitForm.value.ip=''
     ecsinitForm.value.jar_application=''
     ruleFormRef.value?.resetFields();
  }
  
  //验证添加的账号字段
  const hostname = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('hostname不能为空'))
    } else {
      callback()
    }
  }
  
  const ip = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('内网ip不能为空'))
    } else {
      callback()
    }
  }
  const env = (_: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('请选择主机工作环境'))
    } else {
      callback()
    }
  }

  
  const rules = ref<FormRules>({
      hostname: [{ required: true,validator: hostname, trigger: 'blur' }],
      ip: [{ required: true, validator: ip, trigger: 'blur' }],
      env: [{ required: true,validator: env, trigger: 'blur' }],
  })
  
  
  
  
  //  抽屉关闭时的回调
  const closeDr=() =>{
    drawer.value=false
    //ecsinitForm.value?.resetFields();
      ecsinitForm.value={
        hostname:'',
        ip: '',  
        env:'',
        jar_application:'',
      }
  }
  
  
  
  
  
  
  
  const opensuper = (row:any) => {
    ecsinitForm.value.hostname = row.InstanceName
    ecsinitForm.value.ip = row.inip
    drawer.value = true
    console.log('传入子主件', ecsinitForm.value)
  }
  defineExpose({
    opensuper
  })
  
  // 更新
  const emit = defineEmits(['onupdate'])
  
  
  //ElMessageBox的显示样式,构建 HTML 字符串，将 key 用蓝色标记，value 用红色标记
function formatDataToHTMLString(data:any) {
    let formattedData = '<div style="font-family: monospace; white-space: pre;">';
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formattedData += `<span style="color: blue;">${key}:</span> <span style="color: red;">${data[key]}</span>\n`;
        }
    }
    formattedData += '</div>';
    return formattedData;
}

  const oninit = async (formEl: FormInstance | undefined) => {  
    if (!formEl) return;  
    formEl.validate(async (valid) => {  
      if (valid) {  
        ElMessageBox.confirm(
        '确定初始化' + ecsinitForm.value.hostname + '的supervisor配置吗?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
          await init_supervisor(ecsinitForm.value).then((res)=>{
              //ElMessage.success('初始化supservisor成功')
              ElMessageBox.alert(res.data.result[ecsinitForm.value.hostname].stdout);      
          })
        })
        .catch(() => {
        ElMessage({
            type: 'info',
            message: '取消成功',
        })
        }
    )  
        // 关闭窗口
        drawer.value = false;  
        // 通知父组件更新操作  
        emit('onupdate');  
      } else {  
        // 处理表单验证失败的情况...  
      }  
    });  
  };  
  
  
  
  
  

  
  
  </script>
  
  
  
  <style scoped>
  .el-input {
    width: 300px;
  }
  
  
  
  
  </style>
  