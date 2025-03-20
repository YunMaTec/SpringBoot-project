<template>
  <el-container class="mycontainer">
    <el-aside class="asside" width="auto">
      <Menu></Menu>
    </el-aside>
    <el-container>
      <el-header class="myheader">
        <div class="header-left">
          <Collapse></Collapse>
          <BreadCrumb></BreadCrumb>
        </div>
        <LoginOut></LoginOut>
      </el-header>
      <el-main class="mymain">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Menu from "./Menu.vue";
import Collapse from "./Collapse.vue";
import BreadCrumb from "./BreadCrumb.vue";
import LoginOut from "./LoginOut.vue";
</script>

<style scoped lang="scss">
.mycontainer {
  height: 100%;
  .asside {
    background-color: #304156;
  }
  .mymain {
    // background-color: tan;
    padding: 0px;
  }
  .myheader {
    background-color: #009688;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
  }
  .header-left{
    display: flex;
    align-items: center;
  }
}
</style>
