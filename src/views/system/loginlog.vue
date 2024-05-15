<template>
	<div>
		<div class="container">
        <el-form :model="query" ref="queryRef" :inline="true" label-width="68px"   status-icon>
         <el-form-item label="登录地址" >
            <el-input
               v-model="query.ip"
               placeholder="请输入登录地址"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch"
            />
         </el-form-item>
         <el-form-item label="用户名称" >
            <el-input
               v-model="query.username"
               placeholder="请输入用户名称"
               clearable
               style="width: 150px;"
               @keyup.enter="handleSearch"
            />
         </el-form-item>
         <el-form-item label="状态">
            <el-select
               v-model="query.status"
               placeholder="登录状态"
               clearable
               style="width: 150px"
            >
            <el-option key="1" label="成功" value="成功" ></el-option>
            <el-option key="2" label="失败" value="失败" ></el-option>
            </el-select>
         </el-form-item>
         <el-form-item label="登录时间" style="width: 308px">
            <el-date-picker
                v-model="query.login_time"
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
			<el-table :data="loginlog.loginloginfo.data" border class="table"  header-cell-class-name="table-header"  :cell-style="cellStyle">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="username" label="用户名称"></el-table-column>
				<el-table-column prop="login_ip" label="登录地址"></el-table-column>
                <el-table-column prop="os_info" label="操作系统"></el-table-column>
                <el-table-column prop="browser_info" label="浏览器"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
				<el-table-column prop="login_time" label="登录时间"></el-table-column>
			</el-table>
		</div>
        <div class="pagination">
      <el-pagination
        v-model:current-page="query.pagenum"
        v-model:page-size="query.pagesize"
        :page-sizes="[10, 20, 30, 40]"
    
        layout="total, sizes, prev, pager, next, jumper"
        :total=loginlog.loginloginfo.count
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      </div>
    </div>
</template>

<script setup lang="ts" name="loginlog">
import { ref, computed,onMounted } from 'vue';
import { useloginlogStore } from '../../store/loginlog';

const loginlog = useloginlogStore();

const query = ref<{username: string,status: string,ip: string,login_time: string,pagenum: number,pagesize: number}>({
	username: '',
    ip:'',
    status:'',
    login_time:'',
    pagenum: 1,
    pagesize: 10
});


// 获取表格数据,点击菜单后才加载
onMounted(() => {
 loginlog.getloginlog(query.value)
})

// 搜索
const handleSearch = () => {
    console.log(query.value)
    loginlog.getloginlog(query.value)
};

// 重置
const handleReset = () => {
    query.value = {
        username: '',
        ip:'',
        status:'',
        login_time:'',
        pagenum: 1,
        pagesize: 10
    };
    loginlog.getloginlog(query.value)
};







//后端分页
const handleSizeChange = (pagesize:any) => {
    query.value.pagenum = 1
    query.value.pagesize = pagesize
    loginlog.getloginlog(query.value)
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pagenum:any) => {
    // console.log('Change', pageNum
    query.value.pagenum = pagenum;
    console.log('上传的参数', query.value)
    loginlog.getloginlog(query.value)
  };



const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
    // 状态列字体颜色
    // columnIndex 列下标
    // rowIndex 行下标
    // row 行
    // column 列
    if (columnIndex === 5 ) {
        if(row.status == '失败'){
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
        color: "#189EFF", 
        };
    }
}


</script>

<style scoped>
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
</style>