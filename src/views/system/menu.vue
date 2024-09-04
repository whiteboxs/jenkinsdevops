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
							 @close="closeDr()"
               size="25%">
							 
						<el-form
							ref="menuFormRef"
							:model="menuForm"
							status-icon
							:rules="rules"
							label-width="100px"
							class="demo-ruleForm"
							>
							<el-form-item label="菜单名称" prop="menu_name">
								<el-input v-model="menuForm.menu_name" autocomplete="off" />
							</el-form-item>
							<el-form-item label="菜单路径" prop="path">
								<el-input v-model="menuForm.menu_path" autocomplete="off" />
							</el-form-item>							
                <el-form-item label="菜单类型" prop="menu_type">
                    <el-radio-group v-model="menuForm.menu_type">
                        <el-radio label="directory">目录</el-radio>
                        <el-radio label="menu">导航菜单</el-radio>
                        <el-radio label="button">菜单按钮</el-radio>
                        <el-radio label="in_menu">嵌入菜单</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
								<el-input v-model="menuForm.icon" autocomplete="off" />
							</el-form-item>
              <el-form-item label="显示顺序" prop="menu_order">
                  <el-input v-model="menuForm.menu_order" autocomplete="off" />
              </el-form-item>
              <el-form-item label="父菜单名称" prop="parentname">
								<el-select v-model="menuForm.parentname" placeholder="请选择父菜单" @change="handleParentChange">
                 <el-option :label="item.title" :value="item.title" v-for="item in directoryMenuItems"
                 :key="item.id" />
                </el-select>
							</el-form-item>	
              <el-form-item label="父菜单id" prop="parentid">
                <el-input v-model="menuForm.parentid" autocomplete="off" disabled/>
              </el-form-item>	
              <el-form-item label="路由名称" prop="route_name">
								<el-input v-model="menuForm.route_name" autocomplete="off" />
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
            :cell-style="cellStyle"
            fit
            height="650"
            >
                <el-table-column prop="id" label="ID/权限" width="80" align="center" type=""></el-table-column>
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
                <el-table-column prop="icon" label="菜单图标"></el-table-column>
                <el-table-column prop="menu_order" label="显示顺序"></el-table-column>
                <el-table-column prop="parentname" label="父菜单名称"></el-table-column>
                <el-table-column prop="parentid" label="父菜单id"></el-table-column>
                <el-table-column prop="route_name" label="路由名称"></el-table-column>
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
import { ref, reactive, onMounted,computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { addmenu,delmenu } from '@/http/api';
import type { FormInstance, FormRules } from 'element-plus'
import { useallmenuStore } from '@/store/system/menu'
import { useAuthStore } from '@/store/login';
//工单编辑
import menuEdit from '@/components/system/menuEdit.vue';
//获取role_id
const usestore =useAuthStore();
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
  role_id:usestore.userinfo.role_id,
  menu_name:'',
	menu_path:'',
	menu_type:'',
  icon:'',
  parentname:'',
  parentid:undefined,
  route_component:'',
  route_name:'',
  menu_order:'',
})

//  取消
const resetForm = () => {
   menuFormRef.value?.resetFields();
   drawer.value=false
}

//验证菜单
const validmenu_name = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('菜单名称不能为空'))
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

const validmenu_order = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('显示顺序权限不能为空'))
  } else {
    callback()
  }
}



const rules = ref<FormRules>({
  menu_name: [{  required: true,validator: validmenu_name, trigger: 'blur' }],
  menu_type: [{  required: true,validator: validmenu_type, trigger: 'blur' }],
	icon:  [{  required: true,validator: validmenu_icon, trigger: 'blur' }],
  menu_order: [{  required: true,validator: validmenu_order, trigger: 'blur' }],
  // route_name: [{  required: true,validator: validroute_name, trigger: 'blur' }],
  // route_component: [{  required: true,validator: validroute_component, trigger: 'blur' }],
	
})



// 提取menu_type字段值为'directory'的信息
const directoryMenuItems = computed(() => {
  // 过滤出menu_type字段值为'directory'的信息
  return allmenuStore.allmenuinfo
    .filter((item: { menu_type: string }) => item.menu_type === 'directory');
});

// 监听 el-select 的 change 事件，更新 parentID
const handleParentChange = (value:any) => {
  const selectedItem = directoryMenuItems.value.find((item: { title: string }) => item.title === value);
  if (selectedItem) {
    menuForm.value.parentid = selectedItem.id
  }
};





//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // if (menuForm.value.parentid === undefined) {
  //       delete menuForm.value.parentid;
  //   }
  //console.log("创建menu",menuForm.value)
  formEl.validate(async (valid) => {
    if (valid) {
        //新增
        await addmenu(menuForm.value).then((response:any)=>{
          console.log('新建menu',menuForm.value)
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
    role_id:usestore.userinfo.role_id,
    menu_name:'',
    menu_path:'',
    menu_type:'',
    icon:'',
    parentname:'',
    parentid:undefined,
    route_component:'',
    route_name:'',
    menu_order:'',
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



  const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: any, columnIndex: any }) => {
    // 状态列字体颜色
    // columnIndex 列下标
    // rowIndex 行下标
    // row 行
    // column 列
    // if (columnIndex === 3) {
    //     return {
    //     fontWeight: 'bold'
    //     };
    // }  
    if(row.menu_type == 'directory' ) {
      return { color: "#1CD66C",fontWeight: 'bold' }
    } 
    if(row.menu_type == 'menu' ) {
      return { color: "#189EFF" }
    } 
    if(row.menu_type == 'button' ) {
      return { color: "#e6a23c" }
    } 
    // if (columnIndex === 0) {
    //     return {
    //     color: "#1CD66C", 
    //     fontWeight: 'bold'
    //     };
    // } 
    // if (columnIndex === 1) {
    //     return {
    //     color: "#189EFF", 
    //     };
    // }
}



</script>

<style scoped>
.el-form-item {
    width: 420px
  }

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
