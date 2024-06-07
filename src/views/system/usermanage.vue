<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="drawer = true" >新增</el-button>
					<el-drawer v-model="drawer" 
					         title="I am the title" 
							 :with-header="false"
							 @close="closeDr(ruleFormRef)">
							 
						<el-form
							ref="ruleFormRef"
							:model="userForm"
							status-icon
							:rules="rules"
							label-width="120px"
							class="demo-ruleForm"
							>
							<el-form-item label="账号" prop="username">
								<el-input v-model="userForm.username" autocomplete="off" />
							</el-form-item>
							<el-form-item label="密码" prop="password">
								<el-input v-model="userForm.password" autocomplete="off" />
							</el-form-item>
							<el-form-item label="部门" prop="department">
								<el-input v-model="userForm.department" autocomplete="off" />
							</el-form-item>
							<el-form-item label="角色" prop="role_id">
                                <el-select 
								   v-model="userForm.role_id" 
								   placeholder="请选择角色">
                                  <el-option :label="item.role_name" :value="item.id" v-for="item in allrole.allroleinfo" :key="item.id" />
                                  </el-select>
                            </el-form-item>
							<el-form-item>
								<el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
								<el-button @click="resetForm()">取消</el-button>
							</el-form-item>
						</el-form>
					</el-drawer>
			</div>
			<el-table :data="showUsers" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="username" label="用户名"></el-table-column>
				<el-table-column prop="userPic" label="头像" align="center">
						<template #default="scope">
						<el-image v-if="scope.row.userPic"
							style="width: 80px; height: 80px"
							:src="baseURL+'/my/view/'+scope.row.userPic"
							fit="cover">
						</el-image>
						<el-image v-else
							style="width: 80px; height: 80px"
							:src="baseURL +'/my/view/default.png'"
							fit="cover">
						</el-image>
						</template>
				</el-table-column>
				<el-table-column prop="department" label="部门"></el-table-column>
				<el-table-column  prop="status" label="状态" align="center" >
					<template #default="scope">
						<el-switch
						v-model="scope.row.status"
						@change="handleStatusChange(scope.row)"
						class="ml-2"
   						 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
						/>
					</template>
					</el-table-column>
				<el-table-column prop="role_name" label="角色"></el-table-column>
				<el-table-column prop="create_time" label="创建时间"></el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text type="primary" :icon="Edit" @click="handleEdit(scope.row)">
							编辑
						</el-button>
						<el-button text type="danger" :icon="Delete" class="red" @click="handleDelete(scope.row.id)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					small
					background
					layout="prev, pager, next"
					:total=alluser.alluserinfo.length
					v-model:current-page=pageIndex
					class="mt-4"
				/>
			<userEdit ref="editref" @onupdate="alluser.getalluser" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="usermanage">
import { ref, onMounted, computed  } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { usealluserStore } from '@/store/user';
import { adduser,deluser ,updateuserstatus } from '@/http/api';
import type { FormInstance, FormRules } from 'element-plus'
import { useallroleStore } from '@/store/role'
import {useAuthStore} from '@/store/login'

//工单编辑
import userEdit from '@/components/system/userEdit.vue';

const baseURL = import.meta.env.VITE_APP_BASE_API


//角色store
const allrole = useallroleStore()
//用户store
const  alluser = usealluserStore()

//登录store
const usestore =useAuthStore()
onMounted(() => {
    alluser.getalluser(query.value)
	allrole.getallrole()

	
})





const query = ref<{username: string;}>({
	username: '',
});


// 查询操作
const handleSearch = () => {
	alluser.getalluser(query.value)
};



// 新增用户  
const drawer = ref(false)
// 定义一个ref对象绑定表单
const ruleFormRef = ref<FormInstance>()
const userForm = ref({
    username:'',
	password:'',
	department:'',
    role_id:'',
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

const validRolePwd = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空'))
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
  if (value === '') {
    callback(new Error('请选择角色'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
    username: [{ validator: validRoleUserName, required: true, trigger: 'blur' }],
    role_id: [{ validator: validRoleId, required: true, trigger: 'blur' }],
    department: [{ validator: validDepartment, required: true, trigger: 'blur' }],
	password: [{ validator: validRolePwd, required: true, trigger: 'blur' }],
	
})


//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
        //新增
        await adduser(userForm.value).then(()=>{
			console.log('xinzeng',userForm.value)
            ElMessage.success('新增成功')
			drawer.value=false
			//刷新页面
		    alluser.getalluser(query.value)
        })
      } else {
      return false
    }
  })
}

//  抽屉关闭时的回调
const closeDr=(formEl: FormInstance | undefined) =>{
drawer.value=false
if (!formEl) return;
	formEl.resetFields();
userForm.value={
username:'',
password:'',
department:'',
role_id:'',
}}

// 删除操作
const handleDelete=async (id:any)=>{
  
  ElMessageBox.confirm(
    '确定要删除吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await deluser(id).then(()=>{
        ElMessage.success('删除成功')
		//刷新页面
		alluser.getalluser(query.value)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消成功',
      })
    }
  )
}

/**
 * 用户状态change
 */
const handleStatusChange = async (row:any) => {
//   await updateuserinfo(row.id, row.status);
  await updateuserstatus(row.id,row.status).then(()=>{
       ElMessage.success('修改完成')
       //刷新页面
    })
}	



//前端分页
const pageIndex =ref(1)
//取所有数据放到数组中，一行显示10个
const  showUsers = computed(()=>{
  return alluser.alluserinfo.slice((pageIndex.value-1)*10,pageIndex.value*10)
  
})	



// 修改
const editref = ref<{ open: (row: any) => void } | null>(null)
const handleEdit = (row:any) => {
    editref.value?.open(row)
	console.log(editref.value)
  }
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #F56C6C;
}
.mr10 {
	margin-right: 10px;
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
