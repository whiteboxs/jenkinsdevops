<template>
	<div class="header">
		<!-- 折叠按钮 -->
		<div class="collapse-btn" @click="collapseChage">
			<el-icon v-if="sidebar.collapse"><Expand /></el-icon>
			<el-icon v-else><Fold /></el-icon>
		</div>
		<div class="logo">后台管理系统</div>
		<div class="header-right">
			<div class="header-user-con">
				<!-- 消息中心 -->
				<!-- <div class="btn-bell" @click="router.push('/tabs')">
					<el-tooltip
						effect="dark"
						:content="message ? `有${message}条未读消息` : `消息中心`"
						placement="bottom"
					>
						<i class="el-icon-lx-notice"></i>
					</el-tooltip>
					<span class="btn-bell-badge" v-if="message"></span>
				</div> -->
				<!-- 用户头像 -->
				<el-avatar class="user-avator" :size="30" :src="baseURL+'/my/view/'+user.userinfo.userPic || baseURL +'/my/view/default.png'" />
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" >
					<span class="el-dropdown-link">
						{{ user.userinfo.username }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<a href="https://github.com/whiteboxs/jenkinsdevops" target="_blank">
								<el-dropdown-item>项目仓库</el-dropdown-item>
							</a>
							<el-dropdown-item @click="usercenter">个人中心</el-dropdown-item>
							<el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useSidebarStore } from '@/store/sidebar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/login';
import {usePermissStore} from '@/store/permiss'
import { useallroleStore } from '@/store/role'
const baseURL = import.meta.env.VITE_APP_BASE_API
const message: number = 2;

const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChage = () => {
	sidebar.handleCollapse();
};

onMounted(() => {
	if (document.body.clientWidth < 1500) {
		collapseChage();
	}
});

// 用户名下拉菜单选择事件
const router = useRouter();
const user =useAuthStore() 
const permiss =usePermissStore()
const role = useallroleStore()
const handleLogout = () => {
user.logout()
permiss.cleanaccesspermiss()
location.reload();
//role.cleanoneroleinfo()
router.push('/login');

};

const usercenter = () => {
	router.push('/usercenter');
}

</script>
<style scoped>
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 22px;
	color: #fff;
}
.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
}
.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
}
.header-right {
	float: right;
	padding-right: 50px;
}
.header-user-con {
	display: flex;
	height: 70px;
	align-items: center;
}
.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}
.btn-bell .el-icon-lx-notice {
	color: #fff;
}
.user-name {
	margin-left: 10px;
}
.user-avator {
	margin-left: 20px;
}
.el-dropdown-link {
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.el-dropdown-menu__item {
	text-align: center;
}
</style>
