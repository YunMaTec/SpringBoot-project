<template>
  <SysDialog
    :title="dialog.title"
    :width="dialog.width"
    :visible="dialog.visible"
    :height="dialog.height"
    @onClose="onClose"
    @onConfirm="commit"
  >
    <template v-slot:content>
      <el-tree
        ref="assignTeee"
        :data="treeData"
        node-key="menuId"
        :props="defaultProps"
        empty-text="暂无数据"
        :show-checkbox="true"
        :highlight-current="true"
        default-expand-all
        :default-checked-keys="assignTreeChecked"
      ></el-tree>
    </template>
  </SysDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, ElTree } from "element-plus";
import { User } from "@/api/user/UserModel";
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import { getAssignTreeApi, assignSaveApi } from "@/api/menu";
import { userStore } from "@/store/user/index";
//树的ref属性
const assignTeee = ref<InstanceType<typeof ElTree>>();
const defaultProps = {
  children: "children",
  label: "label",
};
//获取store
const store = userStore();
//获取弹框属性
const { dialog, onClose, onShow } = useDialog();
const parm = reactive({
  userId: "",
  assId: "",
});
//树数据
const treeData = ref([]);
//回显的数据
const assignTreeChecked = ref([]);
//提交的数据
const assignParm = reactive({
  assId: "",
  list: [] as string[],
});
//弹框显示
const show = (row: User) => {
  //清空数据
  treeData.value = []
  assignTreeChecked.value = [];
  parm.assId = '';
  parm.userId = '';
  assignParm.assId = '';
  assignParm.list = [];
  console.log(row);
  parm.assId = row.userId;
  parm.userId = store.getUserId;
  assignParm.assId = row.userId;
  //获取树数据
  getAssignTree();
  //设置弹框属性
  dialog.title = "为【" + row.username + "】分配菜单";
  dialog.width = 320;
  dialog.height = 450;
  //获取弹框树的数据

  onShow();
};
//当前组件里面的show方法暴露出去
defineExpose({
  show,
});

//获取树数据
const getAssignTree = async () => {
  let res = await getAssignTreeApi(parm);
  if (res && res.code == 200) {
    //树的数据
    treeData.value = res.data.menuList;
    //用户原来拥有的菜单
    assignTreeChecked.value = res.data.checkList;
    console.log(assignTreeChecked.value)
    //数据回显，判断角色原来是否已经分配过权限，如果有，回显
    if (assignTreeChecked.value.length > 0) {
      let newArr: any = [];
      assignTreeChecked.value.forEach((item) => {
        checked(item, treeData.value, newArr);
      });
      console.log(newArr)
      assignTreeChecked.value = newArr;
    }
  }
};
const checked = (id: number, data: any, newArr: any) => {
  data.forEach((item: any) => {
    if (item.menuId == id) {
      if (item.children && item.children.length == 0) {
        newArr.push(item.menuId);
      }
    } else {
      if (item.children && item.children.length != 0) {
        //递归调用
        checked(id, item.children, newArr);
      }
    }
  });
};

//提交
const commit = async () => {
  console.log(assignTeee.value);
  //选中节点的id
  let checkedkey = assignTeee.value?.getCheckedKeys() as string[];
  console.log(checkedkey);
  //半选节点的id
  let halfChecdkey = assignTeee.value?.getHalfCheckedKeys() as string[];
  console.log(halfChecdkey);
  assignParm.list = checkedkey?.concat(halfChecdkey);
  console.log(assignParm);
  if (assignParm.list.length == 0) {
    ElMessage.warning("请选择要分配的菜单!");
    return;
  }
  //提交数据
  const res = await assignSaveApi(assignParm);
  if (res && res.code == 200) {
    ElMessage.success(res.msg);
    onClose();
  }
};
</script>

<style scoped></style>
