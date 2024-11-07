<template>
	<div>
		<div class="container">
        <el-form :model="query" ref="queryFormRef" :rules="rules" :inline="true" label-width="auto" >
          <el-form-item label="名称" >
                <el-input
                v-model="query.name"
                placeholder="请输入访问名称"
                clearable
                style="width: 170px;"
                @keyup.enter="handleSearch(queryFormRef)"
                @blur="handleSearch(queryFormRef)"
                />
            </el-form-item>
            <el-form-item label="IP地址" prop="ip">
                <el-input
                v-model="query.ip"
                placeholder="请输入IP地址"
                clearable
                style="width: 170px;"
                @keyup.enter="handleSearch(queryFormRef)"
                @blur="handleSearch(queryFormRef)"
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
                <el-button type="primary" icon="Search" @click="handleSearch(queryFormRef)">搜索</el-button>
                <el-button icon="Refresh" @click="handleReset(queryFormRef)">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
              type="primary" plain icon="Plus"  @click="handleAdd" v-permiss="72" >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button  type="success" plain icon="CirclePlus" :disabled="multiple" @click="handleAddagent" >客户端环境安装</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="WarningFilled" :disabled="multiple" @click="handleagent_check" >客户端组件检查</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="WarningFilled" :disabled="multiple" @click="handleversion_check" >版本检查</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button  type="success" plain icon="Download" @click="handleExport" >导出</el-button>
         </el-col>
         <el-col :span="2">
            <el-tooltip content="刷新" placement="top">
                <el-button :icon="Refresh" circle size="small"  @click="handleRefresh"/>
            </el-tooltip>     
        </el-col>
          </el-row>

        <el-table :data="nginx_server.nginx_serverinfo" 
        @selection-change="handleSelectionChange" 
        border class="table"  
        header-cell-class-name="table-header"  
        :cell-style="cellStyle" width="auto">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="70" align="center" sortable/>
            <el-table-column prop="name" label="名称" align="center"  >
            </el-table-column>
            <el-table-column prop="ip" label="地址" align="center">
            </el-table-column>
            <el-table-column prop="service_path" label="服务路径" width="250" align="center"  >
            </el-table-column>
            <el-table-column prop="cpu" label="CPU" width="90" align="center">
                <template #default="scope">
                      <el-tag >{{ scope.row.cpu }}核</el-tag>
                  </template>
            </el-table-column>
            <el-table-column prop="memory" label="内存" width="100" align="center">
              <template #default="scope">
                    <el-tag >{{ scope.row.memory }}MB</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="disk" label="磁盘" width="150" align="center">
              <template #default="scope">
                    <el-tag v-for="item in scope.row.disk">{{ item }}GB</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" align="center">
            </el-table-column>
            <el-table-column prop="agent_check" label="客户端组件" align="center" width="100" >
                  <template #default="{ row }">
                    <div class="mb-4"> 
                      <el-icon v-if="row.agent_check" style="color: green;"><CircleCheckFilled /></el-icon>
                      <el-icon v-else style="color: red;"><CircleCloseFilled /></el-icon>
                    </div>
                  </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="250" align="center"></el-table-column>
            <el-table-column label="操作" width="110" align="center">
                <template #default="scope">
                  <div class="mb-4">
                    <el-button text icon="Edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                  </div>
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
                :total=nginx_server.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
            <el-drawer v-model="drawer" 
                        title="新增nginx服务器"
                        size="20%" 
                        @close="closeDr(ruleFormRef)">
                <el-form
                    ref="ruleFormRef"
                    :model="nginxForm"
                    status-icon
                    :rules="rules"
                    label-width="80"
                    class="demo-ruleForm"
                    >
                    <el-form-item label="名称" prop="name" >
                      <el-select
                        v-model="nginxForm.name"
                        clearable
                        filterable
                        multiple
                        placeholder="请选择"
                        style="width: 240px"
                        @change="nameChange"
                      >
                        <el-option
                          v-for="item in ecsnameip"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="ip地址">
                      <template v-for="(ip, index) in nginxForm.ip" :key="index">  
                        <el-input v-model="nginxForm.ip[index]" autocomplete="off" style="width: 240px" disabled/>
                    </template>
                    </el-form-item>	
                    <el-form-item label="服务路径" prop="service_path">
                        <el-input v-model="nginxForm.service_path" autocomplete="off" style="width: 240px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
                        <el-button @click="resetForm()">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-drawer>
     <edit_nginx_server :ecsnameip=ecsnameip ref="editref" @onupdate="nginx_server.getnginx_server(query)" />
    </div>
