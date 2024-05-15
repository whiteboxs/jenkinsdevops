<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.name" placeholder="项目名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch" v-permiss="47" >搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="drawer = true" v-permiss="48" >新增JOB</el-button>
					<el-drawer v-model="drawer" 
					      title="I am the title" 
							 :with-header="false"
							 @close="closeDr()">
						<el-form
							ref="ruleFormRef"
							:model="jobForm"
							status-icon
							:rules="rules"
							label-width="120px"
							class="demo-ruleForm"
              v-loading="loading"
              element-loading-text="Loading..."
							>
							<el-form-item label="项目名"  prop="job_name">
								<el-input v-model="jobForm.job_name" autocomplete="off" placeholder="jenkins项目名称" />
              </el-form-item>
              <el-form-item label="git地址" placeholder="git地址" prop="git_address">
								<el-input v-model="jobForm.git_address" autocomplete="off" />
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
								<el-button @click="resetForm()">取消</el-button>
							</el-form-item>
						</el-form>
					</el-drawer>
			</div>
			<el-table :data="showjobs" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column width="45" size="small" prop="id" label="ID"></el-table-column>
				<el-table-column width="180" size="small" prop="job_name" label="项目名"></el-table-column>
        <el-table-column width="110" size="small" prop="gray_ip" label="灰度ip"></el-table-column>
        <el-table-column width="85" size="small" prop="lastgray_build_id" label="当前灰度构建号"></el-table-column>
        <el-table-column width="120" size="small" prop="lastgray_build_time" label="构建日期"></el-table-column>
        <el-table-column width="85" size="small" prop="lastprod_build_id" label="当前生产构建号"></el-table-column>
        <el-table-column width="120" size="small" prop="lastprod_build_time" label="构建日期"></el-table-column>
        <el-table-column width="160" size="small" prop="job_build_ids" label="构建号" header-align="center">
            <template   #default="scope">
                <el-select v-model="scope.row.job_build_ids.job_build_id" placeholder="请选择构建号">
                <el-option :label="item.job_build_id" :value="item.job_build_id" v-for="item in scope.row.job_build_ids" :key="item.job_build_id" />
                </el-select>
            </template>
        </el-table-column>
				<el-table-column label="操作" width="650" align="center">
					<template #default="scope">
            <el-button text :icon="ArrowRight" type="warning" @click="handlepushlistgray(scope.row)" v-permiss="49" >
							灰度构建
						</el-button>
            <el-button text :icon="ArrowRight" type="warning" @click="handlepushlistprod(scope.row.job_name)" v-permiss="50">
							生产构建
						</el-button>
            <el-button text :icon="ArrowLeftBold" type="danger" @click="rollback(scope.row)" v-permiss="51">
							回滚
						</el-button>
            <el-button text :icon="View" type="success" @click="opennode(scope.row)"  v-permiss="57">
							节点管理
						</el-button>
						<el-button text :icon="Edit" type="primary"  @click="handleEdit(scope.row)" v-permiss="55">
							编辑
						</el-button>
						<el-button text :icon="Delete" type="danger" @click="handleDelete(scope.row.id)"  v-permiss="56">
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
					:total=k8sjobStore.allk8sjob.length
					v-model:current-page=pageIndex
					class="mt-4"
				/>
			<k8s_jobEdit ref="editref" @onupdate="k8sjobStore.getallk8sjob" />
      <pushlist_branch :branches=branches ref="pushlist_branchref" @onupdatebranch="k8sjobStore.getallk8sjob" />
      <worknode ref="worknoderef" />
			</div>
		</div>
	</div>

</template>

<script setup lang="ts" name="k8s_job">
import { ref, reactive, onMounted, computed  } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowRight, Delete, Edit, Search, Plus, View,ArrowLeftBold} from '@element-plus/icons-vue';
import { useallk8sjobStore } from '../../store/k8s_job.ts';
import { addk8sjob, deljob,branch } from '../../http/api';
import type { FormInstance, FormRules } from 'element-plus'
import worknode from '../../components/worknode.vue';
import { service_status} from '../../http/api'
//导入构建模块
import pushlist_branch from '../../components/pushlist_branch.vue';

//k8s_jobstore
const  k8sjobStore = useallk8sjobStore()

