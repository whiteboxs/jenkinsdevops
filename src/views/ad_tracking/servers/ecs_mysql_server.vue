<template>
	<div>
		<div class="container">
        <el-form :model="query" ref="queryFormRef" :rules="rules" :inline="true" label-width="auto">
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
            <el-form-item label="IP地址" prop="queryip">
                <el-input
                v-model="query.ip"
                placeholder="请输入IP地址"
                clearable
                style="width: 170px;"
                @keyup.enter="handleSearch(queryFormRef)"
                @blur="handleSearch(queryFormRef)"
                />
            </el-form-item>
            <el-form-item label="工作组" prop="querygroup">
              <el-select
                v-model="query.group"
                placeholder="请选择工作组"
                clearable
                style="width: 170px"
                @keyup.enter="handleSearch(queryFormRef)"
                @blur="handleSearch(queryFormRef)"  
                @visible-change ="get_mysql_work_group"
                >
                <el-option :label="item" :value="item" v-for="item in mysqlgrouplist" :key="item" />
              </el-select>
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
            <el-button  type="success" plain icon="CirclePlus" :disabled="multiple" @click="handleSlowagent_setup" >慢查询组件安装</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="WarningFilled" :disabled="multiple" @click="handleSlowagent_check" >慢查询组件检查</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="Check" :disabled="multiple" @click="handlemanualslow_queryreport" >手动生成慢查询报告</el-button>
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

        <el-table :data="ecs_mysql.ecs_mysqlinfo" 
        @selection-change="handleSelectionChange" 
        border class="table"  
        header-cell-class-name="table-header"  
        :cell-style="cellStyle" width="auto">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="65" align="center" sortable/>
            <el-table-column prop="group" label="工作组" width="100" align="center">
            </el-table-column>
            <el-table-column prop="name" label="名称" align="center"  >
            </el-table-column>
            <el-table-column prop="ip" label="地址" width="110" align="center">
            </el-table-column>
            <el-table-column prop="port" label="端口" width="80" align="center">
            </el-table-column>
            <el-table-column prop="db_mode" label="模式" width="80" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center">
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
            <el-table-column prop="disk" label="磁盘" width="100" align="center">
              <template #default="scope">
                    <el-tag v-for="item in scope.row.disk">{{ item }}GB</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" width="70" align="center">
            </el-table-column>
            <!-- <el-table-column prop="service_path" label="服务路径" align="center"  >
            </el-table-column> -->
            <el-table-column prop="slow_query_agent_check" label="慢查询组件" width="80" align="center" >
                  <template #default="{ row }">
                    <div class="mb-4"> 
                      <el-icon v-if="row.slow_query_agent_check" style="color: green;"><CircleCheckFilled /></el-icon>
                      <el-icon v-else style="color: red;"><CircleCloseFilled /></el-icon>
                    </div>
                  </template>
            </el-table-column>
            <el-table-column  prop="slow_query_check_switch" label="慢查询巡检" width="80" align="center" >
              <template #default="scope">
                <el-switch
                v-model="scope.row.slow_query_check_switch"
                @change="handleslow_query_switch(scope.row)"
                class="ml-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                />
              </template>
					</el-table-column>
            <!-- <el-table-column prop="create_time" label="创建时间" width="180" align="center"></el-table-column> -->
            <el-table-column label="操作" align="center">
                <template #default="scope">
                  <div class="mb-4">
                    <el-button text icon="Edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button text icon="Reading" type="success" @click="handlereport(scope.row)">巡检报告</el-button>
                    <el-button  class="slow_query-bt" v-if="scope.row.slow_query_agent_check" text icon="Reading" type="warning" @click="handle_slow_queryreport(scope.row)">慢查询报告</el-button>
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
                :total=ecs_mysql.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
            <el-drawer v-model="drawer" 
                        title="新增mysql服务器"
                        size="20%" 
                        @close="closeDr(ruleFormRef)">
                <el-form
                    ref="ruleFormRef"
                    :model="mysqlForm"
                    status-icon
                    :rules="rules"
                    label-width="80"
                    class="demo-ruleForm"
                    >
                    <el-form-item label="名称" prop="name" >
                      <el-select
                        v-model="mysqlForm.name"
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
                    <el-form-item label="ip地址" prop="ip">
                      <template v-for="(ip, index) in mysqlForm.ip" :key="index">  
                        <el-input v-model="mysqlForm.ip[index]" autocomplete="off" style="width: 240px" disabled/>
                    </template>
                    </el-form-item>	
                    <el-form-item label="端口" prop="port">
                        <el-input v-model="mysqlForm.port" autocomplete="off" style="width: 240px" />
                    </el-form-item>
                    <el-form-item label="工作组"  prop="group">
                      <el-select 
                          v-model="mysqlForm.group" placeholder="请选择工作组"
                          filterable
                          clearable
                          >
                          <el-option :label="item" :value="item" v-for="item in mysqlgrouplist" :key="item" />
                          <template #footer>
                            <el-button v-if="!isAdding" text bg  @click="addgroup">
                                添加新工作组
                              </el-button>
                              <template v-else>
                                <el-input
                                  v-model="mysqlForm.group"
                                  class="option-input"
                                  placeholder="输入新的工作组名"
                                />
                                <el-button type="primary"  @click="onConfirm">
                                  确认
                                </el-button>
                                <el-button  @click="clear">取消</el-button>
                              </template>
                            </template>
                      </el-select>
                  </el-form-item>
                    <el-form-item label="服务路径" prop="service_path">
                        <el-input v-model="mysqlForm.service_path" autocomplete="off" style="width: 240px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
                        <el-button @click="resetForm()">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-drawer>
     <edit_ecs_mysql_server :mysqlgrouplist=mysqlgrouplist :ecsnameip=ecsnameip ref="editref" @onupdate="ecs_mysql.getecs_mysql(query)" />
     <check_report  ref="reportref" />
     <slow_queryreport ref="slow_queryreportref" />
    </div>
