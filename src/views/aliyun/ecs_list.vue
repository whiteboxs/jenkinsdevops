<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="queryform.name" placeholder="实例名称" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
			</div>
			<el-table 
            :data="ecsstore.ecslist" 
            border class="table" 
            ref="multipleTable" 
            header-cell-class-name="table-header"
            :cell-style="cellStyle"
            >
                <el-table-column prop="InstanceId" label="实例ID" align="center" ></el-table-column>
				<el-table-column  prop="InstanceName" label="实例名称" align="center" ></el-table-column>
				<el-table-column prop="inip" label="内网ip" width="130" align="center"></el-table-column>
				<el-table-column prop="publicip" label="公网ip" width="130" align="center"></el-table-column>
				<el-table-column prop="Cpu" label="CPU(核心)" width="100" align="center" ></el-table-column>
				<el-table-column prop="Memory" label="内存(MB)" width="100" align="center"></el-table-column>
                <el-table-column  prop="Disk" label="系统磁盘(GB)" width="120" align="center">
                    <template #default="{ row }">
                        <div v-for="(item, index) in row.Disk" :key="index">
                        <span v-if="item.DiskType === 'system'">{{ item.DiskSize }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  prop="Disk" label="数据磁盘(GB)" width="120" align="center">
                        <template #default="{ row }">
                            <div v-for="(item, index) in row.Disk" :key="index">
                        <span v-if="item.DiskType === 'data'">{{ item.DiskSize }}</span>
                        </div>
                        </template>
                </el-table-column>
                <el-table-column prop="Status" label="工作状态" width="120" align="center" ></el-table-column>
                <el-table-column prop="createtime" label="创建时间" align="center" >
                    <!-- <template #default="{ row }">
                        <span>{{ formatTime(row.createtime) }}</span>
                    </template> -->
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
	</div>
</template>

<script setup lang="ts" name="usermanage">

import { ref,onMounted } from 'vue';
import { useecsstore } from '../../store/ecs_list';
import { Search } from '@element-plus/icons-vue';

const ecsstore = useecsstore();



// 查询操作
const handleSearch = () => {
    console.log('sename',queryform)
    ecsstore.getecs(queryform.value)
};

onMounted(() => {
    ecsstore.getecs(queryform)
  })

//table表单加载动画
//   const loading = ref(true)


// async function handleMounted() {

//   // 获取数据
//   await ecsstore.getecs(queryform);
//     // 关闭加载动画
//   loading.value = false;
// }


//后端分页

const queryform = ref({
    name: '',
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


	
// 判断颜色
    // const statusColor = (status: string) => {
    //     if (status === 'Running') {
    //     return 'blue';
    //     } else if (status === 'Stopped') {
    //     return 'red';
    //     } else {
    //     return 'inherit';
    //     }
    // }

    const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
    // 状态列字体颜色
    // columnIndex 列下标
    // rowIndex 行下标
    // row 行
    // column 列
    if (columnIndex === 8) {
        return {
        color: "#189EFF", 
        fontWeight: 'bold'
        };
    }  else if (row.Status == 'Stopped' ) {
      return { color: "red" }
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
</style>
