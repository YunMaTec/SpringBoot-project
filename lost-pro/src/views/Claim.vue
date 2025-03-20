<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :model="searchParm" :inline="true" size="default">
      <el-form-item>
        <el-input
          placeholder="请输入物品名称"
          v-model="searchParm.title"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入姓名"
          v-model="searchParm.userName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtn" icon="Search">搜索</el-button>
        <el-button @click="resetBtn" type="danger" plain icon="Close"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="title" label="物品名称"></el-table-column>
      <el-table-column prop="title" label="物品图片">
        <template #default="scope">
          <el-image
            v-if="scope.row.image"
            style="width: 100px; height: 60px"
            :src="scope.row.image.split(',')[0]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="分类"></el-table-column>
      <el-table-column prop="introduce" label="简介"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="userName" label="联系人"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column prop="status" label="上下架">
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
      <el-table-column prop="setIndex" label="是否热推">
        <template #default="scope">
          <el-switch
            v-model="scope.row.setIndex"
            :active-value="'0'"
            :inactive-value="'1'"
            :before-change="beforeChange1"
            @change="statusChange1(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sellStatus" label="状态">
        <template #default="scope">
          <el-tag
            v-if="scope.row.sellStatus == '0'"
            type="success"
            size="default"
            >未寻回</el-tag
          >
          <el-tag
            v-if="scope.row.sellStatus == '1'"
            type="danger"
            size="default"
            >已寻回</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button
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
  </el-main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { getListApi, deleteApi, upandownApi,setIndexApi } from "@/api/goods/index";
import { Goods } from "@/api/goods/GoodsModel";
import useInstance from "@/hooks/useInstance";
import { ElMessage } from "element-plus";
//获取全局属性
const { global } = useInstance();
//搜索参数
const searchParm = reactive({
  currentPage: 1,
  pageSize: 10,
  title: "",
  type: "1",
  userName: "",
  total: 0,
});
//表格数据
const tableList = ref([]);
//获取表格数据
const getList = async () => {
  let res = await getListApi(searchParm);
  if (res && res.code == 200) {
    console.log(res);
    tableList.value = res.data.records;
    searchParm.total = res.data.total;
  }
};
//删除
const deleteBtn = async (row: Goods) => {
  console.log(row);
  const confirm = await global.$myconfirm("确定删除该数据吗?");
  if (confirm) {
    let res = await deleteApi(row);
    if (res.code == 200) {
      ElMessage.success(res.msg);
      getList();
    }
  }
};
//上下架之前的操作
const beforeChange = async () => {
  const confirm = await global.$myconfirm("确定上下架吗?");
  if (confirm) {
    return true;
  }
  return false;
};
//上下架操作
const statusChange = async (row: Goods) => {
  let res = await upandownApi(row);
  if (res && res.code == 200) {
    ElMessage.success(res.msg);
    getList();
  }
};
//热推之前的操作
const beforeChange1 = async()=>{
    const confirm = await global.$myconfirm("确定操作吗?");
    if(confirm){
        return true;
    }
    return false;
}
//热推操作
const statusChange1 = async(row:Goods)=>{
    let res = await setIndexApi(row)
    if(res && res.code == 200){
        ElMessage.success(res.msg)
        getList()
    }
}
//页容量改变时触发
const sizeChange = (size: number) => {
  console.log(size);
  searchParm.pageSize = size;
  getList();
};
//页数改变时触发
const currentChange = (page: number) => {
  console.log(page);
  searchParm.currentPage = page;
  getList();
};
//搜索按钮
const searchBtn = () => {
  getList();
};
//重置按钮
const resetBtn = () => {
  searchParm.title = "";
  searchParm.userName = "";
  getList();
};
//表格高度
const tableHeight = ref(0);
onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 220;
  });
  getList();
});
</script>

<style scoped></style>
