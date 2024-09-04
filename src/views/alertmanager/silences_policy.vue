<template>
	<div>
		<div class="container">
        <el-form :model="query" ref="queryRef" :inline="true" label-width="auto" status-icon v-show="showSearch">
            <el-form-item label="策略名称" >
                <el-input
                v-model="query.name"
                placeholder="请输入策略名称"
                clearable
                style="width: 150px;"
                @keyup.enter="handleSearch"
                />
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
            <el-form-item label="告警分组" >
            <el-input
               v-model="query.group"
               placeholder="请输入告警分组"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch"
                />
             </el-form-item>
             <el-form-item label="告警级别" >
              <el-select
               v-model="query.serverity"
               placeholder="请选择告警级别"
               clearable
               style="width: 150px"
               @keyup.enter="handleSearch"
                >
                <el-option key="1" label="critical" value="critical" ></el-option>
                <el-option key="2" label="warning" value="warning" ></el-option>
                </el-select>
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
              type="primary" plain icon="Plus"  @click="handleAdd" v-permiss="72" >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-permiss="73" >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" @click="handleClean" v-permiss="74">清空</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="success" plain icon="Download" @click="handleExport" v-permiss="75">导出</el-button>
         </el-col>
         <el-col :span="2">
            <el-tooltip content="刷新" placement="top">
                <el-button :icon="Refresh" circle size="small"  @click="handleRefresh"/>
            </el-tooltip>     
        </el-col>
          </el-row>

        <el-table :data="silences_policy.silences_policyinfo.data" 
        @selection-change="handleSelectionChange" 
        border class="table"  
        header-cell-class-name="table-header"  
        :cell-style="cellStyle">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="90" align="center" />
            <el-table-column prop="name" label="策略名称" width="150" align="center"></el-table-column>
            <el-table-column prop="group" label="告警组" width="300" align="center"  >
                <template #default="scope">
                    <el-tag v-for="item in scope.row.group">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="instance" label="告警地址" align="center">
                <template #default="scope">
                        <el-tag v-for="item in scope.row.instance">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="serverity" label="告警级别" width="120" align="center">
                <template #default="scope">
                    <div v-for="item in scope.row.serverity" >
                        <el-tag type="danger" v-if="item === 'critical'">{{ item}}</el-tag>
                        <el-tag type="warning" v-else="item === 'warning'">{{ item}}</el-tag>
                    </div>  
                </template>
            </el-table-column>
            <el-table-column prop="starttime" label="静默开始时间" width="170" align="center"></el-table-column>
            <el-table-column prop="endtime" label="静默结束时间" width="170" align="center"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="170" align="center"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
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
                :total=silences_policy.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
            <el-drawer v-model="drawer" 
                        title="新增静默策略" 
                        @close="closeDr(ruleFormRef)">
                        
                <el-form
                    ref="ruleFormRef"
                    :model="policyForm"
                    status-icon
                    :rules="rules"
                    label-width="110"
                    class="demo-ruleForm"
                    >
                    <el-form-item label="策略名称" prop="name">
                        <el-input v-model="policyForm.name" autocomplete="off" style="width: 240px" />
                    </el-form-item>
                    <el-form-item label="告警组" prop="group">
                        <el-select-v2
                            clearable
                            filterable
                            v-model="policyForm.group"
                            :options="monitorgroups"
                            placeholder="请选择(可多选,搜索)"
                            style="width: 240px"
                            multiple
                        />
                    </el-form-item>
                    <el-form-item label="告警地址" prop="instance">
                        <el-select-v2
                            clearable
                            filterable
                            v-model="policyForm.instance"
                            :options="monitorinstances"
                            placeholder="请选择(可多选,搜索)"
                            style="width: 240px"
                            multiple
                        />
                    </el-form-item>
                    <el-form-item label="告警级别" prop="serverity">
                        <el-select-v2
                            clearable
                            filterable
                            v-model="policyForm.serverity"
                            :options="alert_serverity"
                            placeholder="请选择(可多选,搜索)"
                            style="width: 240px"
                            multiple
                        />
                    </el-form-item>
                    <el-form-item label="静默开始时间" prop="starttime">
                        <div class="example-basic">
                             <el-time-picker v-model="policyForm.starttime" placeholder="静默开始时间" value-format="HH:mm:ss"/>
                        </div>
                    </el-form-item>
                    <el-form-item label="静默结束时间" prop="endtime">
                        <div class="example-basic">
                             <el-time-picker v-model="policyForm.endtime" placeholder="静默结束时间" value-format="HH:mm:ss"/>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
                        <el-button @click="resetForm()">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-drawer>
     <edit_silences_policy ref="editref" @onupdate="silences_policy.getsilences_policy" />
    </div>
</template>

