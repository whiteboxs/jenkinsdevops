<template>
    <div>
    <el-dialog v-model="dialogVisible"
     title="项目发布" 
     width="30%" 
     >
      <el-form :model="form" 
      label-width="80px"
      ref="ruleFormRef"
      :rules="rules"
      >
        <el-form-item label="项目名" prop="job_name" ><el-input v-model="form.job_name" disabled/>
        </el-form-item>
        <el-form-item label="分支" prop="parameters">
          <el-select v-model="form.BRANCH" placeholder="请选择分支" >
            <el-option :label="item.BRANCH" :value="item.BRANCH" v-for="item in branches" :key="item.BRANCH" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onupdatebranch">确认构建</el-button>
        </span>
      </template>
    </el-dialog>
   </div>
  </template>
  
  <script setup lang="ts">
  
  // TODO: 编辑
  import type { FormInstance, FormRules } from 'element-plus'
  import { build,buildstatus,save_build_id } from '@/http/api'
  import { ref} from 'vue'
  import { ElMessage,ElMessageBox } from 'element-plus';
  //import { useallbransh } from '../store/branch.ts'
  

// //k8s_jobstore
// const  branchStore = useallbransh()

// onMounted(() => {
//     branchStore.getbranch(form.value.id)	
// })



  // 弹框开关
  const dialogVisible = ref(false)

  const validBRANCH = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('分支不能为空'))
    } else {
      callback()
    }
  }
  
  const rules = ref<FormRules>({
    BRANCH: [{ validator: validBRANCH, trigger: 'blur' }],
      
  })

    // 使用 TypeScript 类型注解  
    interface branchForm {  
    job_name: string;  
    parameters: Array<{ BRANCH: string }>;  
    BRANCH: string;
    }


  //弹窗里获取父表单里对应列的数据
   // 定义一个ref对象绑定表单
const ruleFormRef = ref<FormInstance>()
  const form= ref<branchForm>({
    job_name: '',
    parameters: [],
    BRANCH: '',
  })


  
 
  
//父传子 将branches传入到子组件里
const props = defineProps({
     branches: {
      type: Array<{ BRANCH: string }>,
      required: true
     }
})
  
  const query_branch = (row:any) => {
    form.value.job_name = row.job_name
    form.value.parameters = props.branches
    console.log('form.value.parameters',form.value.parameters)
    dialogVisible.value = true

  }


  defineExpose({
    query_branch
  })
  
  //更新
  const emit = defineEmits(['onupdatebranch'])

  
  
  const onupdatebranch = async () => {  
        // 编辑操作   如果要打印出来返回的数据要赋值下给res
        const building = await build(form.value);  
        // 提示成功
        ElMessage.success(building.data.msg);
        // 关闭弹窗
        dialogVisible.value = false;
        ElMessageBox.alert(`${building.data.msg}`)
        // 等待构建完成或超时
        const maxWaitTime = 600000;  // 10分钟超时
        let currentWaitTime = 0;
        let firstWait = true; // 标记是否第一次等待
        while (currentWaitTime < maxWaitTime) {
          // 根据是否是第一次等待来决定等待时间
          const waitTime = firstWait ? 4000 : 1000;
          firstWait = false; // 将第一次等待标记为 false
          console.log(waitTime)
          // 等待2秒
          await new Promise(resolve => setTimeout(resolve, waitTime));

          // 获取构建状态
          const buildResult = await buildstatus(form.value);  // 自定义获取构建状态的函数，根据实际情况实现
             console.log('buildResult',buildResult)
          // 判定构建状态
          if (buildResult.data.status === 'SUCCESS' || buildResult.data.status === 'FAILURE'|| buildResult.data.status === 'ABORTED') {
            //每次循环前关闭上一次的提示
            ElMessageBox.close();
            ElMessageBox.alert(`构建结束！状态为：${buildResult.data.status}`)
            ElMessage.success(buildResult.data.msg);
            //保存构建id到数据库
            await save_build_id(form.value); 
            emit('onupdatebranch');
            return;
          } else {
            //每次循环前关闭上一次的提示
            ElMessageBox.close();
            // 更新提示框内容
            ElMessageBox.alert('构建中，请等待！状态为：building',{
            showClose: false,
            closeOnClickModal: false,
            type: 'info'
            })
            ElMessage.success(buildResult.data.msg)
            console.log('构建中，请等待！', buildResult);
            }
          currentWaitTime += waitTime;
        }
}  
 
  

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
  

  
  
  </style>
  