<template>
  <div>
    <el-dialog v-model="dialogTableVisible" title="巡检报告" >
        <el-table :data="check_report.reporttree"  style="width: 100%"
            border 
            class="table"
            ref="multipleTable" 
            header-cell-class-name="table-header"
            row-key="date"
            highlight-current-row
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            fit>
        <el-table-column label="年/月" prop="date" />
        <el-table-column label=" 标题" prop="title" />
        <el-table-column label=" 名称" prop="name" />
        <el-table-column label=" 地址" prop="address" />
        <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                  <div v-if="scope.row.address">
                  <el-button text type="primary" icon="View" @click="handleView(scope.row)">浏览</el-button>
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
  <div >
      <el-dialog title="报告详情" v-model="DialogVisible" width=80% >
        <div class="centered-button" >
        <el-button  type="success" icon="Download" @click="handleExport('数据库巡检报告')" align="center"> 导出为PDF</el-button>
        </div>
        <div id="printData">
            <el-form  class="centered-form-container" :model="one_mysql_check_reportinfo" style="width: 100%"  label-position="top" fit>
            <el-row>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="标题：">
                    <el-tag size="large"> {{ one_mysql_check_reportinfo.title }}</el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="巡检时间：">
                    <el-tag > {{ one_mysql_check_reportinfo.create_time }}</el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="主机名称：">
                    <el-tag > {{ one_mysql_check_reportinfo.name }}</el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="地址：">
                    <el-tag > {{ one_mysql_check_reportinfo.address }}</el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="工作模式：">
                    <el-tag > {{ one_mysql_check_reportinfo.db_mode }}</el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="版本：">{{ one_mysql_check_reportinfo.version }}</el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="read_only：">{{ one_mysql_check_reportinfo.read_only }}</el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="super_read_only：">{{ one_mysql_check_reportinfo.super_read_only}} 
                  </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="最大连接数：">
                    <el-tag > {{ one_mysql_check_reportinfo.max_connections }}</el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="使用连接数：">
                    <el-tag type="success" > {{ one_mysql_check_reportinfo.max_used_connections }}</el-tag>
                  </el-form-item>
              </el-col>
              <el-col :span="24" class="grid-content ep-bg-purple-dark" >
                  <el-form-item label="同步状态：" >
                    <el-table class="table" :data="one_mysql_check_reportinfo.sync_status"  style="width: 100%">
                      <el-table-column label="同步状态" prop="sync_status" />
                      <el-table-column label="master_host" prop="master_host" />
                      <el-table-column label="master_port" prop="master_port" />
                      <el-table-column label="slave_sql_running" prop="slave_sql_running" />
                      <el-table-column label="slave_io_running" prop="slave_io_running" />
                      <el-table-column label="replicate_do_db" prop="replicate_do_db" />
                      <el-table-column label="replicate_ignore_db" prop="replicate_ignore_db" />
                      <el-table-column label="replicate_do_table" prop="replicate_do_table" />
                      <el-table-column label="replicate_ignore_table" prop="replicate_ignore_table" />
                      <el-table-column label="state" prop="state" />
                    </el-table>

                  </el-form-item>
              </el-col>
              <el-col :span="24" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="数据库信息：">
                    <el-table class="table" :data="one_mysql_check_reportinfo.db_info"  style="width: 100%">
                      <el-table-column label="库名称" prop="database" />
                      <el-table-column label="数据大小" prop="data_size" />
                      <el-table-column label="索引大小" prop="index_size" />
                      <el-table-column label="表数量" prop="table_count" />
                    </el-table>
                  </el-form-item>
              </el-col>
              <el-col :span="24" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="数据碎片：">
                    <el-table class="table" :data="one_mysql_check_reportinfo.data_splinter"  style="width: 100%">
                      <el-table-column label="库名称" prop="db_name" />
                      <el-table-column label="表名称" prop="table_name" />
                      <el-table-column label="碎片大小" prop="splinter" />
                    </el-table>
                  </el-form-item>
              </el-col>
              <el-col :span="24" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="超10G的表：">
                    <el-table class="table" :data="one_mysql_check_reportinfo.exceed_10GB_size"  style="width: 100%">
                      <el-table-column label="库名称" prop="db_name" />
                      <el-table-column label="表名称" prop="table_name" />
                      <el-table-column label="数据大小" prop="data_size" />
                      <el-table-column label="索引大小" prop="index_size" />
                      <el-table-column label="总量" prop="total" />
                    </el-table>
                  </el-form-item>
              </el-col>
              <el-col :span="24" class="grid-content ep-bg-purple-dark" > 
                  <el-form-item label="超5千万行的表：">
                    <el-table class="table" :data="one_mysql_check_reportinfo.exceed_table_rows"  style="width: 100%">
                      <el-table-column label="库名称" prop="db_name" />
                      <el-table-column label="表名称" prop="table_name" />
                      <el-table-column label="表行数" prop="table_rows" />
                    </el-table>
                  </el-form-item>
              </el-col>
              <el-col :span="24" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="冗余索引(建议优化)：" >
                    <el-table class="table" :data="one_mysql_check_reportinfo.redundant_indexes"  label-position="top" width="auto">
                      <el-table-column label="库名称" prop="db_name" />
                      <el-table-column label="表名称" prop="table_name" />
                      <el-table-column label="dominant_index_columns" prop="dominant_index_columns" />
                      <el-table-column label="dominant_index_name" prop="dominant_index_name" />
                      <el-table-column label="dominant_index_non_unique" prop="dominant_index_non_unique" />
                      <el-table-column label="redundant_index_columns" prop="redundant_index_columns" />
                      <el-table-column label="redundant_index_name" prop="redundant_index_name" />
                      <el-table-column label="redundant_index_non_unique" prop="redundant_index_non_unique" />
                      <el-table-column label="sql_drop_index" prop="sql_drop_index" />
                      <el-table-column label="subpart_exists" prop="subpart_exists" />
                    </el-table>
                  </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark" >
                  <el-form-item label="慢查询开关：">
                    <el-tag > {{ one_mysql_check_reportinfo.slow_query_info[0].slow_query_log }}</el-tag>
                    </el-form-item>
              </el-col>
              <el-col :span="12" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="慢查询日志路径：">{{ one_mysql_check_reportinfo.slow_query_info[0].slow_query_log_file }}</el-form-item>
              </el-col>
              <el-col :span="24" class="grid-content ep-bg-purple-dark">
                  <el-form-item label="错误日志路径：">{{ one_mysql_check_reportinfo.error_log_path }}</el-form-item>
              </el-col>
              </el-row>
          </el-form>
        </div>
          <template #footer>
              <div class="dialog-footer">
              <el-button @click="DialogVisible = false">关 闭</el-button>
              </div>
          </template>
      </el-dialog>
  </div>
