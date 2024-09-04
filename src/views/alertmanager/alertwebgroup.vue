<template>
	<div>
		<div class="container">
        <el-form :model="query" ref="queryRef" :inline="true" label-width="auto" status-icon v-show="showSearch">
            <el-form-item label="告警群名称" >
                <el-input
                v-model="query.name"
                placeholder="请输入告警群名称"
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
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
                <el-button icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
            <el-button
              type="primary" plain icon="Plus"  @click="handleAdd" v-permiss="76">新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-permiss="77">删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="success" plain icon="Download" @click="handleExport" v-permiss="78" >导出</el-button>
         </el-col>
         <el-col :span="2">
            <el-tooltip content="刷新" placement="top">
                <el-button :icon="Refresh" circle size="small"  @click="handleRefresh"/>
            </el-tooltip>     
        </el-col>
          </el-row>

        <el-table :data="alertwebgroup.alertwebgroupinfo.data" 
        @selection-change="handleSelectionChange" 
        border class="table"  
        header-cell-class-name="table-header"  
        :cell-style="cellStyle">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="90" align="center" />
            <el-table-column prop="name" label="名称" width="150" align="center"></el-table-column>
            <el-table-column prop="group" label="告警分组" width="350" align="center">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.group">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="exclude_group" label="排除分组" width="150" align="center">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.exclude_group">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="exclude_instance" label="排除地址" width="120" align="center">
                <template #default="scope">
                    <el-tag v-for="item in scope.row.exclude_instance">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="url" label="发送地址" align="center"></el-table-column>
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
                :total=alertwebgroup.count
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
            <el-drawer v-model="drawer" 
					         title="新增告警分组" 
							 @close="closeDr(ruleFormRef)">
						<el-form
							ref="ruleFormRef"
							:model="webhookForm"
							status-icon
							:rules="rules"
							label-width="100px"
							class="demo-ruleForm"
							>
              <el-form-item label="告警群名称" prop="name">
								<el-input v-model="webhookForm.name" autocomplete="off" style="width: 240px" />
							</el-form-item>
							<el-form-item label="告警组" prop="group">
                    <el-select-v2
                        clearable
                        filterable
                        v-model="webhookForm.group"
                        :options="monitorgroups"
                        placeholder="请选择(可多选,搜索)"
                        style="width: 240px"
                        multiple
                    />
							</el-form-item>
            <el-form-item label="排除组" prop="exclude_group">
              <el-select-v2
                  clearable
                  filterable
                  v-model="webhookForm.exclude_group"
                  :options="monitorgroups"
                  placeholder="请选择(可多选,搜索)"
                  style="width: 240px"
                  multiple
              />
            </el-form-item>
            <el-form-item label="排除主机" prop="exclude_instance">
                <el-select-v2
                    clearable
                    filterable
                    v-model="webhookForm.exclude_instance"
                    :options="monitorinstances"
                    placeholder="请选择(可多选,搜索)"
                    style="width: 240px"
                    multiple
                />
            </el-form-item>
              <el-form-item label="URL" prop="url">
								<el-input v-model="webhookForm.url" autocomplete="off" :rows="2" type="textarea"/>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
								<el-button @click="resetForm()">取消</el-button>
							</el-form-item>
						</el-form>
					</el-drawer>
     <edit_alertwebgroup ref="editref" @onupdate="alertwebgroup.getalertwebgroup" />
    </div>
</template>

<script setup lang="ts" name="alertwebgroup">
import { ref,onMounted } from 'vue';
import { usealertwebgroupStore } from '@/store/alert/alertwebgroup';
import {  add_alert_webhook ,delalert_webhook }  from '@/http/alert/alert';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as XLSX from 'xlsx';
import type { FormInstance, FormRules } from 'element-plus'
import { monitor_group,monitor_instance } from '@/http/api';
//导入编辑模块
import edit_alertwebgroup from '@/components/alertmanager/edit_alertwebgroup.vue';

const alertwebgroup = usealertwebgroupStore();


const query = ref<any>({
	name: '',
  group:'',
  pagenum: 1,
  pagesize: 10
});


// 点击菜单后加载
onMounted(() => {
    alertwebgroup.getalertwebgroup(query.value)
})

// 搜索
const handleSearch = () => {
    console.log(query.value)
    query.value.pagenum = 1
    query.value.pagesize = 10
    alertwebgroup.getalertwebgroup(query.value)
};

// 重置
const handleReset = () => {
    query.value = {
        name: '',
        group:'',
        pagenum: 1,
        pagesize: 10
    };
    alertwebgroup.getalertwebgroup(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    alertwebgroup.getalertwebgroup(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    alertwebgroup.getalertwebgroup(query.value)
  };

// 打开窗口 
const drawer = ref(false)
const ruleFormRef = ref<FormInstance>()
const webhookForm = ref({
        name: '',
        group:[],
        exclude_group:[],
        exclude_instance:[],
        url:'',
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

//验证
//验证添加的账号字段

const validname= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('告警群名称名不能为空'))
  } else {
    callback()
  }
}


const validgroup= (_: any, value: any, callback: any) => {
  if (!value.length) {
    callback(new Error('告警组名不能为空'))
  } else {
    callback()
  }
}


const validurl= (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('地址名不能为空'))
  } else {
    callback()
  }
}

const rules = ref<FormRules>({
    name: [{ validator: validname, required: true, trigger: 'blur' }],
    group: [{ validator: validgroup, required: true, trigger: 'blur' }],
    url: [{ validator: validurl, required: true, trigger: 'blur' }],
  

})
//  抽屉关闭时的回调
const closeDr=(formEl: FormInstance | undefined) =>{
  drawer.value=false
  if (!formEl) return;
	formEl.resetFields();
  webhookForm.value={
    name: '',
    group:[],
    exclude_group:[],
    exclude_instance:[],
    url:'',
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
        await add_alert_webhook(webhookForm.value).then((res:any)=>{
            ElMessage.success(res.data.msg)
			drawer.value=false
			//刷新页面
            alertwebgroup.getalertwebgroup(query.value)
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
                const res = await delalert_webhook(id);
                ElMessage.success('操作完成');
             }
    alertwebgroup.getalertwebgroup(query.value)
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
            alertwebgroup.getalertwebgroup(query.value)
}).catch(() => {});
}

//导出操作日志
const handleExport = async () => {
    let list: any = []; // 用于存储所有操作日志数据
     // 获取第一页数据
    // 计算总页数
    const totalPages = Math.ceil(alertwebgroup.count/10) 
    console.log(totalPages)
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        query.value.pagenum = pageNum
        await alertwebgroup.getalertwebgroup(query.value)
        alertwebgroup.alertwebgroupinfo.data.map((item: any, i: number) => {
            const rowData = [
                i + 1,
                item.name,
                item.url,
                item.create_time,
            ];
            list.push(rowData);
        });
    }
     // 创建工作表
     let WorkSheet = XLSX.utils.aoa_to_sheet([
        ['序号', '策略群名称', 'URL', '创建时间'],
        ...list
    ]);

    // 创建新的工作簿，并将工作表添加到其中
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '告警群');

    // 将新的工作簿保存为 Excel 文件
    XLSX.writeFile(new_workbook, `告警群.xlsx`);
};

//隐藏搜索
const showSearch = ref(true);
//刷新
const handleRefresh = () => {
    alertwebgroup.getalertwebgroup(query.value)
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