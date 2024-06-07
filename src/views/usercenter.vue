<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>基础信息</span>
						</div>
					</template>
					<div class="info">
						<div class="info-image" @click="showDialog">
							<el-avatar :size="100" :src="avatarImg" />
							<span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
						</div>
						<div class="info-name">{{ user.userinfo.username }}</div>
						<div class="info-role">{{ user.userinfo.role_name }}</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>账户编辑</span>
						</div>
					</template>
					<el-form 
					    :rules="rules"
						label-width="auto"
						:model="changepasswdform"
						ref="ruleFormRef"
						>
						<el-form-item label="用户名："> {{ user.userinfo.username }} </el-form-item>
						<el-form-item label="旧密码：" prop="old_password">
							<el-input type="password" v-model="changepasswdform.old_password" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="新密码：" prop="new_password" >
							<el-input type="password" v-model="changepasswdform.new_password" autocomplete="off" ></el-input>
						</el-form-item>
						<el-form-item label="确认新密码：" prop="confirmPassword" >
							<el-input type="password" v-model="changepasswdform.confirmPassword" autocomplete="off" ></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	<cropper ref="cropperref" @onupdate="handleUpdateAvatar" />
	</div>
</template>

<script setup lang="ts" name="usercenter">
import { ref } from 'vue';

import { useAuthStore } from '@/store/login';
import { changepasswd } from '@/http/api'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';

//图标裁剪编辑
import cropper from '@/components/cropper.vue';

const baseURL = import.meta.env.VITE_APP_BASE_API
const user =useAuthStore() 
const ruleFormRef = ref<FormInstance>()
const changepasswdform = ref({
	old_password: '',
	new_password: '',
	confirmPassword: '',
});


//字段验证
const old_password = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空,请输入原密码'))
  } else {
    callback()
  }
}

const new_password = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空,请输入新密码'))
  } else {
    callback()
  }
}

const confirmPassword = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('确认密码不能为空'))
  } else {
    callback()
  }
}


const rules = ref<FormRules>({
    old_password: [{ validator: old_password, trigger: 'blur',required: true }],
    new_password: [{ validator: new_password, trigger: 'blur',required: true }],
    confirmPassword: [{ validator: confirmPassword, trigger: 'blur',required: true }],
	
})

//修改密码

const onSubmit = async(formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate(async (valid) => {
        if (valid) {
			if (changepasswdform.value.new_password!=changepasswdform.value.confirmPassword){
				ElMessage.error('新密码两次密码输入不一致')
				return false
			}
			const res = await changepasswd(changepasswdform.value);
			ElMessage.success(res.data.msg);
			//清除表单信息
            formEl.resetFields(); 
		} else {
				return false;
			}
    });
};







const avatar = () => {
    if (user.userinfo.userPic) {
        return baseURL + '/my/view/' + user.userinfo.userPic;
    } else {
        return baseURL +'/my/view/default.png';
    }
};

//页面上显示的图片
const avatarImg = ref(avatar());


const handleUpdateAvatar = () => {
	avatarImg.value =  baseURL + '/my/view/' + user.userinfo.userPic;
    console.log('最新的小图标',avatarImg.value) //上传完成回传
}




// 调整裁剪模块,传入的ref不要带value
const cropperref = ref<{ open: (avatarImg :any) => void } | null>(null)
const showDialog = () => {
    cropperref.value?.open(avatarImg)
	console.log('avat',avatarImg)
}
</script>

<style scoped>
.info {
	text-align: center;
	padding: 35px 0;
}
.info-image {
	position: relative;
	margin: auto;
	width: 100px;
	height: 100px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}

.info-edit {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.3s ease;
}
.info-edit i {
	color: #eee;
	font-size: 25px;
}
.info-image:hover .info-edit {
	opacity: 1;
}
.info-name {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}
.info-role {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}

</style>
