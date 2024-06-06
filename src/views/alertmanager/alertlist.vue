<template>
	<div>
		<div class="container">
            <el-form :model="query" ref="queryRef" :inline="true" label-width="auto" status-icon v-show="showSearch">
            <el-form-item label="告警状态" >
                <el-select
              @keyup.enter="handleSearch"
               v-model="query.status"
               placeholder="请选择告警状态"
               clearable
               style="width: 150px"
                >
                <el-option key="1" label="firing" value="firing" ></el-option>
                <el-option key="2" label="resolved" value="resolved" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="告警级别" >
              <el-select
              @keyup.enter="handleSearch"
               v-model="query.serverity"
               placeholder="请选择告警级别"
               clearable
               style="width: 150px"
                >
                <el-option key="1" label="critical" value="critical" ></el-option>
                <el-option key="2" label="warning" value="warning" ></el-option>
                </el-select>
             </el-form-item>
            <el-form-item label="告警地址" >
                <el-input
                v-model="query.instance"
                placeholder="请输入告警地址"
                clearable
                style="width: 150px;"
                @keyup.enter="handleSearch"
                />
            </el-form-item>
            <el-form-item label="告警组" >
            <el-input
               v-model="query.group"
               placeholder="请输入告警组"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch"
                />
             </el-form-item>
             <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker
                v-model="query.create_time"
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
            <el-button type="success" plain icon="Download" @click="handleExport" >导出</el-button>
         </el-col>
         <el-col :span="2">
            <el-tooltip content="刷新" placement="top">
                <el-button :icon="Refresh" circle size="small"  @click="handleRefresh"/>
            </el-tooltip>     
        </el-col>
          </el-row>

        <el-table :data="allalert.alertlist" 
        @selection-change="handleSelectionChange" 
        border class="table"  
        header-cell-class-name="table-header"  
        :cell-style="cellStyle">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="80" align="center" />
            <el-table-column prop="status" label="告警状态" width="90" align="center"></el-table-column>
            <el-table-column prop="serverity" label="告警级别" width="90" align="center"  ></el-table-column>
            <el-table-column prop="alertname" label="告警类型"  align="center"></el-table-column>
            <el-table-column prop="group" label="告警分组" width="120" align="center"></el-table-column>
            <el-table-column prop="instance" label="告警主机" width="140" align="center"></el-table-column>
            <el-table-column prop="summary" label="告警主题" width="200" align="center"></el-table-column>
            <el-table-column prop="description" label="告警详情" width="200" align="center"></el-table-column>
            <el-table-column prop="webhooks" label="告警群组" width="120" align="center">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.webhooks">{{ item.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="startsAt" label="故障时间" width="120" align="center"></el-table-column>
            <el-table-column prop="endsAt" label="恢复时间" width="120" align="center"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="120" align="center" ></el-table-column>
        </el-table>
		</div>
        <div class="pagination">
                <el-pagination 
                v-model:current-page="query.pagenum" 
                :page-size="query.pagesize" 
                :page-sizes="[10, 20, 30, 40]"
                background layout="total, sizes, prev, pager, next, jumper" 
                :total=allalert.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
		</div>
    </div>
</template>

<script setup lang="ts" name="alertlist">
import { ref,onMounted } from 'vue';
import { useallalertstore } from '@/store/alert/alertlist';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as XLSX from 'xlsx';
import {delalert} from '@/http/alert/api'

const allalert = useallalertstore();

// 获取表格数据,点击菜单后才加载
onMounted(() => {
    allalert.getalertlist(query.value)
   
})

const query = ref<any>({
	status: '',
    instance:'',
    serverity:'',
    group:'',
    create_time:'',
    pagenum: 1,
    pagesize: 10
});




// 搜索
const handleSearch = () => {
    console.log(query.value)
    allalert.getalertlist(query.value)
};

// 重置
const handleReset = () => {
    query.value = {
    status: '',
    group:'',
    instance:'',
    serverity:'',
    create_time:'',
    pagenum: 1,
    pagesize: 10
    };
    allalert.getalertlist(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    allalert.getalertlist(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    allalert.getalertlist(query.value)
  };


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
                const res = await delalert(id);
                ElMessage.success('操作完成');
             }
    allalert.getalertlist(query.value)
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
            allalert.getalertlist(query.value)
}).catch(() => {});
}

//导出操作日志
const handleExport = async () => {
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(allalert.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        await allalert.getalertlist(query.value)
        allalert.alertlist.map((item: any, i: number) => {
            const rowData = [
                i + 1,
                item.status,
                item.serverity,
                item.alertname,
                item.instance,
                item.group,
                item.summary,
                item.description,
                item.startsAt,
                item.endsAt,
                item.create_time,
                item.webhooks
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
        ['序号', '告警状态', '告警级别', '告警类型', '故障主机', '告警组', '告警主题', '告警详情', '故障时间', '恢复时间', '创建时间','告警群组'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '告警数据列表');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `告警数据列表.xlsx`);
};

//隐藏搜索
const showSearch = ref(true);
//刷新
const handleRefresh = () => {
     allalert.getalertlist(query.value)
}




const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
    // 状态列字体颜色
    // columnIndex 列下标
    // rowIndex 行下标
    // row 行
    // column 列
    if (columnIndex === 2 ) {
        if(row.status == 'firing'){
            return {
            color: "#F56C6C", 
            fontWeight: 'bold'
            };
            }else
            return {
            color: "#1CD66C", 
            fontWeight: 'bold'
            };
        }
    if (columnIndex === 3 ) {
        if(row.serverity == 'critical'){
            return {
            color: "#F56C6C", 
            fontWeight: 'bold'
            };
            }else
            return {
            color: "#E6A23C", 
            fontWeight: 'bold'
            };
        }
        if (columnIndex === 1) {
            return {
            color: "#189EFF", 
            };
        }
        if (columnIndex === 8) {
            return {
            color: "#189EFF", 
            fontWeight: 'bold'
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