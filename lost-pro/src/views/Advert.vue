<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :model="searchParm" :inline="true" size="default">
      <el-form-item>
        <el-input
          placeholder="请填写标题"
          v-model="searchParm.title"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button type="danger" plain icon="Close" @click="resetBtn"
          >重置</el-button
        >
        <el-button icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="images" label="物品图片">
        <template #default="scope">
          <el-image
            v-if="scope.row.images"
            style="width: 100px; height: 60px"
            :src="scope.row.images.split(',')[0]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="上下架">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'1'"
            :inactive-value="'0'"
            :before-change="beforeChange"
            @change="statusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="序号"></el-table-column>
      <el-table-column  label="操作" width="220" align="center">
        <template #default="scope">
          <el-button icon="Edit" type="primary" size="default" @click="editBtn(scope.row)">编辑</el-button>
        <el-button icon="Delete" type="danger" size="default" @click="deleteBtn(scope.row)">删除</el-button>
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
    
  </el-main>
  <!-- 弹框 -->
  <SysDialog
    :title="dialog.title"
    :visible="dialog.visible"
    :width="dialog.width"
    :height="dialog.height"
    @onClose="onClose"
    @onConfirm="commit"
  >
    <template v-slot:content>
      <el-form
        :model="addModel"
        ref="addForm"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="default"
      >
        <el-form-item label="标题">
          <el-input v-model="addModel.title"></el-input>
        </el-form-item>
        <el-form-item label="物品">
          <el-select
            style="width: 100%"
            v-model="addModel.goodsId"
            class="m-2"
            placeholder="请选择物品"
            size="large"
          >
            <el-option
              v-for="item in selectList"
              :key="item['value']"
              :label="item['label']"
              :value="item['value']"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model="addModel.orderNum"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态：">
            <el-radio-group v-model="addModel.status">
              <el-radio :label="'0'">下架</el-radio>
              <el-radio :label="'1'">上架</el-radio>
            </el-radio-group>
          </el-form-item>
        <el-form-item>
          <UploadImage
            ref="upImgRef"
            :old-url="oldUrl"
            :file-list="fileList"
            @getImg="getImg"
          ></UploadImage>
        </el-form-item>
      </el-form>
    </template>
  </SysDialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import SysDialog from "@/components/SysDialog.vue";
import UploadImage from "@/components/UploadImage.vue";
import useDialog from "@/hooks/useDialog";
import { ElMessage, FormInstance } from "element-plus";
import type { UploadUserFile } from "element-plus";
import { NewType } from "@/type/BaseType";
import { getGoodsListApi,addApi,listApi,upandownApi,editApi,deleteApi } from "@/api/banner/index";
import {Banner} from '@/api/banner/BannerModel'
import useInstance from "@/hooks/useInstance";
import { EditType } from "@/type/BaseEnum";
//获取全局属性
const {global} = useInstance()
//图片上传的ref属性
const upImgRef = ref();
//图片初始值
const fileList = ref<Array<UploadUserFile>>([]);
//回显的图片
const oldUrl = ref<Array<{ url: string }>>([]);
//图片地址
const imgUrl = ref<Array<{ url: string }>>([]);
//表单ref属性
const addForm = ref<FormInstance>();
//获取弹框属性
const { dialog, onClose, onShow } = useDialog();
//搜索参数
const searchParm = reactive({
  currentPage: 1,
  pageSize: 10,
  title: "",
  total: 0,
});
//新增数据绑定对象
const addModel = reactive({
  banId: "",
  goodsId: "",
  title: "",
  images: "",
  status: "",
  orderNum: "",
});
//接收图片上传地址
const getImg = (img: NewType) => {
  console.log("999");
  console.log(img);
  imgUrl.value = oldUrl.value.concat(img.newImgUrl);
  if (img.deleteUrl.length > 0) {
    let newArr = imgUrl.value.filter(
      (x) => !img.deleteUrl.some((item) => x.url === item.url)
    );
    imgUrl.value = newArr;
  }
  // console.log(imgUrl.value)
  //把图片路径拼接为逗号分隔的字符串
  let url = "";
  for (let k = 0; k < imgUrl.value.length; k++) {
    url = url + imgUrl.value[k].url + ",";
  }
  console.log(url);
  addModel.images = url.substring(0, url.lastIndexOf(","));
  console.log(addModel.images);
};
//表单验证规则
const rules = reactive({});
//搜索
const searchBtn = () => {
  getList()
};
//重置
const resetBtn = () => {
  searchParm.currentPage = 1;
  searchParm.title = ''
  getList()
};
const tags = ref('')
//新增
const addBtn = () => {
  tags.value = '0'
  dialog.width = 750;
  dialog.height = 350;
  onShow();
};
//编辑
const editBtn = (row:Banner) =>{
  tags.value = '1'
  //清空图片数据
  imgUrl.value = []
  oldUrl.value = []
  fileList.value = []
  dialog.width = 750;
  dialog.height = 350;
  onShow();
  nextTick(()=>{
    Object.assign(addModel,row)
    if(row.images){
      let imgs = row.images.split(',')
      for(let i=0;i<imgs.length;i++){
        let img = {name:'',url:''}
        img.name = imgs[i]
        img.url = imgs[i]
        fileList.value.push(img)
        oldUrl.value.push({url:imgs[i]})
      }
    }
  })
}
//下拉数据
const selectList = ref([]);
//查询物品下拉数据
const getGoodsList = async () => {
  let res = await getGoodsListApi();
  if (res && res.code == 200) {
    selectList.value = res.data;
  }
};
//提交表单
const commit = async()=>{
  console.log(addModel)
  let res = null;
  if(tags.value == EditType.ADD){
    res = await addApi(addModel)
  }else{
    res = await editApi(addModel)
  }
  if(res && res.code == 200){
    ElMessage.success(res.msg)
    //刷新列表
    getList()
    onClose()
  }
}
//表格高度
const tableHeight = ref(0)
//表格数据
const tableList = ref()
//获取表格数据
const getList = async()=>{
  let res = await listApi(searchParm)
  if(res && res.code == 200){
    tableList.value = res.data.records;
    searchParm.total = res.data.total;
  }
}
//上下架之前的操作
const beforeChange = async()=>{
    const confirm = await global.$myconfirm("确定上下架吗?");
    if(confirm){
        return true;
    }
    return false;
}
//上下架操作
const statusChange = async(row:Banner)=>{
    let res = await upandownApi(row)
    if(res && res.code == 200){
        ElMessage.success(res.msg)
        getList()
    }
}
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
//删除
const deleteBtn = async(row:Banner)=>{
  const confirm = await global.$myconfirm('确定删除该数据吗?')
  if(confirm){
    let res = await deleteApi(row)
    if(res && res.code == 200){
      ElMessage.success(res.msg)
      getList()
    }
  }
}
onMounted(() => {
  getGoodsList();
  getList()
  nextTick(()=>{
    tableHeight.value = window.innerHeight - 220
  })
});
</script>

<style scoped></style>
