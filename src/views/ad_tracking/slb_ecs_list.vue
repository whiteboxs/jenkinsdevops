<template>
	<div>
		<div class="container">
        <el-form :model="query"  :inline="true" label-width="90px" :rules="rules" ref="queryFormRef" class="demo-ruleForm" >
            <el-form-item label="域名/IP:80" prop="ad_port">
                <el-input
                v-model="query.ad_port"
                placeholder="请输入: 域名/IP:端口(默认端口80)"
                clearable
                style="width: 250px;"
                @keyup.enter="handleSearch(queryFormRef)"
                />
            </el-form-item>
            <el-form-item label="监听地址"  prop="address">
                <el-input
                v-model="query.address"
                placeholder="请输入域名或IP"
                clearable
                style="width: 200px;"
                @keyup.enter="handleSearch(queryFormRef)"
                />
            </el-form-item>
            <el-form-item label="名称" >
                <el-input
                v-model="query.name"
                placeholder="请输入访问名称"
                clearable
                style="width: 150px;"
                @keyup.enter="handleSearch(queryFormRef)"
                />
            </el-form-item>
            <el-form-item label="转发服务器地址"  prop="serverip" label-width="110px" >
                <el-input
                v-model="query.serverip"
                placeholder="请输入地址"
                clearable
                style="width: 150px;"
                @keyup.enter="handleSearch(queryFormRef)"
                />
            </el-form-item>
            <el-form-item label="资源类型" >
                <el-select
                v-model="query.type"
                placeholder="请选择资源类型"
                clearable
                style="width: 150px"
                >
                <el-option key="1" label="ecs" value="ecs" ></el-option>
                <el-option key="2" label="alb" value="alb" ></el-option>
                <el-option key="3" label="clb" value="clb" ></el-option>
                </el-select>
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
        <el-table :data="slb_ecs_summary.slb_ecsinfo.data" 
        border class="table"  header-cell-class-name="table-header"  :cell-style="cellStyle" width="auto"
        ref="multipleTableRef">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID"  width="50" align="center" sortable/>
            <el-table-column prop="name" label="名称"  align="center" />
            <el-table-column prop="instanceid" label="实例ID"  width="170" align="center" />
            <el-table-column prop="type" label="类型" align="center" width="80"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="90"></el-table-column>
            <el-table-column prop="listenprotocol" label="监听协议" align="center" width="90" ></el-table-column>
            <el-table-column prop="address" label="监听地址" align="center">
              <template #default="scope">
                    <el-tag v-for="item in scope.row.address">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="listenport" label="监听端口" width="90" align="center"></el-table-column>
            <el-table-column prop="server_ip" label="转发服务器" align="center">
              <template #default="scope">
                    <el-tag v-for="item in scope.row.servers">{{ item.serverip }}:{{ item.port }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="170" align="center"></el-table-column>
            <el-table-column label="操作" width="120" align="center">
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
                :total=slb_ecs_summary.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
            <el-dialog title="SLB/ECS详细" v-model="DialogVisible" width="700px" append-to-body>
                 <el-form :model="oneslb_ecsinfo" label-width="130px">
                    <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称: ">
                            <el-tag >{{ oneslb_ecsinfo.name }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="实例ID: ">{{ oneslb_ecsinfo.instanceid }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型：">{{ oneslb_ecsinfo.type }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态：">{{ oneslb_ecsinfo.status }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="协议：">{{ oneslb_ecsinfo.listenprotocol }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址：">
                            <el-tag v-for="item in oneslb_ecsinfo.address">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="监听端口：">
                            <el-tag > {{ oneslb_ecsinfo.listenport }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="转发组id：">{{ oneslb_ecsinfo.servergroupid }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转发服务器名称：">
                            <el-tag v-for="item in oneslb_ecsinfo.servers">{{ item.servername }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转发服务器id：">
                            <el-tag v-for="item in oneslb_ecsinfo.servers">{{ item.serverid }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="转发服务器地址：">
                            <el-tag v-for="item in oneslb_ecsinfo.servers">{{ item.serverip }}:{{ item.port }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="创建时间：">{{ oneslb_ecsinfo.create_time }}</el-form-item>
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
</template>

<script setup lang="ts" name="slb_ecs_list">
import { ref,onMounted } from 'vue';
import { useslb_ecs_summarystore } from '@/store/ad_tracking/slb_ecs_summary';
import { getslb_ecs,all_slb_ecs as expallslb_ecs } from '@/http/ad_tracking/nginx'
import { View } from '@element-plus/icons-vue';
import { Refresh} from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus'
import * as XLSX from 'xlsx';
import { ElTable } from 'element-plus'
import { ElMessage, ElMessageBox, ElButton, ElLoading } from 'element-plus'

const slb_ecs_summary = useslb_ecs_summarystore();

// 获取表格数据,点击菜单后才加载
onMounted(() => {
    slb_ecs_summary.getallslb_ecs(query.value)
})


const queryFormRef = ref<FormInstance>()
const query = ref({
    ad_port:'',
    name:'',
    type:'',
    address:'',
    serverip: '',
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

const validaddress= (_: any, value: any, callback: any) => {
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
};


const validserverip= (_: any, value: any, callback: any) => {
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
    address: [{ validator: validaddress, trigger: 'blur' }],
    serverip: [{ validator: validserverip, trigger: 'blur' }],
})

// 搜索
const handleSearch = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
    if (valid) {
        query.value.pagenum = 1
        query.value.pagesize = 10
        await slb_ecs_summary.getallslb_ecs(query.value)
        ElMessage({
            message: slb_ecs_summary.slb_ecsinfo.msg,
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
    ad_port:'',
    name:'',
    type:'',
    address:'',
    serverip: '',
    pagenum: 1,
    pagesize: 10
    };
    slb_ecs_summary.getallslb_ecs(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    slb_ecs_summary.getallslb_ecs(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    slb_ecs_summary.getallslb_ecs(query.value)
  };



// 详细按钮
// 打开窗口  
const DialogVisible = ref(false)

// row传入到详细按钮中
const oneslb_ecsinfo = ref<any>({})
const handleView = async (row: any) => {
    const res = await getslb_ecs(row.id)
    oneslb_ecsinfo.value = res.data
    DialogVisible.value = true
  }



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
   const headers =  ['序号', '名称', '实例id', '地址', '监听端口', '监听协议', '状态', '转发端口', '后端服务器组id', '类型', '后端服务名称', '后端服务id', '后端服务ip', '后端服务端口', '创建时间'];
  const worksheetData = [  
  headers,  
  ...selectedRows.map((row: any) => {
    const addresses = row.address.map((address:{address:string}) => address).join(', ');
    const servers_server_name = row.servers.map((item:{servername:string}) => item.servername).join(', ');
    const servers_server_id = row.servers.map((item:{serverid:string}) => item.serverid).join(', ');
    const servers_server_ip = row.servers.map((item:{serverip:string}) => item.serverip).join(', ');
    const servers_server_port = row.servers.map((item:{port:string}) => item.port).join(', ');
    return [  
    row.id,
    row.name,
    row.instanceid,
    addresses,
    row.listenport,
    row.listenprotocol,
    row.status,
    row.forwardport,
    row.servergroupid,
    row.type,
    servers_server_name,
    servers_server_id,
    servers_server_ip,
    servers_server_port,
    row.create_time,
    ]
})  
]
    // 创建工作表  
    const WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData); 
  // 创建新的工作簿，并将工作表添加到其中  
  const new_workbook = XLSX.utils.book_new();  
  XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'SLB_ECS信息列表');  

  // 将新的工作簿保存为 Excel 文件  
  XLSX.writeFile(new_workbook, `SLB_ECS信息列表.xlsx`);  
  loading.close() // 关闭遮罩层
};



//导出全部
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
    const totalPages = Math.ceil(slb_ecs_summary.slb_ecsinfo.count/30) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        query.value.pagesize = 30
        const res = await expallslb_ecs(query.value)
        res.data.data.map((item: any) => {
            const addresses = item.address.map((address:{address:string}) => address).join(', ');
            const servers_server_name = item.servers.map((item:{servername:string}) => item.servername).join(', ');
            const servers_server_id = item.servers.map((item:{serverid:string}) => item.serverid).join(', ');
            const servers_server_ip = item.servers.map((item:{serverip:string}) => item.serverip).join(', ');
            const servers_server_port = item.servers.map((item:{port:string}) => item.port).join(', ');
            const rowData = [
                item.id,
                item.name,
                item.instanceid,
                addresses,
                item.listenport,
                item.listenprotocol,
                item.status,
                item.forwardport,
                item.servergroupid,
                item.type,
                servers_server_name,
                servers_server_id,
                servers_server_ip,
                servers_server_port,
                item.create_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
    ['序号', '名称', '实例id', '地址', '监听端口', '监听协议', '状态', '转发端口', '后端服务器组id', '类型', '后端服务名称', '后端服务id', '后端服务ip', '后端服务端口', '创建时间'],
    ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'SLB_ECS信息列表');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `SLB_ECS信息列表.xlsx`);
    loading.close() // 关闭遮罩层
};


//刷新
const handleRefresh = () => {
    slb_ecs_summary.getallslb_ecs(query.value)
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
    if (columnIndex === 4) {
    if(row.state == 'STOPPED'){
      return {
      color: "#F56C6C", 
      fontWeight: 'bold'
      };
      }else
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