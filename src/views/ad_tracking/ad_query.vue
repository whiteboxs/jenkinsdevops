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
                @keyup.enter="handleSearch(queryFormRef)"  
                />
            </el-form-item>
            <el-form-item label="监听地址"  prop="address">
                <el-input
                v-model="query.address"
                placeholder="请输入域名或IP"
                clearable
                style="width: 250px;"
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
            <el-form-item label="转发服务器地址"  prop="serverip" label-width="110px">
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
            <el-button type="success" plain icon="Download" @click="handleExport" >导出</el-button>
         </el-col>
         <el-col :span="2">
            <el-tooltip content="刷新" placement="top">
                <el-button :icon="Refresh" circle size="small"  @click="handleRefresh"/>
            </el-tooltip>     
        </el-col>
          </el-row>
        <el-table :data="ad_tracking.ad_trackinginfo.data" 
        border class="table"  header-cell-class-name="table-header"  :cell-style="cellStyle" width="auto">
            <el-table-column prop="id" label="ID"  width="50" align="center" sortable/>
            <el-table-column prop="name" label="名称"  align="center" width="140"/>
            <el-table-column prop="type" label="类型" align="center" width="70"></el-table-column>
            <el-table-column prop="address" label="监听地址" align="center">
              <template #default="scope">
                    <el-tag v-for="item in scope.row.address">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="listenport" label="监听端口" width="90" align="center"></el-table-column>
            <el-table-column prop="server_ip" label="转发服务器" width="160" align="center">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.servers">{{ item.serverip }}:{{ item.port }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="backend_type" label="后端服务类型" width="110" align="center">
              <template #default="scope">
                    <el-tag v-for="item in getUniqueBackendTypes(scope.row.servers)">{{ item }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="backend_server_name" label="后端服务名称/域名/IP" align="center">
              <template #default="scope">
                    <el-tag v-for="item in getUniqueBackendServerNames(scope.row.servers)">{{ item }}</el-tag>
                </template>
            </el-table-column> 
        <el-table-column prop="backend_server_address" label="后端代理地址" align="center">
              <template #default="scope">
                <el-tag v-for="item in getUniqueBackendServer_address(scope.row.servers)">{{ item }}</el-tag>
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
                :total=ad_tracking.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
            <el-dialog title="服务链路详情" v-model="DialogVisible" width="700px" append-to-body>
                 <el-form :model="onead_trackinginfo" label-width="130px">
                    <el-row>
                    <el-col :span="12">
                        <!-- <el-form-item label="名称: ">{{ onead_trackinginfo.name }}</el-form-item> -->
                        <el-form-item label="名称: ">
                            <el-tag >{{ onead_trackinginfo.name }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="实例ID: ">{{ onead_trackinginfo.instanceid }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型：">{{ onead_trackinginfo.type }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="协议：">{{ onead_trackinginfo.listenprotocol }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态：">{{ onead_trackinginfo.status }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="地址：">
                            <el-tag v-for="item in onead_trackinginfo.address">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="监听端口：">{{ onead_trackinginfo.listenport }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转发组id：">{{ onead_trackinginfo.servergroupid }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转发服务器名称：">
                            <el-tag v-for="item in onead_trackinginfo.servers">{{ item.servername }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转发服务器id：">
                            <el-tag v-for="item in onead_trackinginfo.servers">{{ item.serverid }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="转发服务器地址：">
                            <el-tag v-for="item in onead_trackinginfo.servers">{{ item.serverip }}:{{ item.port }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="后端服务器类型：">
                            <el-tag v-for="item in getUniqueBackendTypes(onead_trackinginfo.servers)">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="后端服务器端口：">
                            <el-tag v-for="item in getUniqueBackendPorts(onead_trackinginfo.servers)">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="后端服务名称：">
                            <el-tag v-for="item in getUniqueBackendServerNames(onead_trackinginfo.servers)">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                   
                    <el-col :span="24">
                        <el-form-item label="后端代理地址：">
                            <el-tag v-for="item in getUniqueBackendServer_address(onead_trackinginfo.servers)">{{ item }}</el-tag>
                        </el-form-item>
                    </el-col>
                   
                    <el-col :span="24">
                        <el-form-item label="后端所有代理信息：" >
                            <span v-for="item in getUniqueBackendproxy_adports(onead_trackinginfo.servers)">{{ item}},</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="创建时间：">{{ onead_trackinginfo.create_time }}</el-form-item>
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

<script setup lang="ts" name="ad_tracking">
import { ref,onMounted } from 'vue';
import { usead_trackingstore } from '@/store/ad_tracking/ad_tracking';
import { getad_tracking } from '@/http/ad_tracking/nginx'
import { View } from '@element-plus/icons-vue';
import { Refresh} from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus'
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus'


const ad_tracking = usead_trackingstore();

// 获取表格数据,点击菜单后才加载
onMounted(() => {
    ad_tracking.getall_ad_tracking(query.value)
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
const handleSearch =  (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
    if (valid) {
        query.value.pagenum = 1
        query.value.pagesize = 10
        await ad_tracking.getall_ad_tracking(query.value)
        ElMessage({
            message: ad_tracking.ad_trackinginfo.msg,
            type: 'success',
        })
    } else {
      return false
    }
  })
}


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
    ad_tracking.getall_ad_tracking(query.value)
};



// 遍历用户列表，为每个用户添加额外的详情信息  

// const getbackendinfo = async (row) => {
//     const res = await getnginx_config(item.ip);
// }
// const backendinfo = ad_tracking.ad_trackinginfo.map(async item => {  
   
//   return { ...user, age: userDetail.age };  
// }); 



//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    ad_tracking.getall_ad_tracking(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    ad_tracking.getall_ad_tracking(query.value)
  };



// 详细按钮
// 打开窗口  
const DialogVisible = ref(false)

// row传入到详细按钮中
const onead_trackinginfo = ref<any>({})
const handleView = async (row: any) => {
    const res = await getad_tracking(row.id,query.value)
    onead_trackinginfo.value = res.data
    DialogVisible.value = true
  }



//导出操作日志
const handleExport = async () => {
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(ad_tracking.ad_trackinginfo.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        await ad_tracking.getall_ad_tracking(query.value)
        ad_tracking.ad_trackinginfo.data.map((item: any, i: number) => {
            const rowData = [
                i + 1,
                item.name,
                item.instanceid,
                item.addresstype,
                item.listenport,
                item.listenprotocol,
                item.status,
                item.forwardport,
                item.servergroupid,
                item.type,
                item.create_time,
                item.sync_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
        ['序号', '名称', '实例id', '地址类型', '监听端口', '监听协议', '状态', '转发端口', '后端服务器组id', '类型', '创建时间', '同步时间'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'SLB-ECS');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `SLB-ECS.xlsx`);
};

// 计算唯一的 backend_type  
function getUniqueBackendTypes(servers:any) {  
  return [...new Set(servers.map((server: { backend_type: any; }) => server.backend_type))];  
}  
  
// 计算唯一的 backend_server_name
function getUniqueBackendServerNames(servers:any) {  
  return [...new Set(servers.flatMap((server: { backend_server_name: any; }) => server.backend_server_name))];  
}  

//计算唯一端口
function getUniqueBackendPorts(servers:any) {  
  return [...new Set(servers.flatMap((server: { backend_listen_port: any; }) => server.backend_listen_port))];  
}  

//计算后端ip
// function getUniqueBackendAddress(servers:any) {  
//   return [...new Set(servers.map((server: { backend_server_address: any; }) => server.backend_server_address))];  
// }  

// 计算唯一的 backend_server_name  
function getUniqueBackendproxy_adports(servers:any) {  
  return [...new Set(servers.flatMap((server: { backend_proxy_ad_port: any; }) => server.backend_proxy_ad_port))];  
}  

// 计算唯一的 backend_server_address
function getUniqueBackendServer_address(servers:any) {  
  return [...new Set(servers.flatMap((server: { backend_server_address: any; }) => server.backend_server_address))];  
} 





//刷新
const handleRefresh = () => {
    ad_tracking.getall_ad_tracking(query.value)
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