</template>

<script setup lang="ts" name="ecs_mysql">
import { ref,onMounted } from 'vue';
import { useallecs_mysqlstore } from '@/store/ad_tracking/ecs_mysql';
import { add_ecs_mysql,ecs_nameip,del_ecs_mysql, mysql_work_group } from '@/http/ad_tracking/nginx';
import{ check_slow_query_agent, add_slow_query_agent, manual_slow_query, manual_slow_query_status} from '@/http/check_report/mysql_check_report';
import { update_slow_query_switch } from '@/http/check_report/mysql_check_report';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as XLSX from 'xlsx';
import type { FormInstance, FormRules } from 'element-plus'


//导入编辑模块
import edit_ecs_mysql_server from '@/views/ad_tracking/servers/edit_ecs_mysql_server.vue';
//巡检报告
import check_report from '@/views/ad_tracking/servers/mysql_check_report.vue';
//慢查询报告
import slow_queryreport from '@/views/ad_tracking/servers/slow_queryreport.vue';


const ecs_mysql = useallecs_mysqlstore();
// 获取表格数据,点击菜单后才加载
onMounted(() => {
    ecs_mysql.getecs_mysql(query.value)
   
})

const queryFormRef = ref<FormInstance>()
const query = ref({
        name: '',
        ip: '',
        group:'',
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
        ecs_mysql.getecs_mysql(query.value)
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
        group:'',
        create_time:'',
        pagenum: 1,
        pagesize: 10
    };
    ecs_mysql.getecs_mysql(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    ecs_mysql.getecs_mysql(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    ecs_mysql.getecs_mysql(query.value)
  }

// 打开抽屉窗口 
const drawer = ref(false)
const ruleFormRef = ref<FormInstance>()
interface nginxForm {  
  ip: Array<string>;  
  name: Array<string>;  
  service_path: string;  
  create_time: string;  
  version:string;
  port:number;
  group:string;
  pagenum: number;  
  pagesize: number
  
}
const mysqlForm = ref<nginxForm>({
        name: [],
        ip: [],
        service_path:'',
        version:'',
        port:3306,
        group:'',
        create_time:'',
        pagenum: 1,
        pagesize: 10
    });

//新增策略
const handleAdd = async () => {
    drawer.value=true
    await get_mysql_work_group()
    await ecs_nameip_list()
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
}


// 获取mysqlworkgroup
const mysqlgrouplist = ref<string[]>([])
const get_mysql_work_group = async () => {
  const res = await mysql_work_group()
  mysqlgrouplist.value =res.data.data
}



// 添加mysql时候的group选项项
const isAdding = ref(false)  
const addgroup = () => {
  isAdding.value = true
}
const onConfirm = () => {
  if (mysqlForm.value.group) {
    mysqlgrouplist.value.push(mysqlForm.value.group);  
    clear()
  }
}
const clear = () => {
  mysqlForm.value.group = ''
  isAdding.value = false
}

const nameChange = () => {
  const matchedIPs = <any>[]
  mysqlForm.value.name.forEach(name => {  
    // 在 ecsnameip.value 中查找匹配的项  
    const selectedItem = ecsnameip.value.find(item => item.name === name);  
    if (selectedItem) {  
      // 如果找到了匹配的项，将其 ip 添加到 matchedIPs 数组中  
      matchedIPs.push(selectedItem.ip);  
    }  
  });
  mysqlForm.value.ip = matchedIPs
} 



//验证
//验证添加的账号字段

const validname= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('名称名不能为空'))
  } else {
    callback()
  }
}


