<template>
	<div>
		<div class="container">
        <el-form :model="query" ref="queryRef" :inline="true" label-width="68px" >
          <el-form-item label="服务名称" >
            <el-input
               v-model="query.name"
               placeholder="请输入服务名称"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch"
            />
         </el-form-item>
         <el-form-item label="WAF地址" >
            <el-input
               v-model="query.waf_ip"
               placeholder="请输入IP地址"
               clearable
               filterable
               style="width: 170px;"
               @keyup.enter="handleSearch"
            />
          </el-form-item>
        
          <el-form-item label="转发地址" >
            <el-input
               v-model="query.proxy_ip"
               placeholder="请输入IP地址"
               clearable
               filterable
               style="width: 170px;"
               @keyup.enter="handleSearch"
            />
          </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
            <el-button icon="Refresh" @click="handleReset">重置</el-button>
         </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-dropdown style="margin-right: 10px;">
                    <el-button type="success" icon="Download" plain>
                        导出<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                        <el-dropdown-item @click="Exportall">全部导出</el-dropdown-item>
                        <el-dropdown-item @click="assignExport">批量导出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-col>
         <el-col :span="2">
            <el-tooltip content="刷新" placement="top">
                <el-button :icon="Refresh" circle size="small"  @click="handleRefresh"/>
            </el-tooltip>     
        </el-col>
          </el-row>
        <el-table :data="waf.wafinfo.data" 
        border class="table"  header-cell-class-name="table-header"  :cell-style="cellStyle" ref="multipleTableRef">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" align="center" sortable/>
            <el-table-column prop="name" label=" 服务名称" align="center" ></el-table-column>
            <el-table-column prop="waf_ip" label="WAF地址" align="center" ></el-table-column>
            <el-table-column prop="waf_port" label="监听地址" align="center" ></el-table-column>
            <el-table-column prop="proxy_ip" label="转发地址" align="center" >
                <template #default="scope">
                    <el-tag>{{ scope.row.proxy_ip }}</el-tag>
                </template>
            </el-table-column>           
            <el-table-column prop="proxy_port" label="转发端口"  align="center" >
                <template #default="scope">
                    <el-tag>{{ scope.row.proxy_port }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="proxy_server_name" label="转发端口"  align="center" width="350">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.proxy_server_name" >{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间"  align="center"></el-table-column>
        </el-table>
		</div>
        <div class="pagination">
                <el-pagination 
                v-model:current-page="query.pagenum" 
                :page-size="query.pagesize" 
                :page-sizes="[10, 20, 30, 40]"
                background layout="total, sizes, prev, pager, next, jumper" 
                :total=waf.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
    </div>
</template>

<script setup lang="ts" name="waf_list">
import { ref,onMounted } from 'vue';
import { usewaf_liststore } from '@/store/ad_tracking/waf_list';
import { Refresh} from '@element-plus/icons-vue';
import * as XLSX from 'xlsx';
import { ElTable } from 'element-plus'
import { ElMessage, ElMessageBox, ElButton, ElLoading } from 'element-plus'
import { all_waf as expall_waf } from '@/http/ad_tracking/nginx'

const waf = usewaf_liststore();

const query = ref({
    proxy_ip:'',
    name:'',
    waf_ip:'',
    pagenum: 1,
    pagesize: 10
});


// 获取表格数据,点击菜单后才加载
onMounted(() => {
    waf.getall_waf(query.value)
})

// 搜索
const handleSearch = () => {
    console.log(query.value)
    query.value.pagenum = 1
    query.value.pagesize = 10
    waf.getall_waf(query.value)
};

// 重置
const handleReset = () => {
    query.value = {
    proxy_ip:'',
    name:'',
    waf_ip:'',
    pagenum: 1,
    pagesize: 10
    };
    waf.getall_waf(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    waf.getall_waf(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    waf.getall_waf(query.value)
  };


const multipleTableRef = ref<InstanceType<typeof ElTable>>()
//批量导出
const assignExport = async () => {
// getSelectionRows  Element Plus table表格组件方法，获取当前选中的数据
  let selectedRows = multipleTableRef.value?.getSelectionRows()
  if (!selectedRows.length) {
      return ElMessage({
      message: '请选择需要导出的数据',
      type: 'warning',
      })
  }
  ElMessageBox.close() // 关闭弹出框
  const loading = ElLoading.service({ // 打开遮罩层
      lock: true,
      text: '请稍等...',
      background: 'rgba(255, 255, 255, 0.5)',
  })

   // 创建工作表
  const headers =  ['序号', '服务名称', 'WAF地址', 'WAF端口', '代理地址', '代理端口', '代理服务器名称', '创建时间'];
  const worksheetData = [  
  headers,  
  ...selectedRows.map((row: any) => {
    const proxy_server_names = row.proxy_server_name.map((item:{item:string}) => item).join(', ');
    return [  
    row.id,
    row.name,
    row.waf_ip,
    row.waf_port,
    row.proxy_ip,
    row.proxy_port,
    proxy_server_names,
    row.create_time,
    ]
})  
]
  // 创建工作表  
  const WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData); 
  // 创建新的工作簿，并将工作表添加到其中  
  const new_workbook = XLSX.utils.book_new();  
  XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'WAF代理列表');  

  // 将新的工作簿保存为 Excel 文件  
  XLSX.writeFile(new_workbook, `WAF代理列表.xlsx`);  
  loading.close() // 关闭遮罩层
};



//导出全部
const Exportall = async () => {
  const loading = ElLoading.service({ // 打开遮罩层
      lock: true,
      text: '请稍等...',
      background: 'rgba(255, 255, 255, 0.5)',
  })
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(waf.wafinfo.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        const res = await expall_waf(query.value)
        res.data.data.map((item: any) => {
            const proxy_server_names = item.proxy_server_name.map((item:{item:string}) => item).join(', ');
            const rowData = [
                item.id,
                item.name,
                item.waf_ip,
                item.waf_port,
                item.proxy_ip,
                item.proxy_port,
                proxy_server_names,
                item.create_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
        ['序号', '服务名称', 'WAF地址', 'WAF端口', '代理地址', '代理端口', '代理服务器名称', '创建时间'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'WAF代理列表');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `WAF代理列表.xlsx`);
    loading.close() // 关闭遮罩层
};


//刷新
const handleRefresh = () => {
    waf.getall_waf(query.value)
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
}


</script>

<style scoped>
.table {
	width: 100%;
	font-size: 14px;
    margin-top: 20px;
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


</style>