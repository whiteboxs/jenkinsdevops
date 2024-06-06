<template>
  <div>
	<el-drawer v-model="drawer" 
					    title="I am the title" 
							:with-header="false"
							@close="closeDr()">
						<el-form
							ref="ruleFormRef"
							:model="usereditForm"
							status-icon
							:rules="rules"
							label-width="120px"
							class="demo-ruleForm"
							>
							<el-form-item label="账号" prop="username">
								<el-input v-model="usereditForm.username" autocomplete="off" />
							</el-form-item>
							<el-form-item label="部门" prop="department">
								<el-input v-model="usereditForm.department" autocomplete="off" />
							</el-form-item>
							<el-form-item label="头像">
								<el-upload
								class="avatar-uploader"
								:action="baseURL_dev+'/my/upload/'+ usereditForm.user_id"
								:show-file-list="false"
								:on-success="handleAvatarSuccess"
								:before-upload="beforeAvatarUpload"
								:headers="{Authorization: 'Bearer ' + encodeURIComponent(token)}"
								name="file"
								>
								<img v-if="usereditForm.userPic" :src="usereditForm.userPic" class="avatar" />
								<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
								</el-upload>
							</el-form-item>
							<el-form-item label="角色" prop="role_id">
                                <el-select 
								   v-model="usereditForm.role_id" 
								   placeholder="请选择角色">
                                  <el-option :label="item.role_name" :value="item.id" v-for="item in allroleStore.allroleinfo" :key="item.id" />
                                  </el-select>
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
import {baseURL_dev} from '@/config/baseURL'
import { updateuserinfo } from '@/http/api';
import { useallroleStore } from '@/store/role'
import {useAuthStore} from '@/store/login'
import { usealluserStore } from '@/store/user';
import { ref, onMounted,defineEmits } from 'vue';
import type { UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus';

//角色store
const allroleStore = useallroleStore()

//登录store
const usestore =useAuthStore()
onMounted(() => {

	  allroleStore.getallrole()
})
// 编辑用户  
const drawer = ref(false)

// 使用 TypeScript 类型注解  
interface UserForm {  
  user_id: number;  
  username: string;  
  department: string;  
  role_id: number;  
  userPic: string;  
}  

// 定义一个ref对象绑定表单
const ruleFormRef = ref<FormInstance>()
const usereditForm = ref<UserForm>({
  user_id:0,
  username:'',
	department:'',
  role_id:0,
	userPic:"",
})

//  取消
const resetForm = () => {
   drawer.value=false
}

//验证添加的账号字段
const validRoleUserName = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('账号不能为空'))
  } else {
    callback()
  }
}

const validDepartment = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('部门不能为空'))
  } else {
    callback()
  }
}
const validRoleId = (_: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请选择角色'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
    username: [{ required: true,validator: validRoleUserName, trigger: 'blur' }],
    role_id: [{ required: true, validator: validRoleId, trigger: 'change' }],
    department: [{ required: true,validator: validDepartment, trigger: 'blur' }],
})




//  抽屉关闭时的回调
const closeDr=() =>{
  drawer.value=false
    ruleFormRef.value?.resetFields();
    usereditForm.value={
    user_id:0,
		username:'',
		department:'',
		role_id:0,
		userPic:'',
    }
}


// 上传中附带token
const token = usestore.userinfo.access_token

// 文件上传成功时的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response
) => {
  if(response.code==200){
    usereditForm.value.userPic=baseURL_dev+'/my/view/'+response.image
  }else{
    return false
  }
}
// 上传文件之前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //图片格式
  let imgTypes=['image/jpeg','image/jpg','image/png','image/gif']
  if (!imgTypes.includes(rawFile.type)) {
    ElMessage.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}




const open = (row:any) => {
  console.log('当前编辑行', row)
  usereditForm.value.user_id = row.id
  usereditForm.value.username = row.username
  usereditForm.value.department = row.department
  usereditForm.value.role_id = row.role_id
  usereditForm.value.userPic = row.userPic !== null ? baseURL_dev+'/my/view/'+row.userPic : baseURL_dev+"/my/view/default.png"
  drawer.value = true
  console.log('没提交前的', usereditForm.value)
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
      await updateuserinfo(usereditForm.value.user_id, usereditForm.value);  
      console.log('编辑提交', usereditForm.value);  
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
