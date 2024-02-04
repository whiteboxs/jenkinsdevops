<template>
    <div>
      <el-drawer v-model="drawer" 
                          title="I am the title" 
                              :with-header="false"
                              @close="closeDr()">
                          <el-form
                              ref="ruleFormRef"
                              :model="jobeditForm"
                              status-icon
                              :rules="rules"
                              label-width="120px"
                              class="demo-ruleForm"
                              >
                              <el-form-item label="项目名" prop="job_name">
                                  <el-input v-model="jobeditForm.job_name" autocomplete="off" />
                              </el-form-item>
                              <el-form-item label="测试ip" prop="test_ip">
                                  <el-input v-model="jobeditForm.test_ip" autocomplete="off" />
                              </el-form-item>
                              <el-form-item label="部门" prop="dev_ip">
                                  <el-input v-model="jobeditForm.dev_ip" autocomplete="off" />
                              </el-form-item>
                              <el-form-item label="git地址" prop="git_address">
                                <el-input v-model="jobeditForm.git_address" autocomplete="off" />
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
  import {baseURL_dev} from '../config/baseURL'
  import { updatejobinfo } from '../http/api';
  import { useallk8sjobStore } from '../store/k8s_job.ts'
  import { ref, onMounted,defineEmits } from 'vue';
  import type { UploadProps } from 'element-plus'
  import { ElMessage, ElMessageBox } from 'element-plus';
  
//k8s_jobstore
const  k8sjobStore = useallk8sjobStore()

onMounted(() => {
    k8sjobStore.getallk8sjob()	
})

  // 编辑用户  
  const drawer = ref(false)
  
  // 使用 TypeScript 类型注解  
  interface UserForm {  
    id: number;  
    job_name: string;  
    test_ip: string;  
    dev_ip: string;  
    git_address: string;  
  }  
  
  // 定义一个ref对象绑定表单
  const ruleFormRef = ref<FormInstance>()
  const jobeditForm = ref<UserForm>({
    id:0,
    job_name:'',
    test_ip:'',
    dev_ip:'',
    git_address:'',
  })
  
  //  取消
  const resetForm = () => {
     drawer.value=false
  }
  
  //验证添加的账号字段
  const validjob_name = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('项目名不能为空'))
    } else {
      callback()
    }
  }
  
  const validtest_ip = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('密测试ip不能为空'))
    } else {
      callback()
    }
  }
  
  const validdev_ip = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('开发ip不能为空'))
    } else {
      callback()
    }
  }
  const validgit_address = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('git地址不能为空'))
    } else {
      callback()
    }
  }
  
  const rules = ref<FormRules<typeof usereditForm>>({
      job_name: [{ validator: validjob_name, trigger: 'blur' }],
      test_ip: [{ validator: validtest_ip, trigger: 'blur' }],
      dev_ip: [{ validator: validdev_ip, trigger: 'blur' }],
      git_address: [{ validator: validgit_address, trigger: 'blur' }],
      
  })
  
  
  
  
  //  抽屉关闭时的回调
  const closeDr=() =>{
    drawer.value=false
      jobeditForm.value={
       id:0,
       job_name:'',
       test_ip:'',
       dev_ip:'',
       git_address:'',
      }
  }
  
  
  
  
  
  
  const open = (row:any) => {
    console.log('当前编辑行', row)
    jobeditForm.value.id = row.id
    jobeditForm.value.job_name = row.job_name
    jobeditForm.value.test_ip = row.test_ip
    jobeditForm.value.dev_ip = row.dev_ip
    jobeditForm.value.git_address = row.git_address
    drawer.value = true
    console	.log('没提交前的', jobeditForm.value)
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
        await updatejobinfo(jobeditForm.value.id, jobeditForm.value);  
        console.log('编辑提交', jobeditForm.value);  
        ElMessage.success('编辑成功');  
        drawer.value = false;  
          
        // 通知父组件更新操作  
        emit('onupdate');  
      } else {  
        // 处理表单验证失败的情况...  
      }  
    });  
  };  
  
  
  
  
  
  //更新
  // const emit = defineEmits(['onupdate'])
  // const addRuleForm = ref();
  // const onupdate = async () => {
  //   try {
  //     await addRuleForm.value.validate();
  //       if (!usereditForm) {
  //       console.log("表单验证不通过");
  //       return; // 验证不通过时，停止继续执行下面的代码
  //     } 
  //   // // 0. 转换经办人和环境的名称为 ID
  //   // const environmentId = envdata.value.find(item => item.name === form.value.environment_id)?.id;
  //   // const assigneeId = assigneedata.value.find(item => item.name === form.value.assignee_id)?.id;
  
  //   // if (!environmentId || !assigneeId) {
  //   //   console.error('无效的环境或经办人名称');
  //   // //   return;
  //   // }
  //     //1.收集表单数据，调用接口
  //     const updatedData = {
  //       username: usereditForm.value.username,
  //       password: usereditForm.value.password,
  //       department: usereditForm.value.department,
  //       role_id: usereditForm.value.role_id
  //     };
  //     console.log('put前没有转换的值',usereditForm.value)
  //     console.log('转换后的',updatedData)
  //     await updateuserinfo(usereditForm.value.user_id, usereditForm)
  //     //清除提交的表单
  //     addRuleForm.value.resetFields()
  //     // 关闭窗口和刷新列表
  //     drawer.value = false;
  
  //     //3.通知父主键做列表更新(子传父)都感觉超难
  //     emit('onupdate')
  //   } catch (error) {
  //     console.error('更新工单出错：', error);
  //     // 根据需要处理错误
  //   }
  // }
  
  
  </script>
  
  
  
  <style scoped>
  .el-input {
    width: 290px;
  }
  
  
  .table-td-thumb {
      display: block;
      margin: auto;
      width: 40px;
      height: 40px;
  }
  
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  
  
  </style>
  