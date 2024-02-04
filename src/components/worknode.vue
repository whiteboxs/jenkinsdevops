<template>
 <div>
    <el-dialog v-model="dialogTableVisible" title="节点管理" width="60%" 
    @close="closeDr()">
        <el-table :data="form.hosts" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column width="160" prop="hostname" label="主机名"  />
        <el-table-column width="120" prop="ip" label="ip" />
        <el-table-column width="100" prop="state" label="运行状态" />
        <el-table-column width="160" prop="program" label="程序名称" />
        <el-table-column width="200" prop="description" label="详细状态" />>
        <el-table-column fixed="right" label="操作" width="380">
        <template #default="scope">
          <el-row class="mb-4">
          <el-button type="success"  @click="handlerstart(scope.row)"
            >启动</el-button>
            <el-button type="primary" @click="handlerrestart(scope.row)"
            >重启</el-button>
            <el-button type="danger" @click="handlerstop(scope.row)"
            >关闭</el-button>
            <el-button type="info" @click="handlerlog"
            >查看日志</el-button>
          </el-row>
        </template>
        </el-table-column>
      </el-table>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script lang="ts" setup>
  import {  ref } from 'vue'
  import { noderestart, nodestop, nodestart,service_status} from '../http/api'
  import { ElMessage, ElMessageBox } from 'element-plus';
  const dialogTableVisible = ref(false)
  

  const closeDr=() =>{
    dialogTableVisible.value=false
    clearInterval(refreshInterval); // 清除之前的定时器

}

  interface TableData {
  hosts: { ip: string; hostname: string; description: string;state: string;program:string }[];
  job_name: string;
}

const form = ref<TableData>({ 
  hosts: [],
  job_name:'',
 });
  

// 定义定时器变量
 let refreshInterval: any;
// 父组件调用的函数
  const disnode = (hosts:any,row:any) => {
    form.value.hosts = hosts
    form.value.job_name = row.job_name
    dialogTableVisible.value = true
   // 启动定时器1秒刷新一次
    refreshInterval = setInterval(async () => {
    const res_service = await service_status(form.value.job_name);
    form.value.hosts = res_service.data.data;
  }, 1000); // 这里的 2000 表示刷新间隔，单位是毫秒
}

  defineExpose({
    disnode
  })


  const handleClose = () => {
  // 在关闭按钮点击事件中清除定时器
    clearInterval(refreshInterval);
    // 关闭对话框
    dialogTableVisible.value = false;
  }
//父传子 将branches传入到子组件里
// const props = defineProps({
//      hosts: {
//       type: Array<{ id: string,hostanme: string,ip:string }>,
//       required: true
//      }
// })

interface nodeData {
   ip: string; 
   program:string
}

const nodeform = ref<nodeData>({
  ip:'',
  program:''
})

  const handlerstart = async (row:any) => {
  clearInterval(refreshInterval); // 清除之前的定时器
  nodeform.value.ip = row.ip
  nodeform.value.program = row.program
  try {
    await ElMessageBox.confirm(
        '确定要启动吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
    const res = await nodestart(nodeform.value);
    ElMessage.success(res.data.msg);
    // 刷新页面
    refreshInterval = setInterval(async () => {
    const res_service = await service_status(form.value.job_name);
    form.value.hosts = res_service.data.data;
  }, 1000); // 这里的 2000 表示刷新间隔，单位是毫秒
  } catch (error) {
      ElMessage({
          type: 'info',
          message: '取消成功',
      });
  }
}

const handlerrestart  = async (row:any) => {
  clearInterval(refreshInterval); // 清除之前的定时器
  nodeform.value.ip = row.ip
  nodeform.value.program = row.program
  // 提取 _ 前面的数据
  const hostnameSplit = row.hostname.split('_');
  const hostanme = hostnameSplit[0];
  try {
    await ElMessageBox.confirm(
        '确定要重启吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
    const res = await noderestart(nodeform.value);
    ElMessage.success(res.data.msg);
    // 刷新页面
    refreshInterval = setInterval(async () => {
    const res_service = await service_status(form.value.job_name);
    form.value.hosts = res_service.data.data;
  }, 1000); // 这里的 2000 表示刷新间隔，单位是毫秒
  } catch (error) {
      ElMessage({
          type: 'info',
          message: '取消成功',
      });
  }
}


const handlerstop = async (row:any) => {
  clearInterval(refreshInterval); // 清除之前的定时器
  nodeform.value.ip = row.ip
  nodeform.value.program = row.program
  try {
    await ElMessageBox.confirm(
        '确定要关闭吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
    const res = await nodestop(nodeform.value);
    ElMessage.success(res.data.msg);
    // 刷新页面
    refreshInterval = setInterval(async () => {
    const res_service = await service_status(form.value.job_name);
    form.value.hosts = res_service.data.data;
  }, 1000); // 这里的 2000 表示刷新间隔，单位是毫秒
  } catch (error) {
      ElMessage({
          type: 'info',
          message: '取消成功',
      });
  }
}

const handlerlog = () => {
  console.log('click')
}

  </script>
  <style scoped>
  .el-button--text {
    margin-right: 15px;
  }
  .el-select {
    width: 300px;
  }
  .el-input {
    width: 300px;
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  .table {
	width: 100%;
	font-size: 14px;
}

  </style>