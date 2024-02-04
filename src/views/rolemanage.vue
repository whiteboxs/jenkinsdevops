<template>
	<div>
	<div class="container">
			<el-table :data="allroleStore.allroleinfo" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="role_name" label="角色名"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" ></el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button type="primary" text :icon="Edit" @click="handleEdit(scope.row)" v-permiss="15">
							分配权限
						</el-button>
					</template>
				</el-table-column>
			</el-table>
	</div>
	<div class="mgb20 tree-wrapper">
				<el-dialog
				:title="'资源分配'"
				v-model="dialogVisible"
				@close="closeDr()"
				width="500px"
    			>
				<el-scrollbar max-height="600px" >
					<el-tree
					    title="权限配置"
						ref="tree"
						:data="data"
						node-key="id"
						default-expand-all
						show-checkbox
						:default-checked-keys="checkedKeys"
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
import { ref,onMounted } from 'vue';
import { useallroleStore } from '../store/role'
import { Edit } from '@element-plus/icons-vue';
import { usePermissStore } from '../store/permiss';
import { ElTree } from 'element-plus';


  // 弹框开关
const dialogVisible = ref(false)


// 获取角色列表
const roleList = ref([])

const allroleStore = useallroleStore()

onMounted(() => {
    allroleStore.getallrole()

})



//分配权限	
const role = ref<number>()
const handleEdit =  (row:any) => {
	role.value  = row.id
	console.log('roleid', role.value)
	getPremission();
	dialogVisible.value = true
  }



  interface Tree {
	id: string;
	label: string;
	children?: Tree[];
}

const data: Tree[] = [
	{
		id: '1',
		label: '系统首页'
	},
	{
		id: '2',
		label: '基础表格',
		children: [
			{
				id: '15',
				label: '编辑'
			},
			{
				id: '16',
				label: '删除'
			},
			{
				id: '22',
				label: '测试构建'
			},
			{
				id: '23',
				label: '开发构建'
			}
		]
	},
	{
		id: '3',
		label: 'tab选项卡'
	},
	{
		id: '4',
		label: '表单相关',
		children: [
			{
				id: '5',
				label: '基本表单'
			},
			{
				id: '6',
				label: '文件上传'
			},
			{
				id: '7',
				label: '三级菜单',
				children: [
					{
						id: '8',
						label: '富文本编辑器'
					},
					{
						id: '9',
						label: 'markdown编辑器'
					}
				]
			}
		]
	},
	{
		id: '10',
		label: '自定义图标'
	},
	{
		id: '11',
		label: 'schart图表'
	},

	{
		id: '13',
		label: '权限管理'
	},
	{
		id: '14',
		label: '工单管理',
		children: [
			{
				id: '17',
				label: '我的工单'
			},
			{
				id: '17',
				label: '工单处理'
			}
		]	
	},
	{
		id: '18',
		label: '发布管理',
		children: [
			{
				id: '19',
				label: '发布k8s'
			},
			{
				id: '20',
				label: '发布后端'
			},
			{
				id: '21',
				label: '发布前端'
			}
		]	
	},
];

const permiss = usePermissStore();

// 获取当前权限
const checkedKeys = ref<string[]>([]);
const getPremission =  () => {
	// 请求接口返回权限
	checkedKeys.value = permiss.defaultList[role.value];
	console.log('权限接口返回',checkedKeys.value);
};



  //  窗口关闭时的回调
const closeDr=() =>{
    dialogVisible.value=false
	checkedKeys.value=[]
	console.log('关闭窗口',checkedKeys);
}
  


// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = () => {

	// 获取选中的权限
	const treeKeys: any[] = tree.value!.getCheckedKeys(false);

	// 将 any[]转换为 string[]
	const stringKeys: string[] = treeKeys.map(key => String(key));

	console.log('获取的权限', stringKeys);

	// 使用 store 更新角色权限
	console.log('更新前role.vuale', role.value);
	if (role.value !== undefined) {
	permiss.setRolePermissions(role.value, stringKeys);
	console.log('更新后的权限', permiss.defaultList[role.value]);
	} else {
	console.error('角色 ID 未定义，无法获取权限');
	}



    //更新
	const keys = permiss.defaultList[role.value];
	permiss.handleSet(keys);
	localStorage.setItem('ms_keys', JSON.stringify(keys));
	dialogVisible.value = false

	
};


</script>



<style scoped lang="less">

.tree-wrapper {
	max-width: 500px;
}
.label {
	font-size: 14px;
}
</style>
