<template>
    <el-dialog v-model="DialogVisible"
     title="工单处理" 
     width="30%" 
     align-center>
      <el-form :model="form" 
      label-width="80px"
      ref="addRuleForm"
      :rules="rules"
      >
        <el-form-item label="标题" prop="title" ><el-input v-model="form.title" disabled/>
        </el-form-item>
        <el-form-item label="运行环境" prop="environment_id">
          <el-select v-model="form.environment_id" disabled>
            <el-option :label="item.name" :value="item.name" v-for="item in envdata" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工单详情" prop="description">
          <el-input v-model="form.description" type="textarea" disabled/>
        </el-form-item>
        <el-form-item label="工单状态" prop="status">
          <el-select v-model="form.status">
            <el-option     
                  v-for="item in ticketstatuslist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="经办人" prop="assignee_id">
          <el-select v-model="form.assignee_id" placeholder="请选择经办人" disabled>
            <el-option :label="item.name" :value="item.name" v-for="item in assigneedata" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理详情" prop="comment">
          <el-input v-model="form.comment" type="textarea"/>
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
  
  <script setup lang="ts" >
  
  
  
  
  // TODO: 编辑
  import { getenvironments, getassignees, create_ticket_processing_feedbacks } from '../http/api'
  import { ref,reactive,onMounted } from 'vue'
  // 弹框开关
  const DialogVisible = ref(false)
  //弹窗里获取父表单里对应列的数据
  const form = ref({
    title: '',
    ticket_id:'',
    environment_id: '',
    description: '',
    assignee_id: '',
    id: '',
    status:'',
    comment:''
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
      ],
    comment: [
      {
        required: true, message: '请输入处理信息', trigger: 'blur' ,
      } 
      ],
    })   
  
  //环境接口
  const envdata = ref<any>([])
  const envlist = async () => {
    const res = await getenvironments()
    envdata.value = res.data.data
  }
  onMounted(() => envlist())
  
  // 经办人接口
  const assigneedata = ref<any>([])
  const assigneelist = async () => {
    const res = await getassignees()
    assigneedata.value = res.data.data
  }
  onMounted(() => assigneelist())

  //状态
  //const ticketdata = ref([])

  const ticketstatuslist = [
  {
    value:"未完成",
    label:"未完成",
  },
  {
    value:"已完成",
    label: "已完成",
  }]
  
  const open = (row:any) => {
    console.log('当前编辑行', row)
    form.value.title = row.title
    form.value.ticket_id = row.ticket_id
    form.value.environment_id = row.environment
    form.value.status = row.status
    form.value.description = row.description
    form.value.assignee_id = row.assignee
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
      //1.收集表单数据，调用接口
      const updatedData = {
        ticket_status: form.value.status,
        comment: form.value.comment,
        ticket_id: form.value.ticket_id, 
      };
      console.log('put前没有转换的值',form.value)
      console.log('上传前的值',updatedData)
      await create_ticket_processing_feedbacks(updatedData)
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
  