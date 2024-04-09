<template>
    <div class="container">
        <div class="form-box">
            <el-form ref="ecsRef" 
                :rules="rules" 
                :model="ecsform" 
                label-width="auto">
                <el-form-item label="ECS名称" prop="name">
                  <el-input v-model="ecsform.name"  placeholder="例: bry-business-module-user" ></el-input>
                </el-form-item>
                <el-form-item label="节点列表" prop="nodelist">
                    <el-select 
                        v-model="ecsform.nodelist" 
                        placeholder="请选择">
                        <el-option :label="item.name" :value="item.id" v-for="item in nodelistform" :key="item.id" />
                    </el-select>
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
</template>

<script setup lang="ts" name="quick_ecs">
import {ref,onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { node_list,quick_ecs } from '../../http/api'
import { useecsstore } from '../../store/ecs_list';
import {  Plus,Remove,Connection } from '@element-plus/icons-vue';


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
  nodelistform.value = res.data
}
onMounted(() => getnodelist())


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
            useecsstore().getecs(queryform)
        } else {
            return false;
        }
    });
};

// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
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

</style>    
