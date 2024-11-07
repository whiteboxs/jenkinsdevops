<template>
	<div>
		<div class="container">
        <el-form :model="query" :rules="rules" ref="queryFormRef" :inline="true" label-width="68px" >
          <el-form-item label="名称" >
            <el-input
               v-model="query.name"
               placeholder="请输入名称"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch(queryFormRef)"
               @blur="handleSearch(queryFormRef)"
            />
         </el-form-item>
         <el-form-item label="域名" prop="domain">
            <el-input
               v-model="query.domain"
               placeholder="请输入域名"
               clearable
               style="width: 360px;"
               @keyup.enter="handleSearch(queryFormRef)"
               @blur="handleSearch(queryFormRef)"
            />
         </el-form-item>
          <el-form-item label="IP地址" prop="address">
            <el-input
               v-model="query.address"
               placeholder="请输入IP地址"
               clearable
               filterable
               style="width: 200px;"
               @keyup.enter="handleSearch(queryFormRef)"
               @blur="handleSearch(queryFormRef)"
            />
          </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleSearch(queryFormRef)">搜索</el-button>
            <el-button icon="Refresh" @click="handleReset(queryFormRef)">重置</el-button>
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
        <el-table :data="redis.redisinfo.data" 
        border class="table"  header-cell-class-name="table-header"  
        :cell-style="cellStyle"
        ref="multipleTableRef"
        >
        <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="55"  align="center" sortable/>
            <el-table-column prop="instanceid" label="实例ID" width="170" align="center" ></el-table-column>
            <el-table-column prop="name" label="名称" align="center" ></el-table-column>
            <el-table-column prop="memory" label="内存" width="100" align="center" >
                <template #default="scope">
                   {{ scope.row.memory + 'MB'}}
                 </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" width="70" align="center" ></el-table-column>
            <el-table-column prop="domain" label="域名" width="250" align="center" >
                <template #default="scope">
                    <el-text v-for="item in scope.row.network"  
                    :type="item.type === 'Public' ? 'success' : ''"  >
                    {{ item.domain }},</el-text>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址"  align="center" >
                <template #default="scope">
                    <el-tag v-for="item in scope.row.network"
                    :type="item.type === 'Public' ? 'success' : ''" 
                    >{{ item.address }}:{{ item.port }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="100" align="center" >
                <template #default="scope">
                    <el-tag v-for="item in scope.row.network"
                    :type="item.type === 'Public' ? 'success' : ''"
                    >{{ item.type }}</el-tag>
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
                :total=redis.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
    </div>
</template>

<script setup lang="ts" name="redis_list">
import { ref,onMounted } from 'vue';
import { useredis_liststore } from '@/store/ad_tracking/redis_list';
import { Refresh} from '@element-plus/icons-vue';
import * as XLSX from 'xlsx';
import { ElTable } from 'element-plus'
import { ElMessage, ElMessageBox, ElButton, ElLoading } from 'element-plus'
import {all_redis as expall_redis } from '@/http/ad_tracking/nginx'
import type { FormInstance, FormRules } from 'element-plus'

const redis = useredis_liststore();
// 获取表格数据,点击菜单后才加载
onMounted(() => {
    redis.getall_redis(query.value)
})

const queryFormRef = ref<FormInstance>()
const query = ref({
    address:'',
    name:'',
    domain:'',
    pagenum: 1,
    pagesize: 10
});

const validdomain= (_: any, value: any, callback: any) => {
    if (!value) {  
        callback() 
    }  else {  
        // 域名正则表达式（这里假设是一个相对宽松的匹配，但要求至少一个点）  
        const domain = /^(?!\-)(?:[a-zA-Z\d\-]{1,63}\.){1,}(?:[a-zA-Z\d]{1,63})$/;  
        if (domain.test(value)) {  
            // 如果匹配IPv4或域名，则验证通过  
            callback();  
        } else {  
            // 如果不匹配IPv4或域名，则验证失败  
            callback(new Error('无效的域名'));  
        }  
    }  
}

const validaddress= (_: any, value: any, callback: any) => {
    if (!value) {  
        callback() 
    }  else {  
        // 简单的IPv4正则表达式  
        const ipv4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/; 
        if (ipv4.test(value)) {  
            // 如果匹配IPv4或域名，则验证通过  
            callback();  
        } else {  
            // 如果不匹配IPv4或域名，则验证失败  
            callback(new Error('无效的IP'));  
        }  
    }  
};


const rules = ref<FormRules<typeof query>>({
    domain: [{ validator: validdomain, trigger: 'blur' }],
    address: [{ validator: validaddress, trigger: 'blur' }]
})


// 搜索
const handleSearch = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
    if (valid) {
    console.log(query.value)
    query.value.pagenum = 1
    query.value.pagesize = 10
    await redis.getall_redis(query.value)
    ElMessage({
            message: redis.redisinfo.msg,
            type: 'success',
        })
    } else {
      return false
    }
  })
};

