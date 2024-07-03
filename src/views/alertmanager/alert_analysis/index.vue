<template>
    <div>
    <el-row :gutter="20" class="mgb20">
    <el-col :span="4">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-1">
                    <el-icon class="grid-con-icon"><WarningFilled /></el-icon>
                    <div class="grid-cont-right">
                        <el-link type="primary" href="http://139.196.146.17/#/alerts">
                        <div class="grid-num">{{ now_alert_list.count }}</div>
                        </el-link>
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
                        <div class="grid-num">{{allalert.count}}</div>
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
                        <div class="grid-num">{{silences.count}}</div>
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
                                <div class="grid-num">{{silences_policy.count}}</div>
                                <div>静默策略数量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            <el-col :span="5">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                    <div class="grid-content grid-con-4">
                        <el-icon class="grid-con-icon"><Share /></el-icon>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{ alertwebgroup.count }}</div>
                            <div>告警群组数量</div>
                        </div>
                    </div>
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
    <el-row :gutter="20" class="mgb20">
        <el-col :span="12">
            <el-card shadow="hover">
                <par_chart />  
                </el-card>
        </el-col>
        <el-col :span="12">
            <el-card shadow="hover">
                <bar_chart />  
                </el-card>
        </el-col>
    </el-row>
      </div>
  </template>



<script setup lang="ts" >
import { useRouter } from 'vue-router';
import { onMounted, ref, computed} from 'vue'
import { useallalertstore } from '@/store/alert/alertlist';
import { usealertwebgroupStore } from '@/store/alert/alertwebgroup';
import { usesilences_policyStore } from '@/store/alert/silences_policy';
import { useallsilencesstore } from '@/store/alert/silences';
import {now_alert} from '@/http/alert/alert'
import pie_chart from './pie_chart.vue'
import line_chart from './line_chart.vue'
import par_chart from './par_chart.vue'
import bar_chart from './bar_chart.vue'


const alertwebgroup = usealertwebgroupStore();
const allalert = useallalertstore();
const silences_policy = usesilences_policyStore();
const silences = useallsilencesstore();


// 获取表格数据,点击菜单后才加载
onMounted(() => {
    allalert.getalertlist(query.value)
    silences_policy.getsilences_policy(query.value)
    alertwebgroup.getalertwebgroup(query.value)
    silences.getsilenceslist(query.value)
    get_now_alert()
})
const now_alert_list = ref<any>([])
const get_now_alert = async () => {
    // 如果有之前的 ECharts 实例，先销毁它  
    const res = await now_alert();
    now_alert_list.value = res.data
    console.log(now_alert_list.value)

}
const query = ref<any>({
    pagenum: 1,
    pagesize: 10
});



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