</template>

<script setup lang="ts" name="nginx_server">
import { ref,onMounted } from 'vue';
import { useallnginx_serverstore } from '@/store/ad_tracking/nginx_server';
import { add_nginx_server,ecs_nameip,del_nginx_server,add_agent_env,agent_env_check,check_nginx_version } from '@/http/ad_tracking/nginx';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as XLSX from 'xlsx';
import type { FormInstance, FormRules } from 'element-plus'


//导入编辑模块
import edit_nginx_server from '@/views/ad_tracking/servers/edit_nginx_server.vue';
// 获取表格数据,点击菜单后才加载
onMounted(() => {
    nginx_server.getnginx_server(query.value)
   
})

const nginx_server = useallnginx_serverstore();

const queryFormRef = ref<FormInstance>()
const query = ref({
        name: '',
        ip: '',
        create_time:'',
        pagenum: 1,
        pagesize: 10
});

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




// 搜索
const handleSearch = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
    if (valid) {
      query.value.pagenum = 1
      query.value.pagesize = 10
      console.log(query.value)
      nginx_server.getnginx_server(query.value)
  } else {
      return false
    }
  })
};

// 重置
const handleReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    query.value = {
        name: '',
        ip: '',
        create_time:'',
        pagenum: 1,
        pagesize: 10
    };
    nginx_server.getnginx_server(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    nginx_server.getnginx_server(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    nginx_server.getnginx_server(query.value)
  }

// 打开抽屉窗口 
const drawer = ref(false)
const ruleFormRef = ref<FormInstance>()
interface nginxForm {  
  ip: Array<string>;  
  name: Array<string>;  
  service_path: string;  
  create_time: string;  
  pagenum: number;  
  pagesize: number
  
}
const nginxForm = ref<nginxForm>({
        name: [],
        ip: [],
        service_path:'',
        create_time:'',
        pagenum: 1,
        pagesize: 10
    });

//新增策略
const handleAdd = async () => {
    drawer.value=true
    await  ecs_nameip_list()
}

//打开弹窗
const dialogVisible = ref(false)




interface ip_name {  
  ip: string;  
  name: string;  
}

// 获取ecsnameip
const ecsnameip = ref<ip_name[]>([])
const ecs_nameip_list = async () => {
  const res = await ecs_nameip()
  ecsnameip.value =res.data
  console.log('ecsnameip',ecsnameip.value)
}



const nameChange = () => {
  const matchedIPs = <any>[]
  nginxForm.value.name.forEach(name => {  
    // 在 ecsnameip.value 中查找匹配的项  
    const selectedItem = ecsnameip.value.find(item => item.name === name);  
    if (selectedItem) {  
      // 如果找到了匹配的项，将其 ip 添加到 matchedIPs 数组中  
      matchedIPs.push(selectedItem.ip);  
    }  
  });
  nginxForm.value.ip = matchedIPs
} 



//验证
//验证添加的账号字段

const validname= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('策略名称名不能为空'))
  } else {
    callback()
  }
}


const validservice_path= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('静默开始时间不能为空'))
  } else {
    callback()
  }
}


const rules = ref<FormRules>({
    name: [{ validator: validname, required: true, trigger: 'blur' }],
    service_path: [{ validator: validservice_path, required: true, trigger: 'blur' }],
    ip: [{ validator: validip, trigger: 'blur' }],

})
//  抽屉关闭时的回调
const closeDr=(formEl: FormInstance | undefined) =>{
    drawer.value=false
    if (!formEl) return;
    formEl.resetFields();
    nginxForm.value={
        name: [],
        ip: [],
        service_path:'',
        create_time:'',
        pagenum: 1,
        pagesize: 10
    };
}

//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
        //新增
        await add_nginx_server(nginxForm.value).then((res:any)=>{
        ElMessage.success(res.data.msg)
			  drawer.value=false
			//刷新页面
        nginx_server.getnginx_server(query.value)
        })
      } else {
      return false
    }
  })
}


