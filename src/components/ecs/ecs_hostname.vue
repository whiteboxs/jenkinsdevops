<template>
    <div>
      <el-drawer 
            v-model="drawer" 
            title="ecs_hostname修改" 
            size="20%"
            >
        <el-form
            ref="ruleFormRef"
            :model="ecshostnameForm"
            status-icon
            :rules="rules"
            label-width="80px"
            class="demo-ruleForm"
            >
            <el-form-item label="实例名称" prop="aliname">
                <el-input v-model="ecshostnameForm.aliname" autocomplete="off" disabled/>
            </el-form-item>
            <el-form-item label="主机名" prop="hostname">
                <el-input v-model="ecshostnameForm.hostname" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onhostname(ruleFormRef)">提交</el-button>
                <el-button @click="resetForm()">取消</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    </div>
  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { hostnamectl } from '@/http/api';
  import { ref } from 'vue';
  import { ElMessage, ElMessageBox,ElDrawer } from 'element-plus';


 

  // 编辑用户  
  const drawer = ref(false)

  
  // 使用 TypeScript 类型注解  
  interface ecshostForm {  
    aliname: string;
    hostname: string;
    ip:string

  }  
  
  // 定义一个ref对象绑定表单，这个ref用于检查表单是否符合要求
  const ruleFormRef = ref<FormInstance>()
  const ecshostnameForm = ref<ecshostForm>({
    aliname: '',
    hostname:'', 
    ip:''
  })
  
  //  取消
  const resetForm = () => {
     drawer.value=false
     ecshostnameForm.value.hostname=ecshostnameForm.value.aliname
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
  
  
  const rules = ref<FormRules>({
      hostname: [{ required: true,validator: hostname, trigger: 'blur' }],
  })
  
  
  
  
  
  
  
  
  
  
  
  const openhostname = (row:any) => {
    ecshostnameForm.value.hostname = row.InstanceName
    ecshostnameForm.value.aliname = row.InstanceName
    ecshostnameForm.value.ip = row.inip
    drawer.value = true
    console.log('传入子主件', ecshostnameForm.value)
  }
  defineExpose({
    openhostname
  })
  
  

  const onhostname = async (formEl: FormInstance | undefined) => {  
    if (!formEl) return;  
    formEl.validate(async (valid) => {  
      if (valid) {  
        ElMessageBox.confirm(
        '确定修改主机名为：' + ecshostnameForm.value.hostname + '吗?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
          await hostnamectl(ecshostnameForm.value).then((res:any)=>{
              ElMessageBox.alert('主机名' + res.data.data.result[ecshostnameForm.value.aliname].stdout + '修改成功', '提示', {
                  confirmButtonText: '确定',
              }
              );      
          })
        })
        .catch((error) => {
        console.log(error)
        ElMessage({
            type: 'info',
            message: '取消成功',
        })
        }
    )  
        // 关闭窗口
        drawer.value = false;  
        // 通知父组件更新操作  
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
  