const validservice_path= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('路径不能为空'))
  } else {
    callback()
  }
}
const validport= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('端口不能为空'))
  } else {
    callback()
  }
}

const validgroup = (_: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请选择工作组'))
    } else {
      callback()
    }
  }


const rules = ref<FormRules>({
    name: [{ validator: validname, required: true, trigger: 'blur' }],
    group: [{ validator: validgroup, required: true, trigger: 'blur' }],
    service_path: [{ validator: validservice_path, required: true, trigger: 'blur' }],
    port: [{ validator: validport, required: true, trigger: 'blur' }],
    queryip: [{ validator: validip, trigger: 'blur' }],


})
//  抽屉关闭时的回调
const closeDr=(formEl: FormInstance | undefined) =>{
    drawer.value=false
    if (!formEl) return;
    formEl.resetFields();
    mysqlForm.value={
        name: [],
        ip: [],
        service_path:'',
        version:'',
        port:3306,
        group:'',
        create_time:'',
        pagenum: 1,
        pagesize: 10
    };
}

const handleslow_query_switch = async (row:any) => {
  await update_slow_query_switch(row.id,{slow_query_check_switch:row.slow_query_check_switch}).then(()=>{
       ElMessage.success('修改完成')
       //刷新页面
       ecs_mysql.getecs_mysql(query.value)
    })
}	



//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
        //新增
        
        await add_ecs_mysql(mysqlForm.value).then((res:any)=>{
        ElMessage.success(res.data.msg)
			  drawer.value=false
			//刷新页面
        ecs_mysql.getecs_mysql(query.value)
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
  await get_mysql_work_group()
  await ecs_nameip_list()
  editref.value?.open(row)
}
//报告
const reportref = ref<{ open_check_report: (row: any) => void } | null>(null)
const handlereport = (row:any) => {
    reportref.value?.open_check_report(row)
	console.log(reportref.value)
}

//慢查询报告
const slow_queryreportref = ref<{ open_slow_query_report: (row: any) => void } | null>(null)
const handle_slow_queryreport = (row:any) => {
    slow_queryreportref.value?.open_slow_query_report(row)
	  console.log(reportref.value)
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
  const mysqlIds = ids.value;
        ElMessageBox.confirm(
        '是否确认删除编号为"' + mysqlIds + '?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            for (const id of mysqlIds) {
                // 在这里执行实际的删除操作
                const res = await del_ecs_mysql(id);
                ElMessage.success('操作完成');
             }
    ecs_mysql.getecs_mysql(query.value)
}).catch(() => {});
}



/** 慢查询组件安装 */
const handleSlowagent_setup = async () => {
  const mysqlIps = ips.value;
        ElMessageBox.confirm(
        '是否在' + mysqlIps.ip + '上安装慢查询组件吗?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            const res = await add_slow_query_agent(mysqlIps);
            let setup_result = '';
            res.data.msg.forEach((item:any) => {  
            setup_result += `IP: ${item.ip} ${item.result}\n`;
            });  
            ElMessageBox.alert(setup_result, '提示', {
                  confirmButtonText: '确定',
              }
              );
      ecs_mysql.getecs_mysql(query.value)
}).catch(() => {});
}


