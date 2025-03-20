<template>
  <div class="logincontainer">
    <el-form
      class="loginform"
      :model="loginModel"
      ref="loginForm"
      :rules="rules"
      size="large"
    >
      <el-form-item>
        <div class="logintitle">系统登录</div>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          placeholder="请输入账号"
          v-model="loginModel.username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model="loginModel.password"
        ></el-input>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="16" :offset="0">
          <el-form-item prop="code">
            <el-input
              placeholder="请输入验证码"
              v-model="loginModel.code"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item>
            <img @click="imageCode" class="images" :src="img" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 30px">
        <el-col :span="12" :offset="0">
          <el-button @click="commit" class="mybtn" type="primary" size="large"
            >登录</el-button
          >
        </el-col>
        <el-col :span="12" :offset="0">
          <el-button class="mybtn" type="danger" plain size="large"
            >取消</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import { imageCodeApi, loginApi } from "@/api/user/index";
import { userStore } from "@/store/user/index";
import { useRouter } from "vue-router";
const router = useRouter();
//获取store
const store = userStore();
//表单ref属性
const loginForm = ref<FormInstance>();
//表单绑定对象
const loginModel = reactive({
  username: "admin",
  password: "123456",
  code: "",
});
//表单验证规则
const rules = reactive({
  username: [
    {
      required: "true",
      message: "请输入账号",
      trigger: "change",
    },
  ],
  password: [
    {
      required: "true",
      message: "请输入密码",
      trigger: "change",
    },
  ],
  code: [
    {
      required: "true",
      message: "请输入验证码",
      trigger: "change",
    },
  ],
});
//验证码
const img = ref();
//获取验证码
const imageCode = async () => {
  let res = await imageCodeApi();
  if (res && res.code == 200) {
    img.value = res.data;
  }
};
//登录提交
const commit = () => {
  loginForm.value?.validate(async (valid) => {
    if (valid) {
      let res = await loginApi(loginModel);
      if (res && res.code == 200) {
        console.log(res);
        //保存用户id
        store.setUserId(res.data.userId);
        //存储菜单信息
        store.setCodeList(res.data.codeList);
        store.setMenuList(res.data.menuList);
        //存储token
        store.setToken(res.data.token)
        //跳转首页
        router.push({ name: "main" });
      }
    }
  });
};
onMounted(() => {
  imageCode();
});
</script>

<style lang="scss" scoped>
.logincontainer {
  height: 100%;
  background-color: #fff;
  background-image: url("../assets//login.png");
  display: flex;
  justify-content: center;
  align-items: center;
  .loginform {
    height: 320px;
    width: 450px;
    padding: 20px 35px;
    border-radius: 10px;
    background-color: #fff;
    .logintitle {
      display: flex;
      justify-content: center;
      color: #606266;
      width: 100%;
      font-size: 24px;
      font-weight: 600;
    }
    .images {
      height: 40px;
      width: 100%;
      cursor: pointer;
    }
    .mybtn {
      width: 100%;
    }
  }
}
</style>
