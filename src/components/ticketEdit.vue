<template>
  <el-dialog v-model="DialogVisible"
   title="编辑工单" 
   width="30%" 
   align-center>
    <el-form :model="form" 
    label-width="80px"
    ref="addRuleForm"
    :rules="rules"
    >
      <el-form-item label="标题" prop="title" ><el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="运行环境" prop="environment_id">
        <el-select v-model="form.environment_id" >
          <el-option :label="item.name" :value="item.name" v-for="item in envdata" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工单详情" prop="description">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item label="经办人" prop="assignee_id">
        <el-select v-model="form.assignee_id" placeholder="请选择经办人" >
          <el-option :label="item.name" :value="item.name" v-for="item in assigneedata" :key="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onupdate">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>

// TODO: 编辑
import { getenvironments, getassignees, putticket } from '../http/api.ts'
import { ref } from 'vue'
// 弹框开关
const DialogVisible = ref(false)
//弹窗里获取父表单里对应列的数据
const form = ref({
  title: '',
  environment_id: '',
  description: '',
  assignee_id: '',
  ticket_id: '',
  status:''
})

const rules = reactive ({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur'
   }
   ],
  environment_id: [
    {
      required: true,message: '请选择使用环境',trigger: 'change',
    } 
    ],
  description: [
    {
      required: true, message: '请输入具体信息', trigger: 'blur' ,
    } 
    ],
  assignee_id: [
    {
      required: true,message: '请选择使用经办人',trigger: 'change',
    } 
    ]
  })   

//环境接口
const envdata = ref([])
const envlist = async () => {
  const res = await getenvironments()
  envdata.value = res.data.data
}



onMounted(() => envlist())

// 经办人接口
const assigneedata = ref([])
const assigneelist = async () => {
  const res = await getassignees()
  assigneedata.value = res.data.data
}

onMounted(() => assigneelist())

const open = (row) => {
  console.log('当前编辑行', row)
  form.value.title = row.title
  form.value.ticket_id = row.ticket_id
  form.value.environment_id = row.environment
  form.value.description = row.description
  form.value.assignee_id = row.assignee
  form.value.status = row.status
  DialogVisible.value = true

}
defineExpose({
  open
})

//更新
const emit = defineEmits(['onupdate'])
const addRuleForm = ref();
const onupdate = async () => {
  try {
    await addRuleForm.value.validate();
      if (!form) {
      console.log("表单验证不通过");
      return; // 验证不通过时，停止继续执行下面的代码
    } 
  // 0. 转换经办人和环境的名称为 ID
  const environmentId = envdata.value.find(item => item.name === form.value.environment_id)?.id;
  const assigneeId = assigneedata.value.find(item => item.name === form.value.assignee_id)?.id;

  if (!environmentId || !assigneeId) {
    console.error('无效的环境或经办人名称');
    return;
  }
    //1.收集表单数据，调用接口
    const updatedData = {
      title: form.value.title,
      environment_id: environmentId, // 使用转换后的 ID
      description: form.value.description,
      assignee_id: assigneeId, // 使用转换后的 ID
      status: form.value.status
    };
    console.log('put前没有转换的值',form.value)
    console.log('转换后的',updatedData)
    await putticket(form.value.ticket_id, updatedData)
    //清除提交的表单
    addRuleForm.value.resetFields()
    // 关闭窗口和刷新列表
    DialogVisible.value = false;

    //3.通知父主键做列表更新(子传父)都感觉超难
    emit('onupdate')
  } catch (error) {
    console.error('更新工单出错：', error);
    // 根据需要处理错误
  }
}
</script>



<style scoped>
.el-input {
  width: 290px;
}
</style>
