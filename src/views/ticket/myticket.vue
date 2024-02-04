<template>
  <div>
    <el-card class="manage">
      <el-row :gutter="20" class="header">
        <el-col :span="7">
          <el-input placeholder="请输入" v-model="queryform.keyword"></el-input>
        </el-col>
        <el-button type="primary" icon="Search" @click="onSearch">Search</el-button>
        <el-button type="primary" @click="centerDialogVisible = true">
          +新增工单
        </el-button>
      </el-row>
      <el-dialog v-model="centerDialogVisible" title="创建工单" width="50%" align-center :before-close="handleClose">
        <el-form :model="form" label-width="80px" :rules="rules" ref="addRuleForm">
          <el-form-item label="标题" prop="title"><el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="运行环境" prop="environment_id">
            <el-select v-model="form.environment_id" placeholder="请选择使用环境">
              <el-option :label="item.name" :value="item.id" v-for="item in environmentstore.environmentlist"
                :key="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="工单详情" prop="description">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
          <el-form-item label="经办人" prop="assignee_id">
            <el-select v-model="form.assignee_id" placeholder="请选择经办人">
              <el-option :label="item.name" :value="item.id" v-for="item in assigneestore.assigneelist" :key="item.id" />
            </el-select>
          </el-form-item>
          <el-upload 
            ref="upload" 
            class="upload-files" 
            action="" 
            name="files" 
            multiple :auto-upload="false"
            :file-list="fileList" 
            :on-change="handleChange" 
            style="margin-top: 20px">
            <el-button slot="trigger" 
            type="primary">选取文件</el-button>
          </el-upload>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="submit">创建</el-button>
          </span>
        </template>
      </el-dialog>
      <el-table :data="myticketstore.myticketlist" flex="true" :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        stripe style="width: 100%" max-height="700px" >
        <el-table-column :label="item.label" :prop="item.prop" v-for="(item, index) in list " :key="index"
          min-width="10%" />
          <el-table-column prop="attachment_url" label="附件" min-width="20%" align="center" >
            <template #default="{ row }">
             <template v-if="row.attachment_url">
              <div v-for="(item, index) in row.attachment_url.split(',')" :key="index">
              <img v-if="isImage(item.trim())" :src="item.trim()" width="50" height="50" @click="showDialog(item.trim())" style="cursor: pointer " />
              <a v-else :href="item.trim()" target="_blank" rel="noopener noreferrer">{{ getFileNameFromUrl(item.trim()) }}</a>
            </div>
        </template>
      </template>
        </el-table-column>
        <el-table-column label="操作" width="145px" min-width="10%">
          <template #default="{ row }">
            <el-button type="primary" @click="onEdit(row)" link>编辑</el-button>
            <el-button link type="danger" @click="ticketDelete(row.ticket_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogVisible" width="80%">
        <img :src="dialogImageUrl" width="100%" />
      </el-dialog>
      <el-pagination v-model:current-page="queryform.pagenum" :page-size="queryform.pagesize" :page-sizes="[10, 20, 30, 40]"
        background layout="total, sizes, prev, pager, next, jumper" :total="myticketstore.count"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <ticketEdit ref="editref" @onupdate="myticketstore.getmytickets" />
  </div>
