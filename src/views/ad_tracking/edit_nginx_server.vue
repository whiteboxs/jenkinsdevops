<template>
    <div>
        <el-drawer v-model="drawer" 
                        title="编辑nginx服务器"
                        size="20%" 
                        >
                <el-form
                    ref="ruleFormRef"
                    :model="editForm"
                    status-icon
                    :rules="rules"
                    label-width="80"
                    class="demo-ruleForm"
                    >
                    <el-form-item label="名称" prop="name" >
                      <el-select
                        v-model="editForm.name"
                        clearable
                        filterable
                        placeholder="请选择"
                        style="width: 240px"
                        @change="nameChange"
                      >
                        <el-option
                          v-for="item in props.ecsnameip"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="ip地址" prop="ip">
                      <el-input v-model="editForm.ip" autocomplete="off" style="width: 240px" disabled />
                    </el-form-item>	
                    <el-form-item label="服务路径" prop="service_path">
                        <el-input v-model="editForm.service_path" autocomplete="off" style="width: 240px" />
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
  import { ref,defineEmits } from 'vue';
  import { ElMessage,ElDrawer } from 'element-plus';
  import { update_nginx_server } from '@/http/ad_tracking/nginx'



 
 

  // 开关
  const drawer = ref(false)

  
  // 定义一个ref对象绑定表单，这个ref用于检查表单是否符合要求
  const ruleFormRef = ref<FormInstance>()
  const  editForm = ref({
      id:0,
      name: '',
      ip: '',
      service_path:'',
      create_time:'',
  })
  
  //  取消
  const resetForm = () => {
     drawer.value=false
     editForm.value.name=''
     editForm.value.ip=''
     editForm.value.service_path=''
  }


  





//验证
//验证添加的账号字段

const validname= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('策略名称名不能为空'))
  } else {
    callback()
  }
}



const validservice_path= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('静默开始时间不能为空'))
  } else {
    callback()
  }
}



const rules = ref<FormRules>({
    name: [{ validator: validname, required: true, trigger: 'blur' }],
    service_path: [{ validator: validservice_path, required: true, trigger: 'blur' }],

})


const props = defineProps({
    ecsnameip: {
      type: Array<{ ip: string, name: string}>,
      required: true
     }
})

const nameChange = (name:any) => {
  const selectedItem = props.ecsnameip.find((item: { name: string }) => item.name === name);
  if (selectedItem) {
    editForm.value.ip = selectedItem.ip
  }
};
  
  const open = (row:any) => {
     editForm.value.id=row.id,
     editForm.value.name=row.name,
     editForm.value.ip=row.ip,
     editForm.value.service_path=row.service_path,
     drawer.value = true
     console.log('修改传入子主件', editForm.value)
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
        const res = await update_nginx_server(editForm.value.id,editForm.value);  
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
  