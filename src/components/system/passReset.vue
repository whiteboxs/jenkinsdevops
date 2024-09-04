<template>
    <div>
      <el-drawer v-model="drawer" 
          title="重置密码" 
          :with-header="false"
          @close="closeDr()"
          size="20%"
          >
           <el-form 
					  :rules="rules"
						label-width="120px"
						:model="resetpasswdfrom"
						ref="ruleFormRef"
						>
						<el-form-item label="重置新密码：" prop="password" >
							<el-input :type="PassFlag ? 'text' : 'password'" v-model="resetpasswdfrom.password" autocomplete="off"  >
								<template #suffix>
								<span @click="PassFlag = !PassFlag">
								<el-icon v-if="PassFlag"><View /></el-icon>
								<el-icon v-else><Hide /></el-icon>
									</span>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item label="确认重置密码：" prop="confirmpassword" >
							<el-input :type="confirmPassFlag ? 'text' : 'password'" v-model="resetpasswdfrom.confirmpassword" autocomplete="off" style="width: 240px">
								<template #suffix>
								<span @click="confirmPassFlag = !confirmPassFlag">
								<el-icon v-if="confirmPassFlag"><View /></el-icon>
								<el-icon v-else><Hide /></el-icon>
									</span>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onresetpasswd(ruleFormRef)">确认</el-button>
						</el-form-item>
					</el-form>
        </el-drawer>
    </div>
  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { resetpasswd } from '@/http/api';
  import { ref} from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  // 编辑用户  
const drawer = ref(false)
  
const PassFlag=ref(false)//图标显示标识
const confirmPassFlag=ref(false)//图标显示标识

  // // 使用 TypeScript 类型注解  
  // interface resetpasswdFromtype {  
  //   id: number;
  //   username:string,
  //   password: string;
  //   confirmpassword:string

  // } 
  
  // 定义一个ref对象绑定表单
  const ruleFormRef = ref<FormInstance>()
  const resetpasswdfrom = ref({
    id:0,
    username:'',
    password:'',
    confirmpassword:''
  })
  

  
  //验证添加的账号字段
  const password = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('密码不能为空'))
    } else {
      callback()
    }
  }
  
  const confirmpassword = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('密码不能为空'))
    } else {
      callback()
    }
  }
  
  const rules = ref<FormRules>({
    password: [{ required: true,validator: password, trigger: 'blur' }],
    confirmpassword: [{ required: true,validator: confirmpassword, trigger: 'blur' }],
  })
  
  
  
  
  //  抽屉关闭时的回调
  const closeDr=() =>{
    drawer.value = false;  
    ruleFormRef.value?.resetFields();
    resetpasswdfrom.value={
      id:0,
      username:'',
      password:'',
      confirmpassword:''
    }
  }
  
  

  

  
  
  
  
  const openresetpasswd = (row:any) => {
    drawer.value = true
    resetpasswdfrom.value.id = row.id
    resetpasswdfrom.value.username = row.username
    console.log('传入的参数',resetpasswdfrom.value)
  }
  defineExpose({
    openresetpasswd
  })
  
  
  
  const onresetpasswd = async (formEl: FormInstance | undefined) => {  
    if (!formEl) return;  
    if (resetpasswdfrom.value.password !== resetpasswdfrom.value.confirmpassword){
        ElMessage({
            type: 'error',
            message: '两次密码不一致',
        })
        return
    }
  
    formEl.validate(async (valid) => {  
      if (valid) {  
        ElMessageBox.confirm(
        '确定需重置用户名为'+ resetpasswdfrom.value.username + '的密码吗?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning'
        }).then(async () => {
          try {  
                    const res = await resetpasswd(resetpasswdfrom.value);  
                    ElMessageBox.alert(res.data.msg, '提示', {  
                        confirmButtonText: '确定',  
                    });  
                    drawer.value = false;  
                } catch (error) {  
                    console.log(error);  
                    ElMessage({  
                        type: 'info',  
                        message: '操作失败',  // 更改消息以更准确地反映可能发生的错误  
                    });  
                }  
        })
        .catch((error) => {
        console.log(error)
        ElMessage({
            type: 'info',
            message: '取消成功',
        })
        }
    )  
      } else {  
        // 处理表单验证失败的情况...  
      }  
    });  
  };  
  

  
  </script>
  
  
  
  <style scoped>

  .el-form-item {
    width: 320px
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
  