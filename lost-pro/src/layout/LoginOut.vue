<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <img class="userimg" src="@/assets/user.jpg" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="updateBtn">修改密码</el-dropdown-item>
        <el-dropdown-item @click="loginOutBtn">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- 修改密码弹框 -->
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
        ref="upRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="default"
      >
        <el-form-item prop="oldPassword" label="原密码">
          <el-input type="password" v-model="addModel.oldPassword"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input type="password" v-model="addModel.password"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="确定密码">
          <el-input type="password" v-model="addModel.newPassword"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </SysDialog>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import useInstance from "@/hooks/useInstance";
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { updatePasswordApi } from "@/api/user/index";
import { userStore } from "@/store/user";
//获取store
const store = userStore();

const upRef = ref<FormInstance>();
const { dialog, onClose, onShow } = useDialog();
const router = useRouter();
const { global } = useInstance();
//退出登录
const loginOutBtn = async () => {
  //确定是否退出
  const confirm = await global.$myconfirm("确定退出登录吗?");
  if (confirm) {
    //清空缓存
    sessionStorage.clear();
    //跳转登录页面
    router.push({ name: "login" });
  }
};
//修改密码点击事件
const updateBtn = () => {
  dialog.height = 180;
  dialog.title = "修改密码";
  onShow();
};
//表单绑定的对象
const addModel = reactive({
  userId: store.getUserId,
  password: "",
  oldPassword: "",
  newPassword: "",
});
//表单验证规则
const rules = reactive({
  oldPassword: [
    {
      trigger: "change",
      required: "true",
      message: "请输入原密码",
    },
  ],
  password: [
    {
      trigger: "change",
      required: "true",
      message: "请输入新密码",
    },
  ],
  newPassword: [
    {
      trigger: "change",
      required: "true",
      message: "请输入确定密码",
    },
  ],
});
//修改密码提交
const commit = () => {
  upRef.value?.validate(async (valid) => {
    //新密码和确定密码判断
    if (addModel.newPassword != addModel.password) {
      ElMessage.warning("新密码和确定密码不一致!");
      return;
    }
    if (valid) {
      let res = await updatePasswordApi(addModel);
      if (res && res.code == 200) {
        //清空缓存
        sessionStorage.clear();
        //跳转登录页面
        router.push({ name: "login" });
      }
    }
  });
};
</script>

<style scoped>
.userimg {
  height: 55px;
  width: 55px;
  border-radius: 50%;
  cursor: pointer;
}
.el-dropdown-link:focus {
  outline: none;
}
</style>
