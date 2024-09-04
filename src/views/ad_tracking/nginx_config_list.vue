<template>
	<div>
		<div class="container">
        <el-form :model="query"  :inline="true" label-width="90px" :rules="rules" ref="queryFormRef" class="demo-ruleForm">
          <el-form-item label="域名/IP:80" prop="ad_port">
            <el-input
               v-model="query.ad_port"
               placeholder="请输入: 域名/IP:端口(默认端口80)"
               clearable
               style="width: 300px;"
               @keyup.enter="handleSearch"
            />
         </el-form-item>
         <el-form-item label="监听地址"  prop="server_name">
                <el-input
                v-model="query.server_name"
                placeholder="请输入域名或IP"
                clearable
                style="width: 250px;"
                @keyup.enter="handleSearch"
                />
            </el-form-item>
         <el-form-item label="NG服务器地址" prop="ip" label-width="110px">
            <el-input
               v-model="query.ip"
               placeholder="请输入NG服务器地址"
               clearable
               filterable
               style="width: 200px;"
               @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="文件名称" >
            <el-input
               v-model="query.file"
               placeholder="请输入文件名称"
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
        <el-table :data="nginx_config.nginx_configinfo" 
        border class="table"  header-cell-class-name="table-header"  
        :cell-style="cellStyle"
        ref="multipleTableRef"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID"  width="50" align="center" sortable/>
            <el-table-column prop="ip" label="服务器地址"  width="120" align="center" />
            <el-table-column prop="hostname" label="服务器名称" align="center" width="140"></el-table-column>
            <el-table-column prop="file" label="配置文件" width="140" align="center"></el-table-column>
            <el-table-column prop="filepath" label="路径" align="center" width="140" ></el-table-column>
            <el-table-column prop="server_name" label="监听地址"  align="center">
              <template #default="scope">
                    <el-tag v-for="item in scope.row.server_name">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="listen" label="监听端口"  align="center" width="60"></el-table-column>
            <el-table-column prop="root" label="前端路径" width="140" align="center">
              <template #default="scope">
                    <div v-if="scope.row.server_set">{{ scope.row.server_set }}</div>
                    <div v-else="scope.row.server_root">{{ scope.row.server_root }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="proxy_domain_ip" label="代理域名/IP" align="center">
              <template #default="scope">
                    <el-tag v-for="item in scope.row.proxy_ad_port">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="110" align="center">
                <template #default="scope">
                    <el-button text type="primary" :icon="View" @click="handleView(scope.row)">详细</el-button>
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
                :total=nginx_config.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
        <div>
            <el-dialog title="NG详细日志" v-model="DialogVisible" width="700px" append-to-body>
                 <el-form :model="one_nginx_configinfo" label-width="100px" >
                    <el-row>
                    <el-col :span="12">
                        <el-form-item label="服务器地址：">{{ one_nginx_configinfo.ip }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服务器名称：">{{ one_nginx_configinfo.hostname }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="配置文件：">{{ one_nginx_configinfo.file }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="路径：">{{ one_nginx_configinfo.filepath }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="server_name：">
                            <el-tag v-for="item in one_nginx_configinfo.server_name">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="listen：">
                            <el-tag > {{ one_nginx_configinfo.listen }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="server_root：">{{ one_nginx_configinfo.server_root }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="server_set：">{{ one_nginx_configinfo.server_set }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="upstream：">
                            <el-tag v-for="item in one_nginx_configinfo.upstream">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="locations：">
                            <el-tag v-for="item in one_nginx_configinfo.locations">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="所有代理信息：">
                            <el-tag v-for="item in  one_nginx_configinfo.proxy_ad_port">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="access_log：">{{ one_nginx_configinfo.access_log }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="error_log：">{{ one_nginx_configinfo.error_log }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="创建时间：">{{ one_nginx_configinfo.create_time }}</el-form-item>
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
import { usenginx_configstore } from '@/store/ad_tracking/nginx_config_list';
import {getnginx_config,all_nginx_config as expallnginx_config} from '@/http/ad_tracking/nginx'
import { View } from '@element-plus/icons-vue';
import { Refresh} from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus'
import * as XLSX from 'xlsx';
import { ElMessage, ElMessageBox, ElButton, ElLoading } from 'element-plus'
import { ElTable } from 'element-plus'


const nginx_config = usenginx_configstore();

// 获取表格数据,点击菜单后才加载
onMounted(() => {
 nginx_config.getnginx_config(query.value)
})


const queryFormRef = ref<FormInstance>()
const query = ref({
    ip:'',
    ad_port:'',
    server_name:'',
    file:'',
    pagenum: 1,
    pagesize: 10
});

const validad_port= (_: any, value: any, callback: any) => {
    if (!value) {  
        callback() 
    }  else {  
        // 简单的IPv4正则表达式  
        const ipv4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;  
        // 域名正则表达式（这里假设是一个相对宽松的匹配，但要求至少一个点）  
        const domain = /^(?!\-)(?:[a-zA-Z\d\-]{1,63}\.){1,}(?:[a-zA-Z\d]{1,63})$/;  
        const ipv4WithPort = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\:\d{1,5})?$/;  
        const domainWithPort = /^(?!\-)(?:[a-zA-Z\d\-]{1,63}\.){1,}(?:[a-zA-Z\d]{1,63})(\:\d{1,5})?$/;  
        if (ipv4.test(value) || domain.test(value) || ipv4WithPort.test(value) || domainWithPort.test(value)) {  
            // 如果匹配IPv4或域名，则验证通过  
            callback();  
        } else {  
            // 如果不匹配IPv4或域名，则验证失败  
            callback(new Error('无效的IP地址或者域名'));  
        }  
    }  
}

const validserver_name= (_: any, value: any, callback: any) => {
    if (!value) {  
        callback() 
    }  else {  
        // 简单的IPv4正则表达式  
        const ipv4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;  
        // 域名正则表达式（这里假设是一个相对宽松的匹配，但要求至少一个点）  
        const domain = /^(?!\-)(?:[a-zA-Z\d\-]{1,63}\.){1,}(?:[a-zA-Z\d]{1,63})$/;  
        if (ipv4.test(value) || domain.test(value)) {  
            // 如果匹配IPv4或域名，则验证通过  
            callback();  
        } else {  
            // 如果不匹配IPv4或域名，则验证失败  
            callback(new Error('无效的IP地址或者域名'));  
        }  
    }  
}

const validip= (_: any, value: any, callback: any) => {
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
}

const rules = ref<FormRules<typeof query>>({
    ad_port: [{ validator: validad_port, trigger: 'blur' }],
    server_name: [{ validator: validserver_name, trigger: 'blur' }],
    ip: [{ validator: validip, trigger: 'blur' }],
})


// 搜索
const handleSearch = () => {
    console.log(query.value)
    query.value.pagenum = 1
    query.value.pagesize = 10
    nginx_config.getnginx_config(query.value)
};

// 重置
const handleReset = () => {
    query.value = {
    ip:'',
    ad_port:'',
    file:'',
    server_name:'',
    pagenum: 1,
    pagesize: 10
    };
    nginx_config.getnginx_config(query.value)
};


//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    nginx_config.getnginx_config(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    nginx_config.getnginx_config(query.value)
  };



// 详细按钮
// 打开窗口  
const DialogVisible = ref(false)

// row传入到详细按钮中
const one_nginx_configinfo = ref<any>({})
const handleView = async (row: any) => {
    const res = await getnginx_config(row.id)
    one_nginx_configinfo.value = res.data
    console.log('onenginx',one_nginx_configinfo.value)
    DialogVisible.value = true
  }




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
   const headers =  ['序号', '文件名', '路径', 'IP', '主机名称', '监听端口', '域名/IP', 'upstream_name', 'upstream_block', 'set', 'server_root', 'location_path', 'location_proxy_pass', 'location_root', 'proxy_ad_port', 'access.log', 'error.log', '创建时间']
  const worksheetData = [  
  headers,  
  ...selectedRows.map((row: any) => {
    const locations_path = row.locations.map((item:{path: string}) => item.path).join(', ');
    const locations_proxy_pass = row.locations.map((item:{proxy_pass: string}) => item.proxy_pass).join(', ');
    const locations_root = row.locations.map((item:{root: string}) => item.root).join(', ');
    const upstream_name = row.upstream.map((item:{name: string}) => item.name).join(', ');
    const upstream_block = row.upstream.map((item:{block: string}) => item.block).join(', ');
    return [  
        row.id,
        row.file,
        row.filepath,
        row.ip,
        row.hostname,
        row.listen,
        row.server_name,
        upstream_name,
        upstream_block,
        row.server_set,
        row.server_root,
        locations_path,
        locations_proxy_pass,
        locations_root,
        row.proxy_ad_port,
        row.access_log,
        row.error_log,
        row.create_time,
    ]
})  
]; 
    // 创建工作表  
  const WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData); 
  // 创建新的工作簿，并将工作表添加到其中  
  const new_workbook = XLSX.utils.book_new();  
  XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'NG配置列表');  

  // 将新的工作簿保存为 Excel 文件  
  XLSX.writeFile(new_workbook, `NG配置列表.xlsx`);  
  loading.close() // 关闭遮罩层
};


//导出所有ng配置
const Exportall = async () => {
    const loading = ElLoading.service({ // 打开遮罩层
        lock: true,
        text: '请稍等...',
        background: 'rgba(255, 255, 255, 0.5)',
    })

    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(nginx_config.count/30) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        query.value.pagesize = 30
        const res = await expallnginx_config(query.value)
        res.data.data.map((item: any) => {
            const locations_path = item.locations.map((item:{path: string}) => item.path).join(', ');
            const locations_proxy_pass = item.locations.map((item:{proxy_pass: string}) => item.proxy_pass).join(', ');
            const locations_root = item.locations.map((item:{root: string}) => item.root).join(', ');
            const upstream_name = item.upstream.map((item:{name: string}) => item.name).join(', ');
            const upstream_block = item.upstream.map((item:{block: string}) => item.block).join(', ');
            const rowData = [
                item.id,
                item.file,
                item.filepath,
                item.ip,
                item.hostname,
                item.listen,
                item.server_name,
                upstream_name,
                upstream_block,
                item.server_set,
                item.server_root,
                locations_path,
                locations_proxy_pass,
                locations_root,
                item.proxy_ad_port,
                item.access_log,
                item.error_log,
                item.create_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
     ['序号', '文件名', '路径', 'IP', '主机名称', '监听端口', '域名/IP', 'upstream_name', 'upstream_block', 'set', 'server_root', 'location_path', 'location_proxy_pass', 'location_root', 'proxy_ad_port', 'access.log', 'error.log', '创建时间'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'NG配置列表');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `NG配置列表.xlsx`);
    loading.close() // 关闭遮罩层
};

//隐藏搜索
const showSearch = ref(true);
//刷新
const handleRefresh = () => {
  nginx_config.getnginx_config(query.value)
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