onMounted(() => {
    k8sjobStore.getallk8sjob()
      .then(() => {
            // 加载完成后关闭加载动画
            loading.value = false;
      })
      .catch(error => {
        // 处理加载失败的情况
        console.error('Failed to load form:', error);
    });
})



const query = reactive({
	department: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});

//table表单加载动画
const loading = ref(true)



// 查询操作
const handleSearch = () => {
	//alluserStore.alluserinfo();
};




// 新增JOB
const drawer = ref(false)
// 定义一个ref对象绑定表单
const ruleFormRef = ref<FormInstance>()
const jobForm = ref({
    id: '',
    job_name:'',
    job_build_id:'',
    gray_ip:'',
    prod_ip:'',
    git_address:'',
    lastgray_build_id: '',
    lastprod_build_id:'',
})




// 发布灰度
const pushlist_branchref = ref<{ query_branch: (row: any) => void } | null>(null)
const handlepushlistgray = async (row:any) => {
  await brancheslist(row.id);
  pushlist_branchref.value?.query_branch(row)
}

//发布生产
const handlepushlistprod = async (row:any) => {
  await brancheslist(row.id);
  pushlist_branchref.value?.query_branch(row)
}


//回滚
const rollback = async (row:any) => {
  await brancheslist(row.id);
  pushlist_branchref.value?.query_branch(row)
}



  //  分支
  const branches = ref([])
  const brancheslist = async (id:any) => {
    const res = await branch(id)
    branches.value = res.data.data
  }





//  取消
const resetForm = () => {
   drawer.value=false
}

//验证添加的账号字段
const validjob_name = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('账号不能为空'))
  } else {
    callback()
  }
}


// const validtest_id = (_: any, value: any, callback: any) => {
//   if (value === '') {
//     callback(new Error('测试ip不能为空'))
//   } else {
//     callback()
//   }
// }

// const validdev_id = (_: any, value: any, callback: any) => {
//   if (value === '') {
//     callback(new Error('开发ip不能为空'))
//   } else {
//     callback()
//   }
// }
const validgit_address = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('git地址不能为空'))
  } else {
    callback()
  }
}




const rules = ref<FormRules>({
    job_name: [{ validator: validjob_name, trigger: 'blur' }],
    // test_ip: [{ validator: validtest_id, trigger: 'blur' }],
    // dev_ip: [{ validator: validdev_id, trigger: 'blur' }],
	  git_address: [{ validator: validgit_address, trigger: 'blur' }],

})


//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 新增
        await addk8sjob(jobForm.value)
        ElMessage.success('新增成功')
        drawer.value = false
        // 刷新页面
        k8sjobStore.getallk8sjob()
      } catch (response:any) {
        // 捕获异常
        if (response.status && response.data.code === 400) {
          // HTTP 400 错误，可能是由于重复的 job 名导致的
          ElMessage.error(response.data.msg)
        } else {
          // 其他错误，输出错误信息
          console.error(response)
        }
      }
    } else {
      return false
    }
  })
}

//  抽屉关闭时的回调
const closeDr=() =>{
  drawer.value=false
    jobForm.value={
    id: '',
    job_name:'',
    job_build_id:'',
    gray_ip:'',
    prod_ip:'',
    git_address:'',
    lastgray_build_id: '',
    lastprod_build_id:'',
    }
}





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
      await deljob(id).then(()=>{
        ElMessage.success('删除成功')
		//刷新页面
        k8sjobStore.getallk8sjob()
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












//前端分页
const pageIndex =ref(1)
//取所有数据放到数组中，一行显示10个
const  showjobs = computed(()=>{
  return k8sjobStore.allk8sjob.slice((pageIndex.value-1)*10,pageIndex.value*10)

  
})	


  //测试灰度发布编辑
import k8s_jobEdit from '../../components/k8s_jobEdit.vue';

// 修改
const editref = ref<{ open: (row: any) => void } | null>(null)
const handleEdit = (row:any) => {
    editref.value?.open(row)
	console.log(editref.value)
}


 //跳转到worknode
const worknoderef = ref<{ disnode: (hosts:any,row: any) => void } | null>(null)
const hosts = ref([])
const opennode = async(row:any) => {
  const res = await  service_status(row.job_name)
  hosts.value = res.data.data
  console.log(hosts.value)
  worknoderef.value?.disnode(hosts,row)
}


  // defineExpose({
  //   opennode
  // })


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