//  取消
const resetForm = () => {
   drawer.value=false
}

// row传入到详细按钮中  编辑
// 修改
const editref = ref<{ open: (row: any) => void } | null>(null)
const handleEdit = async (row:any) => {
  await  ecs_nameip_list()
  editref.value?.open(row)
	console.log(editref.value)
}

//多选模块
const multiple = ref(true);
const ids = ref([]);
const ips = ref({
  ip:[]
});
/** 多选框选中数据 */
const handleSelectionChange = (selection:any) => {
    ids.value = selection.map((item: { id: number; }) => item.id);
    ips.value.ip = selection.map((item: { ip: string; }) => item.ip);
    multiple.value = !selection.length;
    console.log('ids',ids.value)
    console.log('ip',ips.value.ip)
}
/** 删除按钮操作 */
const handleDelete = async () => {
  const nginxIds = ids.value;
        ElMessageBox.confirm(
        '是否确认删除编号为"' + nginxIds + '?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            for (const id of nginxIds) {
                // 在这里执行实际的删除操作
                const res = await del_nginx_server(id);
                ElMessage.success('操作完成');
             }
    nginx_server.getnginx_server(query.value)
}).catch(() => {});
}

/** 安装客户端操作 */
const handleAddagent = async () => {
  const nginxIps = ips.value;
        ElMessageBox.confirm(
        '是否确认在' + nginxIps.ip + '上安装客户端组件吗?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            const res = await add_agent_env(nginxIps);
            let setup_result = '结果如下:\n';
            res.data.msg.forEach((item:any) => {  
            setup_result += `IP: ${item.ip} ${item.result}\n`;  
            });  
            ElMessageBox.alert(setup_result, '提示', {
                  confirmButtonText: '确定',
              }
              );
    nginx_server.getnginx_server(query.value)
}).catch(() => {});
}


/** 客户端组件检查 */
const handleagent_check = async () => {
  const nginxIps = ips.value;
        ElMessageBox.confirm(
        '是否确认检查' + nginxIps.ip + '上客户端组件吗?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            const res = await agent_env_check(nginxIps);
            let setup_result = '结果如下:\n';
            res.data.msg.forEach((item:any) => {  
            setup_result += `IP: ${item.ip} ${item.result}\n`;  
            });  
            ElMessageBox.alert(setup_result, '提示', {
                  confirmButtonText: '确定',
              }
              );
    nginx_server.getnginx_server(query.value)
}).catch(() => {});
}

/** 版本检查 */
const handleversion_check = async () => {
  const nginxIps = ips.value;
        ElMessageBox.confirm(
        '是否确认检查' + nginxIps.ip + '上NGINX版本吗?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            const res = await check_nginx_version(nginxIps);
            let check_result = '';
            res.data.data.forEach((item:any) => {  
            check_result += `NGINX_IP: ${item.ip} 版本: ${item.result}\n`;  
            });  
            ElMessageBox.alert(check_result, '提示', {
                  confirmButtonText: '确定',
              }
              );
    nginx_server.getnginx_server(query.value)
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
    nginx_server.getnginx_server(query.value)
}).catch(() => {});
}

//导出操作日志
const handleExport = async () => {
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(nginx_server.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        await nginx_server.getnginx_server(query.value)
        nginx_server.nginx_serverinfo.map((item: any) => {
            const rowData = [
                item.id,
                item.name,
                item.ip,
                item.service_path,
                item.create_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
        ['序号', '名称', '地址', '路径','创建时间'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, 'nginx服务器信息');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `nginx服务器信息.xlsx`);
};

//刷新
const handleRefresh = () => {
    nginx_server.getnginx_server(query.value)
}




const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
    // 状态列字体颜色
    // columnIndex 列下标
    // rowIndex 行下标
    // row 行
    // column 列
    if (columnIndex === 6 ) {
        return {
        color: "#1CD66C", 
        fontWeight: 'bold'
        };
    }  
    if (columnIndex === 7 ) {
        return {
        color: "#1CD66C", 
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
        color: "#1CD66C", 
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
.example-basic .el-date-editor {
  margin: 8px;
}
</style>