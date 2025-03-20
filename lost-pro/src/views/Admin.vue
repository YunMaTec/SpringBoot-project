<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchParm" :inline="true" size="default">
      <el-form-item>
        <el-input
          placeholder="请输入姓名"
          v-model="searchParm.nickName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button icon="Close" @click="resetBtn" type="danger" plain>重置</el-button>
        <el-button v-permission="['sys:admin:add']" icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="nickName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          <el-tag v-if="scope.row.sex == '1'" type="danger" size="default">女</el-tag>
          <el-tag v-if="scope.row.sex == '0'" type="success" size="default">男</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="username" label="账户"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status == '1'" type="danger" size="default">停用</el-tag>
          <el-tag v-if="scope.row.status == '0'" type="success" size="default">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="450" align="center">
        <template #default="scope">
         <el-button v-permission="['sys:admin:edit']" type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
         <el-button v-permission="['sys:admin:assign']" type="warning" icon="Edit" size="default" @click="assignBtn(scope.row)">分配菜单</el-button>
         <el-button v-permission="['sys:admin:reset']" type="success" icon="Setting" size="default" @click="resetPasBtn(scope.row)">重置密码</el-button>
         <el-button v-permission="['sys:admin:delete']" type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="searchParm.currentPage"
      :page-sizes="[10,20, 40, 80, 100]"
      :page-size="searchParm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchParm.total" background>
    </el-pagination>
    
    <!-- 新增弹框 -->
    <SysDialog
      :title="dialog.title"
      :width="dialog.width"
      :height="dialog.height"
      :visible="dialog.visible"
      @onClose="onClose"
      @onConfirm="commit"
    >
      <template v-slot:content>
        <el-form
          :model="addModel"
          ref="addRef"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="default"
        >
          <el-form-item prop="nickName" label="姓名：">
            <el-input
              v-model="addModel.nickName"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="sex" label="性别：">
            <el-radio-group v-model="addModel.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="phone" label="电话：">
            <el-input
              v-model="addModel.phone"
              placeholder="请输入电话"
            ></el-input>
          </el-form-item>
          <el-form-item prop="username" label="账户：">
            <el-input
              v-model="addModel.username"
              placeholder="请输入账户"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：">
            <el-input
              v-model="addModel.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="status" label="状态：">
            <el-radio-group v-model="addModel.status">
              <el-radio :label="'0'">启用</el-radio>
              <el-radio :label="'1'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>
    <!-- 分配菜单 -->
    <AssignTree ref="assignTree"></AssignTree>
  </el-main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import { ElMessage, type FormInstance } from "element-plus";
import { addApi,getListApi,editApi,deleteApi,resetPasswordAdminApi } from "@/api/user/index";
import { User } from "@/api/user/UserModel";
import { Title,EditType } from "@/type/BaseEnum";
import useInstance from '@/hooks/useInstance'
import AssignTree from "./AssignTree.vue";
const assignTree = ref()
//获取全局属性
const {global} = useInstance()
//表单ref属性
const addRef = ref<FormInstance>();
//获取弹框属性
const { dialog, onClose, onShow } = useDialog();
const searchParm = reactive({
  nickName: "",
  currentPage:1,
  pageSize:10,
  total:0
});
//标识：新增和编辑
const tags = ref('')
//新增按钮
const addBtn = () => {
  tags.value = EditType.ADD
  //设置弹框属性
  dialog.title = Title.ADD;
  dialog.height = 300;
  onShow();
  //清空表单
  addRef.value?.resetFields()
};
//表单绑定的对象
const addModel = reactive({
  userId: "",
  username: "",
  password: "",
  nickName: "",
  phone: "",
  sex: "",
  status: "",
});
//表单验证规则
const rules = reactive({
  nickName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
  phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
  username: [{ required: true, message: "请输入账户", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  status: [{ required: true, message: "请选状态", trigger: "blur" }],
});
//提交表单
const commit = () => {
  //表单验证
  addRef.value?.validate(async (valid) => {
    console.log(valid);
    if (valid) {
      //提交表单给接口
      let res = null;
      if(tags.value == EditType.ADD){
        res = await addApi(addModel);
      }else{
        res = await editApi(addModel)
      }
      if (res && res.code == 200) {
        //信息提示
        ElMessage.success(res.msg)
        //刷新表格数据
        getList()
        //关闭弹框
        onClose();
      }
    }
  });
};
//定义表格数据
const tableList = ref([])
//定义表格高度
const tableHeight = ref(0)
//获取表格数据
const getList = async()=>{
  let res = await getListApi(searchParm)
  if(res && res.code == 200){
    //设置数据到表格数据里面
    console.log(res)
    tableList.value = res.data.records;
    //设置分页总条数
    searchParm.total = res.data.total;
  }
}
//编辑
const editBtn = (row:User)=>{
  tags.value = EditType.EDIT
  //清空表单
  addRef.value?.resetFields()
  console.log(row)
  //设置弹框属性
  dialog.title = Title.EDIT;
  dialog.height = 300;
  //显示弹框
  onShow()
  //设置回显的数据
  nextTick(()=>{
    Object.assign(addModel,row)
  })
}
//删除
const deleteBtn = async(row:User)=>{
  console.log(row)
  //信息提示
  const confirm = await global.$myconfirm('确定删除该数据吗？')
  if(confirm){
    let res = await deleteApi(row.userId)
    if(res && res.code == 200){
      ElMessage.success(res.msg)
      getList()
    }
  }
}
//页容量改变时触发
const sizeChange = (size:number)=>{
  console.log(size)
  searchParm.pageSize = size;
  getList()
}
//页数改变时触发
const currentChange = (page:number)=>{
  console.log(page)
  searchParm.currentPage = page;
  getList()
}
//搜索按钮
const searchBtn = ()=>{
  getList()
}
//重置按钮
const resetBtn = ()=>{
  searchParm.nickName = ''
  getList()
}
//重置密码
const resetPasBtn = async(row:User)=>{
  const confirm = await global.$myconfirm('确定重置密码吗,重置后密码是【666666】？')
  if(confirm){
    let res = await resetPasswordAdminApi(row)
    if(res && res.code == 200){
      ElMessage.success(res.msg)
    }
  }
}
//分配菜单
const assignBtn = (row:User)=>{
  assignTree.value.show(row)
}
onMounted(()=>{
  //计算表格高度
  nextTick(()=>{
    tableHeight.value = window.innerHeight - 200
  })
  getList()
})
</script>

<style scoped></style>
