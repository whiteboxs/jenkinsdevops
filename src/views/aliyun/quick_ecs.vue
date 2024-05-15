<template>
    <el-row :gutter="20">
    <el-col :span="12">
    <el-card style="max-width: 850px">
    <div class="container">
        <div class="form-box">
            <el-form ref="ecsRef" 
                :rules="rules" 
                :model="ecsform" 
                label-width="auto">
                <el-form-item label="ECS名称" prop="name">
                  <el-input v-model="ecsform.name"  placeholder="例: bry-business-module-user" clearable></el-input>
                </el-form-item>
                <el-form-item label="节点列表" prop="nodelist">
                    <el-select 
                        clearable
                        filterable
                        v-model="ecsform.nodelist" 
                        placeholder="请选择">
                        <el-option :label="item.name" :value="item.id" v-for="item in nodelistform" :key="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="工作环境" >
                    <el-radio-group v-model="ecsform.env">
                        <el-radio label="prod">生产环境</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数量" prop="amount" >
                 <el-input-number v-model="ecsform.amount" :min="1" :max="10" @change="handleChange" />
                </el-form-item>
                <el-form-item label="资源" prop="resource" >
                    <el-radio-group v-model="ecsform.resource">
                        <el-radio label="2C/4G/40GB"></el-radio>
                        <el-radio label="4C/8G/40GB"></el-radio>
                        <el-radio label="8C/16G/40GB"></el-radio>
                        <el-radio label="16/32G/40GB"></el-radio>
                        <el-radio label="32/64G/40GB"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button :icon="Plus" type="primary" @click="onSubmit(ecsRef)">提交</el-button>
                    <el-button :icon="Remove" @click="onReset(ecsRef)">重置</el-button>
                    <el-button :icon="Connection" @click="ontest(ecsRef)">测试提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</el-card>
    </el-col>
    <el-col :span="12">
        <el-card class="card-container" style="width: 700px" >创建ECS实例的步骤：提交创建参数后实现的功能:
        <div  style="height: 300px; max-width: 600px" >
            <el-steps direction="vertical" :active="active" finish-status="success">
            <el-step title="选择ecs创建的参数" />
            <el-step title="提交" />
            <el-step title="自动修改创建实例的名称，启动实例" />
            <el-step title="自动将使用实例名称加入jumpserver" />
            <el-step title="jumpserver中搜索实例名称，访问实例"/>
            <el-step title="ECS管理中可以查询和管理ECS实例" finish-status/>
            </el-steps>
        </div>
        </el-card>
    </el-col>
</el-row>
</template>

<script setup lang="ts" name="quick_ecs">
import {ref,onMounted } from 'vue';
import { ElMessage,ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { node_list,quick_ecs } from '../../http/api'
import { useecsstore } from '../../store/ecs_list';
import {  Plus,Remove,Connection } from '@element-plus/icons-vue';
//步骤index
const active = ref(0)

const options = [
    {
        value: 'guangdong',
        label: '广东省',
        children: [
            {
                value: 'guangzhou',
                label: '广州市',
                children: [
                    {
                        value: 'tianhe',
                        label: '天河区',
                    },
                    {
                        value: 'haizhu',
                        label: '海珠区',
                    },
                ],
            },
            {
                value: 'dongguan',
                label: '东莞市',
                children: [
                    {
                        value: 'changan',
                        label: '长安镇',
                    },
                    {
                        value: 'humen',
                        label: '虎门镇',
                    },
                ],
            },
        ],
    },
    {
        value: 'hunan',
        label: '湖南省',
        children: [
            {
                value: 'changsha',
                label: '长沙市',
                children: [
                    {
                        value: 'yuelu',
                        label: '岳麓区',
                    },
                ],
            },
        ],
    },
];
const rules: FormRules = {
    name: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
    amount: [{ required: true, message: '数量默认为1', trigger: 'blur' }],
    nodelist: [{ required: true, message: '请选择jumpserver的节点', trigger: 'blur' }],
    resource: [{ required: true, message: '请选择资源', trigger: 'blur' }],


};


const num = ref(1)
const handleChange = (value: any) => {
  num.value = value;
  console.log(num.value)
    
}




const ecsRef = ref<FormInstance>();
const ecsform = ref({
    name: '',
    amount: 1,
    nodelist:'',
    resource: '',
    env: 'prod',
    dryRun: 'true',
});


//刷新ecs_list用的
const queryform = ref({
    name: '',
    PageNumber: 1,
    PageSize: 10
}); // 当前页数

//node列表
const nodelistform = ref<any>();
const getnodelist = async () => {
  const res = await node_list()
  nodelistform.value = res.data.node_list
}
onMounted(() => getnodelist())

//ElMessageBox的显示样式,构建 HTML 字符串，将 key 用蓝色标记，value 用红色标记
function formatDataToHTMLString(data: any) {
    let formattedData = '<div style="font-family: monospace; white-space: pre;">';
    if (Array.isArray(data)) {
        data.forEach(item => {
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    formattedData += `<span style="color: blue;">${key}:</span> <span style="color: red;">${item[key]}</span>\n`;
                }
            }
        });
    } else {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formattedData += `<span style="color: blue;">${key}:</span> <span style="color: red;">${data[key]}</span>\n`;
            }
        }
    }
    formattedData += '</div>';
    return formattedData;
}
// 提交
const onSubmit = async(formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate(async (valid) => {
        if (valid) {
            ecsform.value.dryRun = 'false'
            console.log(ecsform.value);
            const res = await quick_ecs(ecsform.value);
            ElMessage.success(res.data.msg);
            if (res.data.msg === 'ECS创建完成'){
                ElMessageBox.alert('ECS创建完成：\n' + formatDataToHTMLString(res.data.ecsinfo),{
                dangerouslyUseHTMLString: true  // 允许在消息框中使用 HTML
                });
                //清除表单信息
                formEl.resetFields(); 
                active.value = 6
                useecsstore().getecs(queryform)
            } else{
                ElMessageBox.alert(`ECS创建失败: ${res.data.msg}`)
            }
        } else {
            return false;
        }
    });
};

// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    active.value = 0
};

//测试提交
const ontest = async(formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate(async (valid) => {
        if (valid) {
            console.log(ecsform.value);
            const res = await quick_ecs(ecsform.value);
            ElMessage.success(res.data.data.Message);
            if (res.data.data.Code === 'DryRunOperation'){
                // 在警告框中显示格式化后的对象属性
                ElMessageBox.alert('测试创建ECS的响应数据:\n' + formatDataToHTMLString(res.data.data),{
                dangerouslyUseHTMLString: true  // 允许在消息框中使用 HTML
                });
                active.value = 6
                //清除表单信息
                //formEl.resetFields(); 
            } else{
                ElMessageBox.alert(`测试创建ECS失败: ${res.data.data.Message}`)
            }
        } else {
            return false;
        }
    });
};

</script>

<style scoped lang="less">      
.el-input {
  width: 400px;
}
.card-container {
    margin-bottom: 20px;  /* 添加卡片底部的外边距，增加与下一个组件之间的间距 */
    color: #F56C6C; /* 将字体颜色设置为红色 */
    font-weight: bold; /* 加粗字体 */

}
</style>    
