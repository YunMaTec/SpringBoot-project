<template>
  <el-main>
    <el-button
      v-permission="['sys:menu:add']"
      icon="Plus"
      type="primary"
      size="default"
      @click="addBtn"
      >新增</el-button
    >
    <!-- 表格 -->
    <el-table
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="menuId"
      default-expand-all
      :data="tableList"
      border
      stripe
    >
      <el-table-column prop="title" label="菜单名称"></el-table-column>
      <el-table-column prop="type" label="菜单类型">
        <template #default="scope">
          <el-tag v-if="scope.row.type == '1'" type="success" size="default"
            >菜单</el-tag
          >
          <el-tag v-if="scope.row.type == '2'" type="danger" size="default"
            >按钮</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标">
        <template #default="scope">
          <el-icon>
            <!-- 动态组件展示图标 -->
            <component v-if="scope.row.icon" :is="scope.row.icon"></component>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="parentName" label="上级菜单"></el-table-column>
      <el-table-column prop="path" label="路由"></el-table-column>
      <el-table-column prop="code" label="权限字段"></el-table-column>
      <el-table-column prop="orderNum" label="序号"></el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template #default="scope" >
          <el-button
            v-permission="['sys:menu:edit']"
            icon="Edit"
            type="primary"
            size="default"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-permission="['sys:menu:delete']"
            icon="Delete"
            type="danger"
            size="default"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
        ref="addRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="default"
      >
        <el-form-item prop="type" label="菜单类型">
          <el-radio-group v-model="addModel.type">
            <el-radio :label="'1'">菜单</el-radio>
            <el-radio :label="'2'">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item prop="parentId" label="上级菜单">
              <el-tree-select
                v-model="addModel.parentId"
                :data="parentTree"
                :render-after-expand="false"
                show-checkbox
                check-strictly
                @check="nodeCheck"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item prop="title" label="菜单名称">
              <el-input
                v-model="addModel.title"
                placeholder="请输入菜单名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="0">
            <el-form-item prop="code" label="权限字段">
              <el-input
                v-model="addModel.code"
                placeholder="请输入权限字段"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item prop="orderNum" label="菜单序号">
              <el-input
                v-model="addModel.orderNum"
                placeholder="请输入菜单序号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="addModel.type != '2'">
          <el-col :span="12" :offset="0">
            <el-form-item prop="path" label="路由">
              <el-input
                v-model="addModel.path"
                placeholder="请输入路由"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item prop="icon" label="菜单图标">
              <el-input
                v-model="addModel.icon"
                placeholder="请输入菜单图标"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </SysDialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import { ElMessage, FormInstance } from "element-plus";
import {
  getParentApi,
  addApi,
  listApi,
  editApi,
  deleteApi,
} from "@/api/menu/index";
import { Menu } from "@/api/menu/MenuModel";
import { EditType } from "@/type/BaseEnum";
import useInstance from "@/hooks/useInstance";
//获取全局属性
const { global } = useInstance();
//表单ref属性
const addRef = ref<FormInstance>();
//获取弹框属性
const { dialog, onClose, onShow } = useDialog();
//表单对象
const addModel = reactive({
  menuId: "",
  parentId: "",
  title: "",
  code: "",
  type: "",
  icon: "",
  path: "",
  parentName: "",
  orderNum: "",
});
//表单验证规则
const rules = reactive({
  type: [
    {
      required: "true",
      message: "请选择菜单类型",
      trigger: "change",
    },
  ],
  parentId: [
    {
      required: "true",
      message: "请选择上级菜单",
      trigger: "change",
    },
  ],
  title: [
    {
      required: "true",
      message: "请填写菜单名称",
      trigger: "change",
    },
  ],
  code: [
    {
      required: "true",
      message: "请填写权限字段",
      trigger: "change",
    },
  ],
  icon: [
    {
      required: "true",
      message: "请填写菜单图标",
      trigger: "change",
    },
  ],
  path: [
    {
      required: "true",
      message: "请填写路由path",
      trigger: "change",
    },
  ],
  orderNum: [
    {
      required: "true",
      message: "请填写菜单序号",
      trigger: "change",
    },
  ],
});
//节点点击之后事件
const nodeCheck = (item: any) => {
  console.log(item);
  addModel.parentName = item.title;
  addModel.parentId = item.menuId;
};
const tags = ref("");
//新增按钮
const addBtn = () => {
  tags.value = "0";
  dialog.height = 250;
  getParent();
  onShow();
  //清空表单
  addRef.value?.resetFields();
};
//编辑
const editBtn = (row: Menu) => {
  tags.value = "1";
  dialog.height = 250;
  getParent();
  onShow();
  //设置编辑的回显
  nextTick(() => {
    Object.assign(addModel, row);
  });
  //清空表单
  addRef.value?.resetFields();
};
//删除
const deleteBtn = async (row: Menu) => {
  console.log(row);
  //信息确认
  const confirm = await global.$myconfirm("确定删除该数据吗?");
  if (confirm) {
    let res = await deleteApi(row);
    if (res && res.code == 200) {
      ElMessage.success(res.msg);
      //刷新表格
      getList();
    }
  }
};
//上级菜单数据
const parentTree = ref([]);
//获取上级菜单数据
const getParent = async () => {
  let res = await getParentApi();
  if (res && res.code == 200) {
    parentTree.value = res.data;
  }
};
//表单提交
const commit = () => {
  addRef.value?.validate(async (valid) => {
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
        onClose();
      }
    }
  });
};
//列表数据
const tableList = ref([]);
//获取列表
const getList = async () => {
  let res = await listApi();
  if (res && res.code == 200) {
    tableList.value = res.data;
  }
};
onMounted(() => {
  getList();
});
</script>

<style scoped></style>
