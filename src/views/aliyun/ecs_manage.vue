<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input   clearable  @keyup.enter="handleSearch" v-model="queryform.name" placeholder="实例名称" class="handle-input mr10">实例名称</el-input>
        <el-input   clearable  @keyup.enter="handleSearch" v-model="queryform.inip" placeholder="内网IP" class="handle-input mr10">内网IP</el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button icon="Refresh" @click="handleReset">重置</el-button>
			</div>
			<el-table 
            :data="ecsstore.ecslist" 
            border class="table" 
            ref="multipleTable" 
            header-cell-class-name="table-header"
            :cell-style="cellStyle"
            v-loading="loading"
            element-loading-text="Loading..."
            >
        <el-table-column prop="InstanceId" label="实例ID" width="120" align="center" ></el-table-column>
				<el-table-column  prop="InstanceName" label="实例名称" width="210" align="center" ></el-table-column>
				<el-table-column prop="inip" label="内网IP" width="110" align="center"></el-table-column>
				<el-table-column prop="publicip" label="公网IP" width="110" align="center"></el-table-column>
				<el-table-column prop="Cpu" label="CPU" width="60" align="center" >
                <template #default="scope">
                  {{ scope.row.Cpu + '核'}}
                 </template>
        </el-table-column>
				<el-table-column prop="Memory" label="内存" width="100" align="center">
               <template #default="scope">
                   {{ scope.row.Memory + 'MB'}}
                 </template>
        </el-table-column>
                <el-table-column  prop="Disk" label="系统磁盘" width="90" align="center">
                    <template #default="{ row }">
                        <div v-for="(item, index) in row.Disk" :key="index">
                        <span v-if="item.DiskType === 'system'">{{ item.DiskSize + 'GB'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  prop="Disk" label="数据磁盘" width="90" align="center">
                        <template #default="{ row }">
                            <div v-for="(item, index) in row.Disk" :key="index">
                        <span v-if="item.DiskType === 'data'">{{ item.DiskSize + 'GB' }}</span>
                        </div>
                        </template>
                </el-table-column>
                <el-table-column prop="Status" label="工作状态" width="90" align="center" ></el-table-column>
                <el-table-column prop="monitor" label="监控" align="center" width="60" >
                  <template #default="{ row }">
                    <div class="mb-4"> 
                      <el-icon v-if="row.monitor && row.monitor.length > 0" style="color: green;"><CircleCheckFilled /></el-icon>
                      <el-icon v-else style="color: red;"><CircleCloseFilled /></el-icon>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createtime" label="创建时间" align="center" width="160" >
                    <template #default="{ row }">
                        <span>{{ row.createtime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="380" align="center">
                <template #default="scope">
                  <el-tooltip content="修改主机名" placement="top">
                        <el-button plain  type="success" :icon="Edit" @click="handlehostname(scope.row)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="配置supervisor" placement="top">
                        <el-button plain type="warning" :icon="Finished" @click="handlsupervisor(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="jar包上传" placement="top">
                         <el-button plain  type="primary" :icon="Upload" @click="handlejarupload(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="监控管理" placement="top">
                        <el-button plain  color="#626aef" :icon="VideoCamera" @click="handlemonitor(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="启动" placement="top">
                        <el-button plain  type="success" :icon="SwitchButton" @click="handlestart(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="关机" placement="top">
                        <el-button plain  type="danger" :icon="Close" @click="handlestop(scope.row)"></el-button>
                    </el-tooltip>
                  <!-- <el-button text type="danger" :icon="Delete" class="red" @click="handleDelete(scope.row.id)">
                    启动
                  </el-button> -->
                </template>
              </el-table-column>
			</el-table>
			<div class="pagination">
                <el-pagination 
                v-model:current-page="queryform.PageNumber" 
                :page-size="queryform.PageSize" 
                :page-sizes="[10, 20, 30, 40]"
                background layout="total, sizes, prev, pager, next, jumper" 
                :total="ecsstore.count"
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" />
			</div>
		</div>
    <ecs_super ref="ecssuperref"/>
    <ecs_hostname ref="ecshostnameref"/>
    <ecs_monitor :monitorgroups=monitorgroups ref="ecs_monitorref" @onmonitor="ecsstore.getecs(queryform)"/>
	</div>
</template>

<script setup lang="ts" name="ecs_manage">
import { ref,onMounted } from 'vue';
import { useecsstore } from '@/store/aliyun/ecs_list';
import { Search,Finished,Upload,SwitchButton,Close,VideoCamera,Edit} from '@element-plus/icons-vue';
//initsupervisor子主件
import ecs_super from '@/components/ecs/ecs_super.vue';
import ecs_hostname from '@/components/ecs/ecs_hostname.vue';
import ecs_monitor from '@/components/ecs/ecs_monitor.vue';
import { monitor_group } from '@/http/api';

const ecsstore = useecsstore();

// 查询操作
const handleSearch = () => {
    console.log('sename',queryform)
    ecsstore.getecs(queryform.value)
};

// 重置搜索
const handleReset = () => {
    queryform.value.name = ''
    queryform.value.inip = ''
    ecsstore.getecs(queryform.value)
};

onMounted(() => {
  ecsstore.getecs(queryform.value)
        .then(() => {
          // 加载完成后关闭加载动画
          loading.value = false;
        })
        .catch(error => {
          // 处理加载失败的情况
          console.error('Failed to load form:', error);
        });
  })

//table表单加载动画
  const loading = ref(true)



//后端分页

const queryform = ref({
    name: '',
    inip:'',
    PageNumber: 1,
    PageSize: 10
  }); // 当前页数
  


  
  
  
  const handleSizeChange = (PageSize:any) => {
    queryform.value.PageNumber = 1
    queryform.value.PageSize = PageSize
    ecsstore.getecs(queryform.value);
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (PageNumber:any) => {
    // console.log('Change', pageNum
    queryform.value.PageNumber = PageNumber;
    console.log('上传的参数', queryform.value)
    ecsstore.getecs(queryform.value);
  };


	

// 状态列字体颜色
// columnIndex 列下标
// rowIndex 行下标
// row 行
// column 列
const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
  if (columnIndex === 8) {
    if(row.Status == 'Stopped'){
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
  if (columnIndex === 0) {
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

//时间转换
// function formatTime(isoTime:any) {
//       const date = new Date(isoTime);
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       const seconds = String(date.getSeconds()).padStart(2, '0');
//       return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }


// ecs初始化 主要是配置配置super打开子组件 
const ecssuperref = ref<{ opensuper: (row: any) => void } | null>(null)
const handlsupervisor = (row:any) => {
      ecssuperref.value?.opensuper(row)
  }

//修改hostname
const ecshostnameref = ref<{ openhostname: (row: any) => void } | null>(null)
const handlehostname = (row:any) => {
      ecshostnameref.value?.openhostname(row)
}


// 获取监控组
const monitorgroups = ref([])
const monitor_list = async () => {
  const res = await monitor_group()
  monitorgroups.value = res.data.monitor_group
  console.log('监控组',monitorgroups.value)
}


//监控管理 组件
const ecs_monitorref = ref<{ openmonitor: (row: any) => void } | null>(null)
const handlemonitor = async (row:any) => {
  await monitor_list()
  ecs_monitorref.value?.openmonitor(row)
}

//当前项目的jar包上传到主机/home/js目录
const handlejarupload = (row:any) => {
      console.log('row',row)
}
//开机
const handlestart = (row:any) => {
      console.log('row',row)
}
//关机
const handlestop = (row:any) => {
      console.log('row',row)
}
//告警按钮
const handleprometheus = (row:any) => {
      console.log('row',row)
}

</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}

.example-showcase .el-loading-mask {
  z-index: 9;
}

.el-row {
  margin-bottom: 6px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 3px;
}
.grid-content {
  border-radius: 3px;
  min-height: 36px;
}

.el-button + .el-button {
  margin-left: 8px;
}

.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>
