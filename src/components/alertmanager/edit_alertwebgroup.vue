<template>
  <div>
    <el-drawer 
    v-model="drawer" 
    title="编辑静默策略" 
    @close="closeDr()">          
    <el-form
        ref="ruleFormRef"
        :model="editForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        >
        <el-form-item label="告警群名称" prop="name">
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
        <el-form-item label="URL" prop="url">
                <el-input v-model="editForm.url" autocomplete="off" :rows="2" type="textarea"/>
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
  import { ElMessage, ElMessageBox,ElDrawer } from 'element-plus';
  import { updatealerr_webhook } from '@/http/alert/api';
  import { monitor_group } from '@/http/api'


 
 

  // 开关
  const drawer = ref(false)

  
  // 定义一个ref对象绑定表单，这个ref用于检查表单是否符合要求
  const ruleFormRef = ref<FormInstance>()
  const  editForm = ref({
      id:0,
      name: '',
      url:'',
      group:[],
  })
  
  //  取消
  const resetForm = () => {
     drawer.value=false
     editForm.value.name=''
     editForm.value.group=[],
     editForm.value.url=''

  }
  


  //  抽屉关闭后监控检查后的回调
const closeDr=() =>{
  drawer.value=false
    ruleFormRef.value?.resetFields();
    editForm.value={
    id:0,
    name: '',
    group:[],
    url: '',
  }
}


// 获取监控组
const monitorgroups = ref([])
const monitor_grouplist = async () => {
  const res = await monitor_group()
  const mapgrouops = res.data.monitor_group.map((i:any) => {
  return { value: i, label: i };
  });
  monitorgroups.value = mapgrouops
}


monitor_grouplist()

//验证
//验证添加的账号字段

const validname= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('告警群名不能为空'))
  } else {
    callback()
  }
}



const validurl= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('链接地址不能为空'))
  } else {
    callback()
  }
}

const validgroup= (_: any, value: any, callback: any) => {
  if (!value.length) {
    callback(new Error('告警组不能为空'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
    name: [{ validator: validname, required: true, trigger: 'blur' }],
    url: [{ validator: validurl, required: true, trigger: 'blur' }],
    group: [{ validator: validgroup, required: true, trigger: 'blur' }]
})



  
  const open = (row:any) => {
     editForm.value.id=row.id,
     editForm.value.name=row.name,
     editForm.value.url=row.url,
     editForm.value.group=row.group,
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
        const res = await updatealerr_webhook(editForm.value.id,editForm.value);  
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
  