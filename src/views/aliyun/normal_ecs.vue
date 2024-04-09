<template>
    <div class="container">
        <div class="form-box">
            <el-form ref="ecsRef" 
                :rules="rules" 
                label-width="auto"
                :model="ecsform" 
                >
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
                <el-form-item label="工作环境" prop="env" >
                    <el-radio-group v-model="ecsform.env">
                        <el-radio label="prod">生产环境</el-radio>
                        <el-radio label="gray">灰度环境</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数量" prop="amount" >
                 <el-input-number v-model="ecsform.amount" :min="1" :max="10" @change="handleChange" />
                </el-form-item>
                <el-form-item label="资源" prop="resource" >
                    <el-radio-group v-model="ecsform.resource">
                        <el-radio label="2C/4G/40GB"></el-radio>
                        <el-radio label="4C/8G/40GB" v-if="ecsform.env === 'prod'" ></el-radio>
                        <el-radio label="8C/16G/40GB" v-if="ecsform.env === 'prod'"></el-radio>
                        <el-radio label="16/32G/40GB" v-if="ecsform.env === 'prod'"></el-radio>
                        <el-radio label="32/64G/40GB" v-if="ecsform.env === 'prod'"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item  label="网络" prop="vswith" >
                    <el-select v-model="ecsform.vswith" placeholder="请选择(网段)">
                        <el-option :label="item.name" :value="item.id" v-for="item in filteredVswithList" :key="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item  label="添加安全组" prop="securitygroup">
                    <el-select-v2
                        filterable
                        v-model="ecsform.securitygroup"
                        :options="securityoptions"
                        placeholder="请选择(可多选)"
                        style="width: 240px"
                        multiple
                    />
                </el-form-item>
                <el-form-item  label="添加数据磁盘" prop="disk" >
                    <el-select v-model="ecsform.disk" placeholder="请选择(可选)">
                        <el-option key="1" label="100G" value="100" v-if="ecsform.env === 'prod'" ></el-option>
                        <el-option key="2" label="200G" value="200" v-if="ecsform.env === 'prod'" ></el-option>
                        <el-option key="3" label="500G" value="500" v-if="ecsform.env === 'prod'" ></el-option>
                        <el-option key="4" label="1TB" value="1000" v-if="ecsform.env === 'prod'" ></el-option>
                        <el-option key="5" label="2TB" value="2000" v-if="ecsform.env === 'prod'" ></el-option>
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

<script setup lang="ts" name="normal_ecs">
import { useecsstore } from '../../store/ecs_list';
import {ref,onMounted,computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { node_list,normal_ecs,quick_ecs } from '../../http/api'


//交换机数据
const vswith_list = ref([
    {
    'name': '灰度/172.60.0.0/24',
    'id':'vsw-uf6547h8bvhgobxg4dq6m',
    'env':'gray'
    },
    {
    'name': '灰度/172.60.1.0/24',
    'id':'vsw-uf62ue6x33qki90eg6cw5',
    'env':'gray'
    },
    {
    'name': '生产/172.21.5.0/24',
    'id':'vsw-uf65zpmwdq3ndq7gw9lji',
    'env':'prod'
    },
    {
    'name': '生产/172.21.6.0/24',
    'id':'vsw-uf601vi12vj7mwuv0f1v1',
    'env':'prod'
    },
    {
    'name': 'DB/172.22.2.0/24',
    'id':'vsw-uf6xpfna5y10mj7514f28',
    'env':'prod'
    },
    {
    'name': 'DB/172.22.4.0/24',
    'id':'vsw-uf686iq9e8d4ps8xkxsoa',
    'env':'prod'
    },
    {
    'name': '行情准生产/172.23.1.0/24',
    'id':'vsw-uf66g5mplx73r778vc5x1',
    'env':'prod'
    },
    {
    'name': '运维/172.20.1.0/24',
    'id':'vsw-uf63c5zx146q4e0i1s0cu',
    'env':'prod'
    },
])

//对网络进行过滤，当env选择的时候网络项也进行变化
const filteredVswithList = computed(() => {
  // 根据当前选择的环境过滤专有网络选项
  return vswith_list.value.filter(item => item.env === ecsform.value.env);
});


// 安全组数据
const securitygroup = ref([
    {
    'name': '业务网段默认安全组',
    'id':"sg-uf6c4q8e0301gjqrxa04",
    'env':'prod'
    },
    {
    'name': '业务网段常用端口安全组',
    'id':"sg-uf616vx1rni58o4k5t49",
    'env':'prod'
    },
    {
    'name': '数据库默认安全组',
    'id':"sg-uf6dll1zvk3r734z02m2",
    'env':'prod'
    },
    {
    'name': '准生产网段默认安全组',
    'id':'sg-uf667nv18pvqhankjdzf',
    'env':'prod'
    },
    {
    'name': '运维管理网段默认安全组',
    'id':'sg-uf6exbrhzlc2dh44ni9n',
    'env':'prod'
    },
    {
    'name': '运维管理常用业务安全组',
    'id':'sg-uf636qodaanftwv8x3nx',
    'env':'prod'
    },
    {
    'name': '灰度默认安全组',
    'id':'sg-uf6hj58zvml3c6ey0sdb',
    'env':'gray'
    },

])

const securityoptions = computed(() => {
  const currentEnv = ecsform.value.env;

  return securitygroup.value
    .filter(item => item.env === currentEnv)
    .map(item => ({ value: item.id, label: item.name }));
});



const rules: FormRules = {
    name: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
    env: [{ required: true, message: '请选择工作环境', trigger: 'blur' }],
    amount: [{ required: true, message: '数量默认为1', trigger: 'blur' }],
    nodelist: [{ required: true, message: '请选择jumpserver的节点', trigger: 'blur' }],
    resource: [{ required: true, message: '请选择资源', trigger: 'blur' }],
    vswith: [{ required: true, message: '请选择网络', trigger: 'blur' }],
    securitygroup:[{ required: true, message: '请选择安全组', trigger: 'blur' }],
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
    securitygroup:[],
    disk:'',
    vswith:'',
    env:'prod',
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

//测试提交
const ontest = async(formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate(async (valid) => {
        if (valid) {
            console.log(ecsform.value);
            const res = await normal_ecs(ecsform.value);
            ElMessage.success(res.data.data.Message);
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



</script>

<style scoped lang="less">      
.el-input {
  width: 400px;
}

</style>    
