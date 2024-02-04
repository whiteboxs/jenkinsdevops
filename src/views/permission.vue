<template>
	<div class="container">
		<div class="plugins-tips">通过 v-permiss 自定义指令实现权限管理，使用非 admin 账号登录，可查看效果。</div>
		<div class="mgb20">
			<span class="label">角色：</span>
			<el-select v-model="role" @change="handleChange">
				<el-option label="超级管理员" value="1"></el-option>
				<el-option label="普通用户" value="2"></el-option>
			</el-select>
		</div>
		<div class="mgb20 tree-wrapper">
			<el-tree
				ref="tree"
				:data="data"
				node-key="id"
				default-expand-all
				show-checkbox
				:default-checked-keys="checkedKeys"
			/>
		</div>
		<el-button type="primary" @click="onSubmit">保存权限</el-button>
	</div>
</template>

<script setup lang="ts" name="permission">
import { ref } from 'vue';
import { ElTree } from 'element-plus';
import { usePermissStore } from '../store/permiss';

const role = ref<string>('1');

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
const getPremission = () => {
	// 请求接口返回权限
	checkedKeys.value = permiss.defaultList[role.value];
	console.log('权限接口返回',checkedKeys.value);
};
getPremission();

// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = () => {
	// 获取选中的权限
	console.log('获取的权限',tree.value!.getCheckedKeys(false));
};

const handleChange = (val: string[]) => {
	tree.value!.setCheckedKeys(permiss.defaultList[role.value]);
};
</script>

<style scoped>
.tree-wrapper {
	max-width: 500px;
}
.label {
	font-size: 14px;
}
</style>
