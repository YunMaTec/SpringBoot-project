<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :model="searcParm" :inline="true" size="default">
      <el-form-item>
        <el-input placeholder="请输入电话" v-model="searcParm.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button type="danger" plain icon="Close" @click="resetBtn"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="username" label="账户"></el-table-column>
      <el-table-column prop="status" label="启用状态">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'0'"
            :inactive-value="'1'"
            :before-change="beforeChange"
            @change="statusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template #default="scope">
          <el-button
            v-permission="['sys:user:reset']"
            icon="Setting"
            type="success"
            size="default"
            @click="resetPasBtn(scope.row)"
            >重置密码</el-button
          >
          <el-button
            v-permission="['sys:user:delete']"
            type="danger"
            icon="Delete"
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
      :current-page.sync="searcParm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="searcParm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searcParm.total"
      background
    >
    </el-pagination>
  </el-main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import {
  wxListApi,
  stopStatusApi,
  deleteWxApi,
  resetPasswordApi,
} from "@/api/user/index";
import { WxUser } from "@/api/user/UserModel";
import useInstance from "@/hooks/useInstance";
import { ElMessage } from "element-plus";
//获取全局属性
const { global } = useInstance();
//搜索参数\
const searcParm = reactive({
  currentPage: 1,
  pageSize: 10,
  phone: "",
  total: 0,
});
//表格数据
const tableList = ref([]);
//获取表格数据
const wxList = async () => {
  let res = await wxListApi(searcParm);
  if (res && res.code == 200) {
    console.log(res);
    searcParm.total = res.data.total;
    tableList.value = res.data.records;
  }
};
//启用停用之前的操作
const beforeChange = async () => {
  const confirm = await global.$myconfirm("确定启用或停用吗?");
  if (confirm) {
    return true;
  }
  return false;
};
//启用停用操作
const statusChange = async (row: WxUser) => {
  let res = await stopStatusApi(row);
  if (res && res.code == 200) {
    ElMessage.success(res.msg);
    wxList();
  }
};

//删除
const deleteBtn = async (row: WxUser) => {
  console.log(row);
  const confirm = await global.$myconfirm("确定删除该用户吗?");
  if (confirm) {
    let res = await deleteWxApi(row.userId);
    if (res && res.code == 200) {
      ElMessage.success(res.msg);
      wxList();
    }
  }
};
//页容量改变时触发
const sizeChange = (size: number) => {
  console.log(size);
  searcParm.pageSize = size;
  wxList();
};
//页数改变时触发
const currentChange = (page: number) => {
  console.log(page);
  searcParm.currentPage = page;
  wxList();
};
//搜索
const searchBtn = () => {
  wxList();
};
//重置
const resetBtn = () => {
  searcParm.phone = "";
  searcParm.currentPage = 1;
  wxList();
};
//重置密码
const resetPasBtn = async (row: WxUser) => {
  const confirm = await global.$myconfirm(
    "确定重置密码吗,重置后密码是【666666】？"
  );
  if (confirm) {
    let res = await resetPasswordApi(row);
    if (res && res.code == 200) {
      ElMessage.success(res.msg);
    }
  }
};
//表格高度
const tableHeight = ref(0);
onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 220;
  });
  wxList();
});
</script>

<style scoped></style>
