<template>
    <div class="container">
        <div class="form-box">
            <el-form ref="ecsmRef" 
                :rules="rules" 
                :model="ecsform" 
                label-width="80px">
                <el-form-item label="ECS名称" prop="ecsname">
                  <el-input v-model="ecsform.ecsname"></el-input>
                </el-form-item>
                <el-form-item label="节点列表" prop="nodelist">
                    <el-select v-model="ecsform.nodelist" placeholder="请选择">
                        <el-option key="1" label="2核4G" value="2核4G"></el-option>
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
                <el-form-item  label="添加数据磁盘" prop="disk" label-width=auto>
                    <el-select v-model="ecsform.nodelist" placeholder="请选择">
                        <el-option key="1" label="100G" value="100"></el-option>
                        <el-option key="2" label="200G" value="200"></el-option>
                        <el-option key="3" label="500G" value="500"></el-option>
                        <el-option key="4" label="1TB" value="1000"></el-option>
                        <el-option key="5" label="2TB" value="2000"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="添加安全组" prop="securitygroup" label-width=auto>
                    <el-select v-model="ecsform.securitygroup" placeholder="请选择">
                        <el-option key="1" label="100G" value="100"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit(ecsRef)">提交</el-button>
                    <el-button @click="onReset(ecsRef)">重置</el-button>
                    <el-button @click="ontest(ecsRef)">测试提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts" name="ecs">

import {ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

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
    ecsname: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
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
    ecsname: '',
    amount: 1,
    nodelist: '',
    resource: '',
    securitygroup:''
});
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            console.log(ecsform);
            ElMessage.success('提交成功！');
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

// 测试提交
const ontest = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
};

</script>

<style scoped lang="less">      
.el-input {
  width: 400px;
}

</style>    