</template>


<script setup lang="ts" >
import { ref } from 'vue';
import {usemysql_check_reportStore} from '@/store/check_report/mysql_check_report'
import { getmysql_check_report, del_check_report } from '@/http/check_report/mysql_check_report'
import  {htmlToPdf}  from '@/utils/htmlToPDF'
import { ElMessage, ElMessageBox } from 'element-plus';

const DialogVisible = ref(false)
const dialogTableVisible = ref(false)
const check_report = usemysql_check_reportStore()
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
const open_check_report = async (row:any) => {
    console.log('打开节点ip',row.ip)
    await check_report.getmysqlcheck_reports({address: row.ip})
    dialogTableVisible.value = true
    reportForm.value = row
    console.log('格式化后的数据', check_report.reporttree)
  }
    defineExpose({
        open_check_report
    })


    const handleClose = () => {

    // 关闭对话框
    dialogTableVisible.value = false;
  }


  // row传入到详细按钮中  预览
const one_mysql_check_reportinfo = ref<any>({})
const handleView = async (row: any) => {
    console.log('row',row)
    const res = await getmysql_check_report(row.id)
    one_mysql_check_reportinfo.value = res.data.data
    console.log('onecheck_report',one_mysql_check_reportinfo.value)
    DialogVisible.value = true
  }

//下载
const handleExport = async (text:string) => {
  htmlToPdf(text, "#printData");

  // var fileName= text
  // const fileList = document.getElementsByClassName('printData')   // 很重要
  // htmlpdf(fileName, document.querySelector('#printData'), fileList)
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
            await del_check_report(Ids);
            ElMessage.success('操作完成');
            await check_report.getmysqlcheck_reports({address: row.address})
}).catch(() => {});
}
</script>

<style scoped lang="less">
.centered-button {  
  display: flex;  
  justify-content: left; /* 水平居中 */  
  //align-items: center;    /* 垂直居中 */  
  height: 10vh;          /* 如果希望按钮在视口高度中居中，可以设置为100vh */  
  /* 或者你可以设置一个具体的高度，比如200px */  
  /* height: 200px; */  
}

.centered-form-container {  
  display: flex;  
  justify-content: center; /* 水平居中 */  
  overflow: auto;         /* 如果内容超出视口，允许滚动 */  
  padding: 20px;          /* 根据需要添加内边距 */  
  box-sizing: border-box; /* 确保内边距不影响宽度 */  
}  

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

</style>


