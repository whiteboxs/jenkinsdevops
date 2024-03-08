<template>
	<div>
	<div class="container">
		<div class="handle-box">
				<!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select> -->
				<el-input v-model="query.role_name" placeholder="角色名称" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="drawer = true" >新增</el-button>
				<el-drawer v-model="drawer" 
					         title="I am the title" 
							 :with-header="false"
							 @close="closeDr()">
							 
						<el-form
							ref="ruleFormRef"
							:model="roleForm"
							status-icon
							:rules="rules"
							label-width="120px"
							class="demo-ruleForm"
							>
							<el-form-item label="角色名" prop="role_name">
								<el-input v-model="roleForm.role_name" autocomplete="off" />
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
								<el-button @click="resetForm()">取消</el-button>
							</el-form-item>
						</el-form>
					</el-drawer>
				</div>
			<el-table :data="allroleStore.allroleinfo" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="role_name" label="角色名"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" ></el-table-column>
				<el-table-column label="操作" width="250" align="center">
					<template #default="scope">
						<el-button type="primary" text :icon="Edit" @click="handleEdit(scope.row)" >
							分配权限
						</el-button>
						<el-button type="danger" text :icon="Delete" @click="handleDelete(scope.row.id)" >
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
	</div>
	<div class="mgb20 tree-wrapper">
				<el-dialog
				:title="'权限分配'"
				v-model="dialogVisible"
				width="500px"
    			>
				<el-scrollbar max-height="600px" >
					<el-tree
					    title="权限配置"
						ref="tree"
						:data="useallroleStore().menutree"
						node-key="id"
						default-expand-all
						show-checkbox
						:props="defaultProps"
					>
					</el-tree>
				</el-scrollbar>
				<template #footer>
        		<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit">保存权限</el-button >
         		 <!-- <el-button @click="closeMenuDialogVisible">取 消</el-button> -->
        		</span>
				</template>
    		</el-dialog>
        </div>
	</div>
</template>

<!-- 角色管理 -->
<script setup lang="ts" name="role">
import { ref,onMounted,nextTick,reactive} from 'vue';
import { useallroleStore } from '../store/role'
import { usePermissStore } from '../store/permiss';
import { ElTree } from 'element-plus';
import { updaterolemenupermiss,addrole,delrole} from '../http/api'
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage,ElMessageBox } from 'element-plus';


const query = reactive({
	role_name: '',
	pageIndex: 1,
	pageSize: 10
});


// 查询操作
const handleSearch = () => {
	//alluserStore.alluserinfo();
};



// 新增用户  
const drawer = ref(false)
// 定义一个ref对象绑定表单
const ruleFormRef = ref<FormInstance>()
const roleForm = ref({
    role_name:'',
})

//  取消
const resetForm = () => {
   drawer.value=false
}


//验证添加的账号字段

const validRolename= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('角色名不能为空'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
    role_name: [{ validator: validRolename, trigger: 'blur' }],

})


//添加角色
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
        //新增
        await addrole(roleForm.value).then((response) => {
            // 提示
            ElMessage.success(response.data.msg || '添加成功');
            drawer.value = false;
            // 刷新页面
            useallroleStore().getallrole();
        }).catch((error) => {
            // 错误处理
            console.error('添加角色失败:', error);;
        });
    } else {
        return false;
    }
  });
};


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
      await delrole(id).then(()=>{
        ElMessage.success('删除成功')
		//刷新页面
        useallroleStore().getallrole();
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


//  抽屉关闭时的回调
const closeDr=() =>{
  drawer.value=false
    roleForm.value={
		role_name:'',

    }
}







  // 弹框开关
const dialogVisible = ref(false)



const allroleStore = useallroleStore()

onMounted(() => {
    allroleStore.getallrole()
	
})


const defaultProps = {
  children: 'children',
  label: 'title',
}

//分配权限	
const permiss = usePermissStore();
const roleid = ref<number>(0);
const handleEdit = async (row:any) => {
	roleid.value = row.id;	
    await permiss.getPremission(row.id)
	dialogVisible.value = true
	// 获取角色权限
	await nextTick(() => {
    const nodes:any = [] 
    permiss.accesspermiss.forEach((item) => {
	  //使用getNode方法获取节点
      const node = tree.value?.getNode(item)
	  // 判断是否是叶子节点
      if (node?.isLeaf)
        nodes.push(item)
    })
	//打开子节点 父节点就变成半显状态了
    tree.value?.setCheckedKeys(nodes, true)
  	})
  }


    //  窗口关闭时的回调
// const closeDr=() =>{
// 	permiss.permisstonull
//     dialogVisible.value=false;

// }


interface updatemenuid
 {
	access: Array<string>;
 }
// 保存权限
const updatekeys = ref<updatemenuid>({
	access: []
})
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = async () => {
	// 获取选中的权限
	const treeKeys: any[] = tree.value!.getCheckedKeys();
	const treehalfKeys: any[] = tree.value!.getHalfCheckedKeys()

	//赋值给ref 形成字典,方便用json格式传入接口
	updatekeys.value.access = treeKeys;
	//合并父的权限 追加到 updatekeys
	updatekeys.value.access = updatekeys.value.access.concat(treehalfKeys);
	//console.log('获取的权限字典', updatekeys.value);
	//使用 store 更新角色权限
	if (roleid.value) {
		try {
            const res = await updaterolemenupermiss(roleid.value, updatekeys.value);
            // 提示
            ElMessage.success(res.data.msg || '添加成功');
            permiss.updatepermiss(res.data.access);
            // allroleStore.getallrole()
            dialogVisible.value = false;
        } catch (error) {
            // 错误处理
            console.error('添加角色失败:', error);
            
        }
    } else {
        console.error('角色 ID 未定义，无法获取权限');
    }
};

</script>
<style scoped lang="less">

.tree-wrapper {
	max-width: 500px;
}
.label {
	font-size: 14px;
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
</style>
