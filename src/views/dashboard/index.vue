<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20" style="height: 252px">
					<div class="user-info">
						<el-avatar :size="120" :src="baseURL+'/my/view/'+user.userinfo.userPic || baseURL+'/my/view/default.png'" />
						<div class="user-info-cont">
							<div class="user-info-name">{{ name }}</div>
							<div>{{ role }}</div>
						</div>
					</div>
					<div class="user-info-list">
						登录时间：
						<span>{{login_time}}</span>
					</div>
					<div class="user-info-list">
						登录地点：
						<span>中国</span>
					</div>
				</el-card>
				<el-card shadow="hover" style="height: 260px">
					<span class="alert-title">实时告警数量 {{ now_alert.count }}</span>
					<el-table :data="now_alert.now_alert_info" border class="table" ref="multipleTable" header-cell-class-name="table-header"
						 width="auto" height="200" :cell-style="cellStyle" >
							<el-table-column size="small" prop="serverity" label="告警级别" align="center" width="90"></el-table-column>
							<el-table-column size="small" prop="alertname" label="告警类型" align="center" width="100"></el-table-column>
							<el-table-column size="small" prop="instance" label="告警地址"  align="center" width="120"></el-table-column>
							<el-table-column size="small" prop="nodename" label="主机名称"  align="center" width="178"></el-table-column>
							<!-- <el-table-column prop="description" label="告警详情"  align="center"></el-table-column> -->
					</el-table>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<el-icon class="grid-con-icon"><User /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">12</div>
									<div>在线用户数量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<el-icon class="grid-con-icon"><RefreshRight /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">321</div>
									<div>构建数量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<el-icon class="grid-con-icon"><Box /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">5000</div>
									<div>项目数量</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-card shadow="hover" style="height: 411px">
					<alert_type_chart />  
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart';
import { reactive,onMounted } from 'vue';
import { useAuthStore } from '@/store/login';
import { usenow_alertStore } from '@/store/alert/now_alert';
import alert_type_chart from './alert_type_chart.vue'


const baseURL = import.meta.env.VITE_APP_BASE_API

const user =useAuthStore();
const now_alert = usenow_alertStore()

const name = user.userinfo.username;
const role: string = user.userinfo.role_name;
const  login_time: string = user.userinfo.login_time;


onMounted(() => {
now_alert.get_now_alert()
})

const cellStyle = ({ row, column, rowIndex, columnIndex }: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
    if (columnIndex === 0 ) {
        if(row.serverity == 'critical'){
            return {
            color: "#F56C6C", 
            fontWeight: 'bold'
            };
            }else
            return {
            color: "#E6A23C", 
            fontWeight: 'bold'
            };
        }
        if (columnIndex === 1) {
            return {
            color: "#189EFF", 
            };
        }
}

const options = {
	type: 'bar',
	title: {
		text: '最近一周各项目构建图'
	},
	xRorate: 25,
	labels: ['周一', '周二', '周三', '周四', '周五'],
	datasets: [
		{
			label: '后管',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '龙腾',
			data: [164, 178, 190, 135, 160]
		},
		{
			label: '智投',
			data: [144, 198, 150, 235, 120]
		}
	]
};
const options2 = {
	type: 'line',
	title: {
		text: '最近几个月各项目构建趋势图'
	},
	labels: ['6月', '7月', '8月', '9月', '10月'],
	datasets: [
		{
			label: '后管',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '龙腾',
			data: [164, 178, 150, 135, 160]
		},
		{
			label: '智投',
			data: [74, 118, 200, 235, 90]
		}
	]
};

</script>

<style scoped>
.el-row {
	margin-bottom: 20px;
}

.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 20px;
}

.table  {
  font-size: 11px; /* 设置表格单元格的字体大小 */
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.schart {
	width: 100%;
	height: 300px;
}


.alert-title {
    font-weight: bold;
    margin-bottom: 5px; /* 或使用 padding-bottom: 5px; */
    position: relative;
    font-size: 16px;
    color: #333;
    padding-left: 10px;
    top: -7px;
}


</style>