</template>
  
  
  <script setup >
  // import { Search, UploadFilled } from '@/element-plus/icons-vue'
  import { onMounted } from 'vue';
  import { delticket, createticket } from '@/http/api.ts'
  import { useassigneestore } from '@/store/assignee.ts'
  import { useenvironmentstore } from '@/store/environment.ts'
  import { usemyticketstore } from '@/store/userticket.ts'
  import { Plus } from '@element-plus/icons-vue'
  // onMounted(() => {
  // const usestore =useAuthStore();
  //    const userid= usestore.userid;
  //    console.log('id',userid)
  // })
  //经办人
  const assigneestore = useassigneestore()
  //环境
  const environmentstore = useenvironmentstore()
  //工单
  const myticketstore = usemyticketstore()
  
  
  onMounted(() => {
    assigneestore.getassignee(),
      environmentstore.getenvironment(),
      myticketstore.getmytickets()
  })
  
  
  const centerDialogVisible = ref(false)
  
  import { ref, reactive } from 'vue'
  const form = reactive({
    title: '',
    environment_id: '',
    description: '',
    assignee_id: '',
  })
  
  
  //创建工单
  
  const addRuleForm = ref();
  const submit = async () => {
    try {
      await addRuleForm.value.validate();
      if (!form) {
        console.log("表单验证不通过");
        return; // 验证不通过时，停止继续执行下面的代码
      }
      // 如果验证通过，执行表单提交逻辑
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('environment_id', form.environment_id);
      formData.append('description', form.description);
      formData.append('assignee_id', form.assignee_id);
      fileList.value.forEach(item => {
        // 这里有个坑，在将文件append到formData的时候， item其实并不是真是数据 item.raw才是
        formData.append('attachment', item.raw)
      })
      for (let pair of formData.entries()) {
        console.log('xx', pair);
      }
      await createticket(formData);
      console.log("验证成功");
      //清除提交的表单
      addRuleForm.value.resetFields()
      // 关闭窗口和刷新列表
      centerDialogVisible.value = false;
      myticketstore.getmytickets();
    } catch (err) {
      console.log("表单验证出错：" + err);
    }
  };
  
  //关闭按钮
  const handleClose = () => {
    addRuleForm.value.resetFields(); // 清空表单数据
    centerDialogVisible.value = false;
  };
  
  
  const rules = reactive({
    title: [
      {
        required: true, message: '请输入标题', trigger: 'blur'
      }
    ],
    environment_id: [
      {
        required: true, message: '请选择使用环境', trigger: 'change',
      }
    ],
    description: [
      {
        required: true, message: '请输入具体信息', trigger: 'blur',
      }
    ],
    assignee_id: [
      {
        required: true, message: '请选择使用经办人', trigger: 'change',
      }
    ]
  })
  
  const list = [
    {
      label: '创建日期',
      prop: 'create_time'
    },
    {
      label: '工单编号',
      prop: 'ticket_id'
    },
    {
      label: '标题',
      prop: 'title'
    },
    {
      label: '业务环境',
      prop: 'environment'
    },
    {
      label: '工单状态',
      prop: 'status'
    },
    {
      label: '详细内容',
      prop: 'description'
    },
    {
      label: '指派人',
      prop: 'reporter'
    },
    {
      label: '经办人',
      prop: 'assignee'
    },
  ]
  
  
  
  
  //工单删除
  const ticketDelete = async (id) => {
    console.log('ticketDelete', id)
    await delticket(id)
    myticketstore.getmytickets()
  
  }
  
  //工单编辑
  import ticketEdit from '../../components/ticketEdit.vue';
  
  
  
  const editref = ref(null)
  const onEdit = (row) => {
    editref.value.open(row)
  }
  
  //查询
  const onSearch = () => {
    console.log('onSearch', queryform.value)
    queryform.value.pagenum = 1
    queryform.value.pagesize = 10
    myticketstore.getmytickets(queryform.value)
  }
  
  
  //表格里的附件和图片显示判定
  const isImage = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const ext = url.substring(url.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(ext);
  }
  
  const getFileNameFromUrl = (url) => {
    const fileName = url.split('/').pop();
    const extension = fileName.split('.').pop();
    const truncatedName = fileName.substring(0, 5);
    return truncatedName + '.' + extension;
  };
  
  
  //表格里的图片点击预览
  const dialogVisible = ref(false);
  const dialogImageUrl = ref('');
  
  const showDialog = (url) => {
    dialogVisible.value = true;
    dialogImageUrl.value = url;
    window.open(url, 'ImageWindow', 'width=1024,height=768');
  }
  
  //上传
  
  const fileList = ref([])
  
  const handleChange = (file, files) => {
    // file是当前上传的文件，files是当前所有的文件，
    // 不懂得话可以打印一下这两个数据 就能明白
  
    fileList.value = files
  }
  
  
  
  
  //传入后端的查询或者分页参数
  const queryform = ref({
    keyword: '',
    pagenum: 1,
    pagesize: 10
  }); // 当前页数
  
  // 分页
  // const total = ref(0); // 总条数
  
  // //总页数
  //   allticketstore.getallticket();
  //   total.value= allticketstore.allticketlist;
  //   console.log('页数',total.value)
  
  
  
  const handleSizeChange = (pageSize) => {
    queryform.value.pagenum = 1
    queryform.value.pagesize = pageSize
    myticketstore.getmytickets(queryform.value);
  }
  
  // 处理当前页码改变事件
  const handleCurrentChange = (pageNum) => {
    // console.log('Change', pageNum
    queryform.value.pagenum = pageNum;
    console.log('上传的参数', queryform.value)
    myticketstore.getmytickets(queryform.value);
  };
  
  
  </script>
  
  
  <style lang='less' scoped>
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  
  .header {
    padding-bottom: 16px;
    box-sizing: border-box;
  }
  
  .manage {
    height: 100%;
  }
  
  .el-pagination {
    justify-content: center;
    position: relative;
    bottom: -10px;
  }
  
  
  a{
      color: blue;
  }
  
  
  // :deep .el-table__fixed{
  //      height: auto !important; // 让固定列的高自适应
  //      bottom: 0px !important; //固定列默认设置了定位 
  //      right: 10px !important;
  // }
  </style>  
  
  