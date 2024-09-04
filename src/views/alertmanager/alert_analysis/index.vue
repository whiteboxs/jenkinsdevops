<template>
    <div>
        <el-dialog v-model="dialogTableVisible" title="当前告警" width="60%" 
            @close="closeDr()">
        <el-table :data="now_alert.now_alert_info" border class="table" ref="multipleTable" header-cell-class-name="table-header"
         :cell-style="cellStyle" width="auto">
            <el-table-column prop="serverity" label="告警级别" align="center"  ></el-table-column>
            <el-table-column prop="alertname" label="告警类型" align="center"></el-table-column>
            <el-table-column prop="instance" label="告警地址"  align="center"></el-table-column>
            <el-table-column prop="summary" label="告警主题"  align="center"></el-table-column>
            <el-table-column prop="description" label="告警详情"  align="center"></el-table-column>
      </el-table>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
      </template>
    </el-dialog>
    <el-row :gutter="20" class="mgb20">
    <el-col :span="4">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-1">
                    <el-icon class="grid-con-icon"><WarningFilled /></el-icon>
                    <div class="grid-cont-right">
                        <div class="grid-num" @click="goTonowalert" >{{ now_alert.count }}</div>
                        <div>当前告警数</div>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="5">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-1">
                    <el-icon class="grid-con-icon"><Warning /></el-icon>
                    <div class="grid-cont-right">
                        <div class="grid-num"  @click="goToalertlist" >{{allalert.count}}</div>
                        <div>告警总数量(历史)</div>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="5">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-2">
                    <el-icon class="grid-con-icon"><MuteNotification /></el-icon>
                    <div class="grid-cont-right">
                        <div class="grid-num" @click="goTosilences">{{silences.count}}</div>
                        <div>静默消息数量</div>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="5">
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                        <div class="grid-content grid-con-3">
                            <el-icon class="grid-con-icon"><Timer /></el-icon>
                            <div class="grid-cont-right">
                                <div class="grid-num" @click="goTosilences_policy">{{silences_policy.count}}</div>
                                <div>静默策略数量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            <el-col :span="5">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                    <div class="grid-content grid-con-4">
                        <el-icon class="grid-con-icon"><Link /></el-icon>
                        <div class="grid-cont-right">
                            <div class="grid-num" @click="goToalertgroup">{{ alertwebgroup.count }}</div>
                            <div>告警群组数量</div>
                        </div>
                    </div>
                </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mgb20">
        <el-col :span="12">
            <el-card shadow="hover">
                <alert_type_chart /> 
               </el-card>
        </el-col>
        <el-col :span="12">
            <el-card shadow="hover">
                <bar_chart />  
                </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
        <el-col :span="12">
            <el-card shadow="hover">
                <line_chart /> 
                </el-card>
        </el-col>
        <el-col :span="12">
            <el-card shadow="hover">
                <pie_chart />  
                </el-card>
        </el-col>
    </el-row>
      </div>
  </template>



<script setup lang="ts" >
import { useRouter } from 'vue-router';
import { onMounted, ref} from 'vue'
import { useallalertstore } from '@/store/alert/alertlist';
import { usealertwebgroupStore } from '@/store/alert/alertwebgroup';
import { usesilences_policyStore } from '@/store/alert/silences_policy';
import { useallsilencesstore } from '@/store/alert/silences';
import { usenow_alertStore } from '@/store/alert/now_alert';
import pie_chart from './pie_chart.vue'
import line_chart from './line_chart.vue'
import alert_type_chart from './alert_type_chart.vue'
import bar_chart from './bar_chart.vue'

const router = useRouter();
const alertwebgroup = usealertwebgroupStore();
const allalert = useallalertstore();
const silences_policy = usesilences_policyStore();
const silences = useallsilencesstore();
const now_alert = usenow_alertStore()

// 获取表格数据,点击菜单后才加载
onMounted(() => {
    allalert.getalertlist(query.value)
    silences_policy.getsilences_policy(query.value)
    alertwebgroup.getalertwebgroup(query.value)
    silences.getsilenceslist(query.value)
    now_alert.get_now_alert()
   
})

const query = ref<any>({
    pagenum: 1,
    pagesize: 10
});



const goToalertlist = () => {
    router.push('/alertlist')
}

const goTosilences_policy = () => {
    router.push('/silences_policy')
}

const goTosilences = () => {
    router.push('/silences')
}
const goToalertgroup =()=>{
    router.push('/alertwebgroup')
}



const dialogTableVisible = ref(false)
//当前告警菜单按钮功能
const closeDr=() =>{
    dialogTableVisible.value=false
}
// 当前告警菜单按钮关闭
const handleClose = () => {
    // 关闭对话框
    dialogTableVisible.value = false;
}

const goTonowalert = () => {
    // 打开会话框
    dialogTableVisible.value = true
}



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
        if (columnIndex === 4) {
            return {
            color: "#189EFF", 
            fontWeight: 'bold'
            };
        }
}


</script >



<style scoped>

.mgb20 {
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
	font-size: 18px;
	color: #999;
}

.grid-num {
	font-size: 18px;
	font-weight: bold;
    cursor: pointer;  /* 悬停手指样式 */
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 80px;
	color: #fff;
}




.grid-con-1 .grid-con-icon {
	background: rgb(242, 94, 67);
}


.grid-con-1 .grid-num {
	color:  rgb(242, 94, 67);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-3 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-4 .grid-con-icon {
	background: rgb(241, 169, 13);
}

.grid-con-4 .grid-num {
	color: rgb(241, 169, 13);
}

</style>