// 重置
const handleReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    query.value = {
    address:'',
    name:'',
    domain:'',
    pagenum: 1,
    pagesize: 10
    };
    redis.getall_redis(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    redis.getall_redis(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    redis.getall_redis(query.value)
  };



  const multipleTableRef = ref<InstanceType<typeof ElTable>>()
//批量导出
const assignExport = async () => {
// getSelectionRows  Element Plus table表格组件方法，获取当前选中的数据
  let selectedRows = multipleTableRef.value?.getSelectionRows()
  console.log('选中的数据',selectedRows)
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
   const headers =  ['序号','实例ID', '名称', '内存','版本', '域名', '地址', '端口', '类型', '创建时间'];
  const worksheetData = [  
  headers,  
  ...selectedRows.map((row: any) => {
    console.log('row',row)
    const addresses = row.network.map((network:{address:string}) => network.address).join(', ');
    const ports = row.network.map((network:{port:string}) => network.port).join(', ');
    const domains = row.network.map((network:{domain:string}) => network.domain).join(', ');
    const types = row.network.map((network:{type:string}) => network.type).join(', ');
    return [  
    row.id,
    row.instanceid,
    row.name,
    row.memory,
    row.version,
    domains,
    addresses,
    ports,
    types,
    row.create_time,
    ]
})  
]
  // 创建工作表  
  const WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData); 
  // 创建新的工作簿，并将工作表添加到其中  
  const new_workbook = XLSX.utils.book_new();  
  XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'REDIS服务列表');  

  // 将新的工作簿保存为 Excel 文件  
  XLSX.writeFile(new_workbook, `REDIS服务列表.xlsx`);  
  loading.close() // 关闭遮罩层
};

//导出所有日志
const Exportall = async () => {
    ElMessageBox.close() // 关闭弹出框
    const loading = ElLoading.service({ // 打开遮罩层
        lock: true,
        text: '请稍等...',
        background: 'rgba(255, 255, 255, 0.5)',
    })
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(redis.redisinfo.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        const res = await expall_redis(query.value)
        res.data.data.map((item: any) => {
            const addresses = item.network.map((network:{address:string}) => network.address).join(', ');
            const ports = item.network.map((network:{port:string}) => network.port).join(', ');
            const domains = item.network.map((network:{domain:string}) => network.domain).join(', ');
            const types = item.network.map((network:{type:string}) => network.type).join(', ');
            const rowData = [
                item.id,
                item.instanceid,
                item.name,
                item.memory,
                item.version,
                domains,
                addresses,
                ports,
                types,
                item.create_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
     ['序号','实例ID', '名称', '内存','版本', '域名', '地址', '端口', '类型', '创建时间'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'REDIS服务列表');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `REDIS服务列表.xlsx`);
    loading.close() // 关闭遮罩层
};


//刷新
const handleRefresh = () => {
    redis.getall_redis(query.value)
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