<script setup lang="ts" name="silences_policy">
import { ref,onMounted } from 'vue';
import { usesilences_policyStore } from '@/store/alert/silences_policy';
import { add_silences_policy, delsilences_policy,allsilences_policy as expallsilences_policy }  from '@/http/alert/alert';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as XLSX from 'xlsx';
import type { FormInstance, FormRules } from 'element-plus'
import { monitor_group,monitor_instance } from '@/http/api';
//导入编辑模块
import edit_silences_policy from '@/components/alertmanager/edit_silences_policy.vue';

const silences_policy = usesilences_policyStore();


const query = ref<{name: string,instance: string,group:string,create_time: string,pagenum: number,pagesize: number,serverity: string,starttime: string,endtime: string,}>({
	name: '',
    instance:'',
    group:'',
    serverity:'',
    starttime: '',
    endtime:'',
    create_time:'',
    pagenum: 1,
    pagesize: 10
});


// 获取表格数据,点击菜单后才加载
onMounted(() => {
    silences_policy.getsilences_policy(query.value)
})

// 搜索
const handleSearch = () => {
    console.log(query.value)
    query.value.pagenum = 1
    query.value.pagesize = 10
    silences_policy.getsilences_policy(query.value)
};

// 重置
const handleReset = () => {
    query.value = {
        name: '',
        instance:'',
        group:'',
        serverity:'',
        starttime: '',
        endtime:'',
        create_time:'',
        pagenum: 1,
        pagesize: 10
    };
    silences_policy.getsilences_policy(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    silences_policy.getsilences_policy(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    silences_policy.getsilences_policy(query.value)
  };

// 打开窗口 
const drawer = ref(false)
const ruleFormRef = ref<FormInstance>()
const policyForm = ref({
        name: '',
        instance:[],
        group:[],
        serverity:[],
        starttime: '',
        endtime:'',
        create_time:'',
        pagenum: 1,
        pagesize: 10
    });

//新增策略
const handleAdd = () => {
    drawer.value=true
    monitor_grouplist()
    monitor_instancelist()
}



// 获取监控组
const monitorgroups = ref([])
const monitor_grouplist = async () => {
  const res = await monitor_group()
  const mapgrouops = res.data.monitor_group.map((i:any) => {
  return { value: i, label: i };
  });
  monitorgroups.value = mapgrouops
}

// 获取监控主机
const monitorinstances = ref([])
const monitor_instancelist = async () => {
  const res = await monitor_instance()
  const mapinstances = res.data.data.map((i:any) => {
  return { value: i, label: i };
  });
  monitorinstances.value = mapinstances
}

//告警级别
const alert_serverity = ref([
  {
    value: 'warning',
    label: 'warning',
  },
  {
    value: 'critical',
    label: 'critical',
  }])
//验证
//验证添加的账号字段

const validname= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('策略名称名不能为空'))
  } else {
    callback()
  }
}


const validserverity= (_: any, value: any, callback: any) => {
  if (!value.length) {
    callback(new Error('告警级别名不能为空'))
  } else {
    callback()
  }
}

const validstarttime= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('静默开始时间不能为空'))
  } else {
    callback()
  }
}

const validendtime= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('静默结束时间不能为空'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
    name: [{ validator: validname, required: true, trigger: 'blur' }],
    serverity: [{ validator: validserverity, required: true, trigger: 'blur' }],
    starttime: [{ validator: validstarttime, required: true, trigger: 'blur' }],
    endtime: [{ validator: validendtime, required: true, trigger: 'blur' }],

})
//  抽屉关闭时的回调
const closeDr=(formEl: FormInstance | undefined) =>{
    drawer.value=false
    if (!formEl) return;
    formEl.resetFields();
    policyForm.value={
        name: '',
        instance:[],
        group:[],
        serverity:[],
        starttime: '',
        endtime:'',
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
        await add_silences_policy(policyForm.value).then((res:any)=>{
            ElMessage.success(res.data.msg)
			drawer.value=false
			//刷新页面
            silences_policy.getsilences_policy(query.value)
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
const handleEdit = (row:any) => {
    editref.value?.open(row)
	console.log(editref.value)
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
                const res = await delsilences_policy(id);
                ElMessage.success('操作完成');
             }
    silences_policy.getsilences_policy(query.value)
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
            silences_policy.getsilences_policy(query.value)
}).catch(() => {});
}

//导出全部
const handleExport = async () => {
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(silences_policy.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        const res  = await expallsilences_policy(query.value)
        res.data.data.map((item: any) => {
            const rowData = [
                item.id,
                item.name,
                item.instance,
                item.group,
                item.serverity,
                item.starttime,
                item.endtime,
                item.create_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
        ['序号', '策略名称', '告警地址', '告警组', '告警级别', '开始时间', '结束时间', '创建时间'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '静默策略');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `静默策略.xlsx`);
};

//隐藏搜索
const showSearch = ref(true);
//刷新
const handleRefresh = () => {
    silences_policy.getsilences_policy(query.value)
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