<template>
    <div>
        <el-drawer v-model="drawer" 
					         title="I am the title" 
							 :with-header="false"
							 @close="closeDr()">
							 
						<el-form
							ref="menuFormRef"
							:model="menueditForm"
							status-icon
							:rules="rules"
							label-width="120px"
							class="demo-ruleForm"
							>
							<el-form-item label="菜单名称" prop="menu_name">
								<el-input v-model="menueditForm.menu_name" autocomplete="off" />
							</el-form-item>
							<el-form-item label="菜单路径" prop="menu_path">
								<el-input v-model="menueditForm.menu_path" autocomplete="off" />
							</el-form-item>							
                  <el-form-item label="菜单类型" prop="menu_type">
                      <el-radio-group v-model="menueditForm.menu_type">
                          <el-radio label="directory"></el-radio>
                          <el-radio label="menu"></el-radio>
                          <el-radio label="button"></el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="权限" prop="permiss">
								<el-input v-model="menueditForm.id" disabled />
							</el-form-item>
              <el-form-item label="菜单图标" prop="icon">
								<el-input v-model="menueditForm.icon" autocomplete="off" />
							</el-form-item>
              <el-form-item label="显示顺序" prop="menu_order">
								<el-input v-model="menueditForm.menu_order" autocomplete="off" />
							</el-form-item>
              <el-form-item label="父菜单名称" prop="parentname">
								<el-input v-model="menueditForm.parentname" autocomplete="off" />
							</el-form-item>	
              <el-form-item label="父菜单id" prop="parentid">
								<el-input v-model="menueditForm.parentid" autocomplete="off" />
							</el-form-item>	
              <el-form-item label="路由名称" prop="route_name">
								<el-input v-model="menueditForm.route_name" autocomplete="off" />
							</el-form-item>	
              <el-form-item label="路由组件路径" prop="route_component">
								<el-input v-model="menueditForm.route_component" autocomplete="off" />
							</el-form-item>	
							<el-form-item>
								<el-button type="primary" @click="onupdate(menuFormRef)">提交</el-button>
								<el-button @click="resetForm()">取消</el-button>
							</el-form-item>
						</el-form>
					</el-drawer>
    </div>
  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { updatemenu } from '@/http/api';

  import { ref, onMounted,defineEmits } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  

  

  // 开关
  const drawer = ref(false)
  
  
  // 定义一个ref对象绑定表单
const menuFormRef = ref<FormInstance>()
const menueditForm = ref({
id:0,
menu_name:'',
menu_path:'',
menu_type:'',
permiss:null,
icon:'',
parentname:null,
parentid:undefined,
route_component:'',
route_name:'',
menu_order:0
})
  
  //  取消
  const resetForm = () => {
     drawer.value=false
  }
  
//验证rule
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

const validmenu_permiss = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('菜单权限不能为空'))
  } else {
    callback()
  }
}

// const validroute_name = (_: any, value: any, callback: any) => {
//   if (value === '') {
//     callback(new Error('路由名称名不能为空'))
//   } else {
//     callback()
//   }
// }

// const validroute_component = (_: any, value: any, callback: any) => {
//   if (value === '') {
//     callback(new Error('路由组件路径名不能为空'))
//   } else {
//     callback()
//   }
// }




const rules = ref<FormRules>({
    menu_name: [{  required: true,validator: validmenu_name, trigger: 'blur' }],
    menu_type: [{  required: true,validator: validmenu_type, trigger: 'blur' }],
	  icon:  [{  required: true,validator: validmenu_icon, trigger: 'blur' }],
    permiss: [{  required: true,validator: validmenu_permiss, trigger: 'blur' }],
    // route_name: [{  required: true,validator: validroute_name, trigger: 'blur' }],
    // route_component: [{  required: true,validator: validroute_component, trigger: 'blur' }],
})
  
  
  
  
  //  抽屉关闭时的回调
  const closeDr=() =>{
    drawer.value=false
      menuFormRef.value?.resetFields();
      menueditForm.value={
        id:0,
        menu_name:'',
        menu_path:'',
        menu_type:'',
        permiss:null,
        icon:'',
        parentname:null,
        parentid:undefined,
        route_component:'',
        route_name:'',
        menu_order:0,
      }
  }
  
  

  


  
  
  
  
  const open = (row:any) => {
    console.log('当前编辑行', row)
    menueditForm.value.id = row.id
    menueditForm.value.menu_name = row.title
    menueditForm.value.menu_path = row.path
    menueditForm.value.menu_type = row.menu_type
    menueditForm.value.permiss = row.permiss
    menueditForm.value.icon = row.icon
    menueditForm.value.menu_order = row.menu_order
    menueditForm.value.parentname = row.parentname
    menueditForm.value.parentid = row.parentid
    menueditForm.value.route_component = row.route_component
    menueditForm.value.route_name = row.route_name
    drawer.value = true
    console	.log('没提交前的', menueditForm.value)
  }
  defineExpose({
    open
  })
  
  // 更新
  const emit = defineEmits(['onupdate'])
  
  
  const onupdate = async (formEl: FormInstance | undefined) => {  
    if (!formEl) return;  
    if (menueditForm.value.parentid == undefined) {
        delete menueditForm.value.parentid;
    }
    formEl.validate(async (valid) => {  
      if (valid) {  
        // 编辑操作  
        await updatemenu(menueditForm.value.id,menueditForm.value);  
        console.log('编辑提交', menueditForm.value);  
        ElMessage.success('编辑成功');  
        drawer.value = false;  
          
        // 通知父组件更新操作  
        emit('onupdate');  
      } else {  
        // 处理表单验证失败的情况...  
      }  
    });  
  };  
    
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
  