<template>
	<div>
		<div class="container">
        <el-form :model="query" ref="queryRef" :inline="true" label-width="68px" status-icon v-show="showSearch">
         <el-form-item label="登录地址" >
            <el-input
               v-model="query.ip"
               placeholder="请输入登录地址"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch"
            />
         </el-form-item>
         <el-form-item label="用户名称" >
            <el-input
               v-model="query.username"
               placeholder="请输入用户名称"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch"
            />
            <el-form-item label="接口" >
            <el-input
               v-model="query.path"
               placeholder="请输入访问接口"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch"
            />
         </el-form-item>
         <el-form-item label="请求方法" >
            <el-select
               v-model="query.method"
               placeholder="请选择请求方法"
               clearable
               style="width: 150px"
            >
            <el-option key="1" label="GET" value="GET" ></el-option>
            <el-option key="2" label="POST" value="POST" ></el-option>
            <el-option key="3" label="PUT" value="PUT" ></el-option>
            <el-option key="43" label="DELETE" value="DELETE" ></el-option>
            </el-select>
         </el-form-item>
         </el-form-item>
         <el-form-item label="操作时间" style="width: 308px">
            <el-date-picker
                v-model="query.oper_time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
            <el-button icon="Refresh" @click="handleReset">重置</el-button>
         </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" @click="handleClean" >清空</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" >导出</el-button>
         </el-col>
         <el-col :span="2">
            <el-tooltip content="刷新" placement="top">
                <el-button :icon="Refresh" circle size="small"  @click="handleRefresh"/>
            </el-tooltip>     
        </el-col>
          </el-row>

        <el-table :data="operlog.operloginfo.data" @selection-change="handleSelectionChange" 
        border class="table"  header-cell-class-name="table-header"  :cell-style="cellStyle">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="日志编号" prop="id" width="90" align="center" />
            <el-table-column prop="username" label="用户名称" align="center"></el-table-column>
            <el-table-column prop="ip" label="登录地址" align="center"></el-table-column>
            <el-table-column label="操作类型" align="center" width="90" prop="businesstype"></el-table-column>
            <el-table-column prop="path" label="接口"  align="center"></el-table-column>
            <el-table-column prop="method" label="请求方法" align="center"></el-table-column>
            <el-table-column prop="code" label="状态码" align="center"></el-table-column>
            <el-table-column prop="oper_time" label="操作时间"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template #default="scope">
                    <el-button text type="primary" :icon="View" @click="handleView(scope.row)">详细
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
		</div>
        <div class="pagination">
                <el-pagination 
                v-model:current-page="query.pagenum" 
                :page-size="query.pagesize" 
                :page-sizes="[10, 20, 30, 40]"
                background layout="total, sizes, prev, pager, next, jumper" 
                :total=operlog.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
        <div>
            <el-dialog title="操作日志详细" v-model="DialogVisible" width="700px" append-to-body>
                 <el-form :model="operloginfo" label-width="100px">
                    <el-row>
                    <el-col :span="12">
                        <el-form-item label="请求地址：">{{ operloginfo.url }}</el-form-item>
                        <el-form-item label="请求方式：">{{ operloginfo.method }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求参数：">{{ operloginfo.request_data }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="返回参数：">{{ operloginfo.response }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作状态：">
                            <div v-if="operloginfo.code === 200">成功</div>
                            <div v-else-if="operloginfo.code === 201">创建</div>
                            <div v-else-if="operloginfo.code === 500">失败</div>
                            <div v-else-if="operloginfo.code === 204">删除</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作时间：">{{ operloginfo.oper_time }}</el-form-item>
                    </el-col>

                    </el-row>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                    <el-button @click="DialogVisible = false">关 闭</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang="ts" name="loginlog">
import { ref,onMounted } from 'vue';
import { useoperlogStore } from '@/store/system/operlog';
import { View } from '@element-plus/icons-vue';
import { getoperlog,deloperlog } from '@/http/api'
import { Refresh} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as XLSX from 'xlsx';

const operlog = useoperlogStore();

const query = ref<{username: string,ip: string,oper_time: string,pagenum: number,pagesize: number,path: string,method: string,code: number}>({
	username: '',
    ip:'',
    path:'',
    method:'',
    code: 0,
    oper_time:'',
    pagenum: 1,
    pagesize: 10
});


// 获取表格数据,点击菜单后才加载
onMounted(() => {
 operlog.getoperlog(query.value)
})

// 搜索
const handleSearch = () => {
    console.log(query.value)
    operlog.getoperlog(query.value)
};

// 重置
const handleReset = () => {
    query.value = {
        username: '',
        ip:'',
        oper_time:'',
        path:'',
        method:'',
        code: 0,
        pagenum: 1,
        pagesize: 10
    };
    operlog.getoperlog(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    operlog.getoperlog(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    operlog.getoperlog(query.value)
  };



// 详细按钮
// 打开窗口  
const DialogVisible = ref(false)

// row传入到详细按钮中
const operloginfo = ref<any>({})
const handleView = async (row: any) => {
    const res = await getoperlog(row.id)
    operloginfo.value = res.data
    console.log('oper',operloginfo.value)
    DialogVisible.value = true
  }

//删除多选模块
const multiple = ref(true);
const ids = ref([]);
/** 多选框选中数据 */
const handleSelectionChange = (selection:any) => {
    ids.value = selection.map((item: { id: number; }) => item.id);
    multiple.value = !selection.length;
    console.log(ids.value)
}
/** 删除按钮操作 */
const handleDelete = async (row: any) => {
  const operIds = ids.value;
  console.log(11,row.id,22,ids.value)
        ElMessageBox.confirm(
        '是否确认删除日志编号为"' + operIds + '"的数据项?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            for (const id of operIds) {
                // 在这里执行实际的删除操作
                const res = await deloperlog(id);
                ElMessage.success('操作完成');
             }
    operlog.getoperlog(query.value)
}).catch(() => {});
}

/** 清空按钮操作 */
const handleClean = async () => {
    ElMessageBox.confirm(
        '是否确认清空所有操作日志数据项?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            ElMessage.success('暂未开发');
            operlog.getoperlog(query.value)
}).catch(() => {});
}

//导出操作日志
const handleExport = async () => {
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(operlog.operloginfo.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        await operlog.getoperlog(query.value)
        operlog.operloginfo.data.map((item: any, i: number) => {
            const rowData = [
                i + 1,
                item.username,
                item.ip,
                item.path,
                item.code,
                item.url,
                item.method,
                item.oper_time,
                item.businesstype
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
        ['序号', '用户名', 'IP', '路径', '代码', 'URL', '方法', '操作时间', '业务类型'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '操作日志');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `操作日志.xlsx`);
};

//隐藏搜索
const showSearch = ref(true);
//刷新
const handleRefresh = () => {
    operlog.getoperlog(query.value)
}




const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
    // 状态列字体颜色
    // columnIndex 列下标
    // rowIndex 行下标
    // row 行
    // column 列
    if (columnIndex === 4 ) {
        if(row.businesstype == '删除'){
        return {
        color: "#F56C6C", 
        fontWeight: 'bold'
        };
        }else
        if (row.businesstype == '修改') return {
        color: "#67C23A", 
        fontWeight: 'bold'
        };
        else return {  
        color: "#189EFF", 
        fontWeight: 'bold'
        };
    }  
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