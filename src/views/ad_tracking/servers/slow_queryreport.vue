<template>
    <div>
      <el-dialog v-model="dialogTableVisible" title="巡检报告" >
          <el-table :data="slow_query_report.reporttree"  style="width: 100%"
              border 
              class="table"
              ref="multipleTable" 
              header-cell-class-name="table-header"
              row-key="date"
              highlight-current-row
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              fit
              :cell-style="cellStyle"
              >
          <el-table-column label="年/月" prop="date" />
          <el-table-column label=" 地址" prop="address" />
          <el-table-column label=" 状态" prop="status" />
          <!-- <el-table-column label=" 下载地址" prop="url" /> -->
          <el-table-column label="操作" width="200" align="center">
                  <template #default="scope">
                    <div v-if="scope.row.address">
                    <el-button text type="primary" icon="View" @click="handleView(scope.row)">浏览</el-button>
                    <el-button text type="primary" icon="View" @click="handleDownload(scope.row)"> 下载</el-button>
                    <el-button text type="danger" icon="Delete" @click="handleDelete(scope.row)"> 删除</el-button>
                    </div>
                    <div v-else></div>
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
    <el-dialog
        v-model="DialogVisible"
        title="报告详情"
        width="80%"
   
    >
    <div class="txt" style="white-space: pre-wrap;">{{ textContent }}</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="DialogVisible = false">Cancel</el-button>
       
      </div>
    </template>
    </el-dialog>
  </template>
  
  
  <script setup lang="ts" >
  import { ref } from 'vue';
  import {useslow_query_reportStore} from '@/store/check_report/slow_query_report'
  import {  download_slow_query_report, view_slow_query_report,  del_slow_query_report } from '@/http/check_report/mysql_check_report'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { downloadfile } from '@/utils/download'

  const DialogVisible = ref(false)
  const dialogTableVisible = ref(false)
  const slow_query_report = useslow_query_reportStore()
  const  reportForm = ref({
        id:0,
        name: '',
        ip: '',
        port:0,
        service_path:'',
        create_time:'',
    })
  const address = ref({
      address:''
  })
  const open_slow_query_report = async (row:any) => {
      await slow_query_report.getslowquery_reports({address: row.ip})
      dialogTableVisible.value = true
      reportForm.value = row
    }
      defineExpose({
          open_slow_query_report
      })
  
  
      const handleClose = () => {
  
      // 关闭对话框
      dialogTableVisible.value = false;
    }
  
  
    // 查看报告
const textContent = ref<any>("");
  const handleView = async (row: any) => {
      console.log('row',row)
      const res = await view_slow_query_report(row.id)
      textContent.value = res.data;
      DialogVisible.value = true

    }
  
//下载报告
const handleDownload = async (row: any) => {
    //console.log('row',row)
    const res = await download_slow_query_report(row.id)
    downloadfile(res.data, row.file_name);
}

//删除
const handleDelete = async (row:any) => {
  const Ids = row.id;
        ElMessageBox.confirm(
        '是否确认删除编号为"' + Ids + '?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            await del_slow_query_report(Ids);
            ElMessage.success('操作完成');
            await slow_query_report.getslowquery_reports({address: row.address})
}).catch(() => {});
}





    const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
    // 状态列字体颜色
    // columnIndex 列下标
    // rowIndex 行下标
    // row 行
    // column 列
   
    if (columnIndex === 1) {
        return {
        color: "#189EFF", 
        };
    }
    if (columnIndex === 2) {
    if(row.status == 'stopped'){
      return {
      color: "#F56C6C", 
      fontWeight: 'bold'
      };
      }else
      return {
      color: "#67C23A", 
      fontWeight: 'bold'
      };
  } 
}
  </script>
  
  <style scoped lang="less">


  </style>
  
  
  