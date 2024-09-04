<template>
    <div>
      <el-drawer 
            v-model="drawer" 
            title="jar上传" 
            size="20%"
            >
        <el-form
            ref="ruleFormRef"
            :model="jarForm"
            status-icon
            :rules="rules"
            label-width="80px"
            class="demo-ruleForm"
            >
            <el-form-item label="jar包名称" prop="jar_name">
                <el-input v-model="jarForm.jar_name" autocomplete="off"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onjardownload(ruleFormRef)">提交</el-button>
                <el-button @click="resetForm()">取消</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
    </div>
    <el-dialog 
        v-model="dialogTableVisible" 
        title="构建版本包下载"
        width="30%"
        center
        >
        <el-form :model="jarForm" 
        >
            <el-form-item label="构建版本" prop="build_id">
                <el-select v-model="jarForm.build_id" placeholder="请构建版本" >
                    <el-option :label="item" :value="item" v-for="item in  build_ids" :key="item" />
                </el-select>
            </el-form-item>
        </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handledownload">下载</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
      </template>
    </el-dialog>

  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { jar_build_ids, jar_download } from '@/http/api';
  import { ref } from 'vue';
  import { ElMessage,ElDrawer } from 'element-plus';


  // 编辑用户  
  const drawer = ref(false)
  // 菜单
  const dialogTableVisible = ref(false)
  
  // 使用 TypeScript 类型注解  

  
  // 定义一个ref对象绑定表单，这个ref用于检查表单是否符合要求
  const ruleFormRef = ref<FormInstance>()
  const jarForm = ref({
    jar_name: '',
    build_id:undefined,
    ip: '',
    InstanceName: ''
  })
  
  //  取消
  const resetForm = () => {
     drawer.value=false
     jarForm.value.jar_name=jarForm.value.jar_name
     ruleFormRef.value?.resetFields();
  }
  
  //验证添加的账号字段

  
  const jar_name = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('jar_name不能为空'))
    } else {
      callback()
    }
  }
  
  
  const rules = ref<FormRules>({
      jar_name: [{ required: true,validator: jar_name, trigger: 'blur' }],
  })
  
  

  
  
  const openjardownload = (row:any) => {
    jarForm.value.InstanceName = row.InstanceName
    jarForm.value.jar_name = (row.InstanceName.split('_'))[0]
    jarForm.value.ip  = row.inip
    drawer.value = true
  }

  defineExpose({
    openjardownload
  })
  
  
  const build_ids = ref<[]>([])
  const onjardownload = async (formEl: FormInstance | undefined) => {  
    if (!formEl) return;  
    formEl.validate(async (valid) => {  
      if (valid) {  
        dialogTableVisible.value = true
        const res = await jar_build_ids(jarForm.value)
        build_ids.value = res.data.build_ids
        console.log(build_ids.value)
        }
    })  
    // 关闭窗口
    drawer.value = false;  
    // 通知父组件更新操作  
    }
  
  
    // 当前菜单按钮下载
const handledownload = async () => {
    // 关闭对话框
    try {  
    dialogTableVisible.value = false;
    const res = await jar_download(jarForm.value)
    ElMessage({
      message: res.data.msg,
      type: 'success',
    })
    } catch (error) {  
        console.error('下载过程中发生错误:', error);  
        // 可以选择在这里显示一个错误消息给用户  
        // 例如，使用 Vue 的 alert 或 toast 组件  
    } 
   
}
  
  // 当前菜单按钮关闭
const handleClose = () => {
    // 关闭对话框
    dialogTableVisible.value = false;
}

  
  
  </script>
  
  
  
  <style scoped>
  .el-input {
    width: 300px;
  }
  
  
  
  
  </style>
  