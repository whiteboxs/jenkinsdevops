<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select> -->
				<el-input v-model="query.menu_name" placeholder="菜单名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="drawer = true" >新增</el-button>
					<el-drawer v-model="drawer" 
					         title="I am the title" 
							 :with-header="false"
							 @close="closeDr()">
							 
						<el-form
							ref="menuFormRef"
							:model="menuForm"
							status-icon
							:rules="rules"
							label-width="120px"
							class="demo-ruleForm"
							>
							<el-form-item label="菜单名称" prop="title">
								<el-input v-model="menuForm.menu_name" autocomplete="off" />
							</el-form-item>
							<el-form-item label="菜单路径" prop="path">
								<el-input v-model="menuForm.menu_path" autocomplete="off" />
							</el-form-item>							
                            <el-form-item label="菜单类型" prop="menu_type">
                                <el-radio-group v-model="menuForm.menu_type">
                                    <el-radio label="directory"></el-radio>
                                    <el-radio label="menu"></el-radio>
                                    <el-radio label="button"></el-radio>
                                </el-radio-group>
                            </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
								<el-input v-model="menuForm.icon" autocomplete="off" />
							</el-form-item>
              <el-form-item label="父菜单名称" prop="parentname">
								<el-input v-model="menuForm.parentname" autocomplete="off" />
							</el-form-item>	
              <el-form-item label="父菜单id" prop="parentid">
								<el-input v-model="menuForm.parentid" autocomplete="off" />
							</el-form-item>	
              <el-form-item label="路由组件路径" prop="route_component">
								<el-input v-model="menuForm.route_component" autocomplete="off" />
							</el-form-item>	
							<el-form-item>
								<el-button type="primary" @click="submitForm(menuFormRef)">提交</el-button>
								<el-button @click="resetForm()">取消</el-button>
							</el-form-item>
						</el-form>
					</el-drawer>
			</div>
			<el-table 
            :data="allmenuStore.menutree" 
            border 
            class="table"
            ref="multipleTable" 
            header-cell-class-name="table-header"
            row-key="id"
            default-expand-all
            highlight-current-row
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            >
                <el-table-column prop="id" label="ID" width="55" align="center" type=""></el-table-column>
                <el-table-column  label="菜单名称" width="220" >
                    <template #default="scope">
                        <el-icon>
                            <component :is="scope.row.icon"></component>
                        </el-icon>
                    {{ scope.row.title }}
                     </template>
                </el-table-column>
                <el-table-column prop="path" label="菜单路径"></el-table-column>
                <el-table-column prop="menu_type" label="菜单类型"></el-table-column>
                <el-table-column prop="permiss" label="权限"></el-table-column>
                <el-table-column prop="icon" label="菜单图标"></el-table-column>
                <el-table-column prop="parentname" label="父菜单名称"></el-table-column>
                <el-table-column prop="parentid" label="父菜单id"></el-table-column>
                <el-table-column prop="route_component" label="路由组件路径"></el-table-column>
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
			<menuEdit ref="editref" @onupdate="allmenuStore.getallmenu()" />
		</div>
	</div>
</template>

<script setup lang="ts" name="menumanage">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { addmenu,delmenu } from '../../http/api';
import type { FormInstance, FormRules } from 'element-plus'
import { useallmenuStore } from '../../store/menu'
//工单编辑
import menuEdit from '../../components/menuEdit.vue';
//菜单store
const allmenuStore = useallmenuStore()

onMounted(() => {
    allmenuStore.getallmenu()
})





const query = reactive({
	menu_name: '',

});


// 查询操作
const handleSearch = () => {
	//alluserStore.alluserinfo();
};



// 新增用户  
const drawer = ref(false)
// 定义一个ref对象绑定表单
const menuFormRef = ref<FormInstance>()
const menuForm = ref({
  menu_name:'',
	menu_path:'',
	menu_type:'',
  icon:'',
  parentname:null,
  parentid:null,
  route_component:'',
})

//  取消
const resetForm = () => {
   menuFormRef.value?.resetFields();
   drawer.value=false
}

//验证菜单
const validmenu_name = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('菜单名不能为空'))
  } else {
    callback()
  }
}


const validmenu_type = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('菜单类型不能为空'))
  } else {
    callback()
  }
}
const validmenu_icon = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('菜单图标不能为空'))
  } else {
    callback()
  }
}

const validmenu_permiss = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('菜单权限不能为空'))
  } else {
    callback()
  }
}


const rules = ref<FormRules>({
  menu_name: [{  required: true,validator: validmenu_name, trigger: 'blur' }],
    menu_type: [{  required: true,validator: validmenu_type, trigger: 'blur' }],
	icon:  [{  required: true,validator: validmenu_icon, trigger: 'blur' }],
    permiss: [{  required: true,validator: validmenu_permiss, trigger: 'blur' }],
	
})


//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (menuForm.value.parentid === null) {
        delete menuForm.value.parentid;
    }
  formEl.validate(async (valid) => {
    if (valid) {
        //新增
        await addmenu(menuForm.value).then((response)=>{
            ElMessage.success(response.data.msg || '新增成功')
			      drawer.value=false
			//刷新页面
		    allmenuStore.getallmenu()
        })
      } else {
      return false
    }
  })
}

//  抽屉关闭时的回调
const closeDr=() =>{
  drawer.value=false
    menuForm.value={
    menu_name:'',
    menu_path:'',
    menu_type:'',
    icon:'',
    parentname:null,
    parentid:null,
    route_component:'',
    }
}

// 删除操作
const handleDelete=async (id:number)=>{
  
  ElMessageBox.confirm(
    '确定要删除吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await delmenu(id).then(()=>{
        ElMessage.success('删除成功')
		//刷新页面
		allmenuStore.getallmenu()
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




// 修改按钮
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
.element-tree-arrow {
    margin-left: 20px;
}
</style>