/** 手动生成慢查询检查报告 */
const handlemanualslow_queryreport = async () => {
  const mysqlIps = ips.value;
        if (mysqlIps.ip.length>1){
          ElMessageBox.alert('请选择一个IP生成报告,不可多选)','提示',{
            confirmButtonText: '确定',
          })
          return
        }
        const res = await manual_slow_query(mysqlIps);
        if (res.data.msg== '操作完成'){
          // 等待构建完成或超时
        const maxWaitTime = 600000;  // 10分钟超时
        let currentWaitTime = 0;
        while (currentWaitTime < maxWaitTime) {
          // 根据是否是第一次等待来决定等待时间
          const waitTime = 3000;
          // 等待2秒
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // 获取构建状态
          const reportResult = await manual_slow_query_status(res.data.data);  // 自定义获取构建状态的函数，根据实际情况实现
          console.log('breportResult',reportResult.data.data)
          // 判定构建状态
          if (reportResult.data.data.result === '报告已完成，已上传') {
            //每次循环前关闭上一次的提示
            ElMessageBox.close();
            const setup_result = `IP: ${reportResult.data.data.address} ${reportResult.data.data.result}\n`;
            ElMessageBox.alert(setup_result, '提示', {
                  confirmButtonText: '确定',
              }
            )
            ElMessage.success(reportResult.data.data.result);
            // 报告已完成，退出循环  
            break; 
          } 
          else {
            //每次循环前关闭上一次的提示
            ElMessageBox.close();
            // 更新提示框内容
            ElMessageBox.alert(reportResult.data.data.result,{
            showClose: false,
            closeOnClickModal: false,
            type: 'info'
            })
            ElMessage({
            message: reportResult.data.data.result,
            type: 'warning',
            })
            }
          currentWaitTime += waitTime;
        }
        ecs_mysql.getecs_mysql(query.value)
        } else {
          ElMessage({
            message: res.data.msg,
            type: 'warning',
            })
          return
        }
}

/** 慢查询组件检查 */
const handleSlowagent_check = async () => {
  const mysqlIps = ips.value;
        
        ElMessageBox.confirm(
        '是否手动生成' + mysqlIps.ip + '的慢查询报告?',
        '提示',
        { 
        cancelButtonText: '取消',
        confirmButtonText: '确定',
       
        type: 'warning',
        }).then(async () => {
            const res = await check_slow_query_agent(mysqlIps);
            let check_result = '';
            res.data.msg.forEach((item:any) => {  
            check_result += `IP: ${item.ip} ${item.result}\n`;    
            });  
            ElMessageBox.alert(check_result, '提示', {
                  confirmButtonText: '确定',
              }
              );
      ecs_mysql.getecs_mysql(query.value)
}).catch(() => {});
}



//导出操作日志
const handleExport = async () => {
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(ecs_mysql.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        await ecs_mysql.getecs_mysql(query.value)
        ecs_mysql.ecs_mysqlinfo.map((item: any) => {
            const rowData = [
                item.id,
                item.name,
                item.ip,
                item.port,
                item.status,
                item.service_path,
                item.version,
                item.create_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
        ['序号', '名称', '地址', '端口','状态', '路径','版本', '创建时间'],
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
    ecs_mysql.getecs_mysql(query.value)
}




const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
    // 状态列字体颜色
    // columnIndex 列下标
    // rowIndex 行下标
    // row 行
    // column 列
    if (columnIndex ===11) {
        return {
        color: "#1CD66C", 
        fontWeight: 'bold'
        };
    }  
    if (columnIndex === 6) {
    if(row.db_mode == 'slave'){
      return {
      color: "#E6A23C", 
      fontWeight: 'bold'
      };
      }else
      return {
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

<style scoped  lang="less">
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

.mb-4 {
    text-align: left;
}
.mb-4 .el-button {
    margin-left: 0;
}


</style>