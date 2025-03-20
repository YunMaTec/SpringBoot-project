<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchParm" :inline="true" size="default">
      <el-form-item>
        <el-input
          placeholder="请输入分类名称"
          v-model="searchParm.categoryName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button type="danger" plain icon="Close" @click="resetBtn"
          >重置</el-button
        >
        <el-button
          v-permission="['sys:category:add']"
          icon="Plus"
          type="primary"
          @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="orderNum" label="序号"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button
            v-permission="['sys:category:edit']"
            icon="Edit"
            type="primary"
            size="default"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-permission="['sys:category:delete']"
            icon="Delete"
            type="danger"
            size="default"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="searchParm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="searchParm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchParm.total"
      background
    >
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
          ref="form"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="default"
        >
          <el-form-item prop="categoryName" label="分类名称">
            <el-input v-model="addModel.categoryName"></el-input>
          </el-form-item>
          <el-form-item prop="orderNum" label="分类序号">
            <el-input v-model="addModel.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>
  </el-main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import { ElMessage, FormInstance } from "element-plus";
import { addApi, listApi, editApi, deleteApi } from "@/api/category/index";
import { Category } from "@/api/category/CategoryModel";
import { EditType, Title } from "@/type/BaseEnum";
import useInstance from "@/hooks/useInstance";
//获取全局属性
const { global } = useInstance();
//表单ref属性
const form = ref<FormInstance>();
//弹框属性
const { onClose, onShow, dialog } = useDialog();
//搜索表单绑定对象
const searchParm = reactive({
  currentPage: 1,
  pageSize: 10,
  categoryName: "",
  total: 0,
});
//新增分类对象
const addModel = reactive({
  categoryId: "",
  categoryName: "",
  orderNum: "",
});
//表单验证规则
const rules = reactive({
  categoryName: [
    {
      required: "true",
      trigger: "chang",
      message: "请输入分类名称",
    },
  ],
  orderNum: [
    {
      required: "true",
      trigger: "chang",
      message: "请输入分类序号",
    },
  ],
});
//表示
const tags = ref("");
//新增
const addBtn = () => {
  tags.value = "0";
  //弹框属性
  dialog.height = 150;
  //显示弹框
  onShow();
  //清空表单
  form.value?.resetFields();
};
//编辑
const editBtn = (row: Category) => {
  tags.value = "1";
  console.log(row);
  //弹框属性
  dialog.height = 150;
  dialog.title = Title.EDIT;
  //显示弹框
  onShow();
  //数据回显
  nextTick(() => {
    Object.assign(addModel, row);
  });
  //清空表单
  form.value?.resetFields();
};
//删除
const deleteBtn = async (row: Category) => {
  console.log(row);
  const confirm = await global.$myconfirm("确定删除该数据吗?");
  if (confirm) {
    let res = await deleteApi(row);
    if (res && res.code == 200) {
      ElMessage.success(res.msg);
      //刷新列表
      getList();
    }
  }
};
//表单提交
const commit = () => {
  form.value?.validate(async (valid) => {
    if (valid) {
      let res = null;
      if (tags.value == EditType.ADD) {
        res = await addApi(addModel);
      } else {
        res = await editApi(addModel);
      }
      if (res && res.code == 200) {
        ElMessage.success(res.msg);
        //刷新表格
        getList();
        //关闭弹框
        onClose();
      }
    }
  });
};
//重置
const resetBtn = () => {
  searchParm.categoryName = "";
  searchParm.currentPage = 1;
  getList();
};
//搜索
const searchBtn = () => {
  getList();
};
//页容量改变触发
const sizeChange = (size: number) => {
  searchParm.pageSize = size;
  getList();
};
//页数改变时触发
const currentChange = (page: number) => {
  searchParm.currentPage = page;
  getList();
};
//表格数据
const tableList = ref([]);
//表格高度
const tableHeight = ref(0);
//列表数据查询
const getList = async () => {
  let res = await listApi(searchParm);
  if (res && res.code == 200) {
    console.log(res);
    //设置表格数据
    tableList.value = res.data.records;
    searchParm.total = res.data.total;
  }
};

onMounted(() => {
  getList();
  //计算表格高度
  nextTick(() => {
    tableHeight.value = window.innerHeight - 220;
  });
});
</script>

<style scoped></style>
