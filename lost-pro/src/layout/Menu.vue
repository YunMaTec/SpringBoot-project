<template>
  <MenuLogo></MenuLogo>
  <el-menu
    background-color="#304156"
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    router
    :collapse="isCollapse"
  >
    <el-menu-item v-for="item in menuList" :index="item['path']">
      <el-icon>
        <!-- 动态组件 -->
        <component :is="item['icon']"></component>
      </el-icon>
      <template #title>{{ item['title'] }}</template>
    </el-menu-item>
    <!-- <el-menu-item index="/admin">
      <el-icon><Avatar /></el-icon>
      <template #title>管理员管理</template>
    </el-menu-item>
    <el-menu-item index="/user">
      <el-icon><UserFilled /></el-icon>
      <template #title>用户管理</template>
    </el-menu-item>
    <el-menu-item index="/menu">
      <el-icon><Menu /></el-icon>
      <template #title>菜单管理</template>
    </el-menu-item>
    <el-menu-item index="/category">
      <el-icon><Operation /></el-icon>
      <template #title>物品分类</template>
    </el-menu-item>
    <el-menu-item index="/lost">
      <el-icon><Memo /></el-icon>
      <template #title>失物列表</template>
    </el-menu-item>
    <el-menu-item index="/claim">
      <el-icon><Monitor /></el-icon>
      <template #title>招领列表</template>
    </el-menu-item>
    <el-menu-item index="/lostOrder">
      <el-icon><Calendar /></el-icon>
      <template #title>失物订单</template>
    </el-menu-item>
    <el-menu-item index="/claimOrder">
      <el-icon><Edit /></el-icon>
      <template #title>招领订单</template>
    </el-menu-item>
    <el-menu-item index="/advert">
      <el-icon><Edit /></el-icon>
      <template #title>广告管理</template>
    </el-menu-item>
    <el-menu-item index="/feedback">
      <el-icon><Edit /></el-icon>
      <template #title>反馈管理</template>
    </el-menu-item> -->
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {  useRoute } from 'vue-router'
import MenuLogo from './MenuLogo.vue';
import { collapseStore } from '@/store/collapse';
import { userStore } from '@/store/user/index';
//获取store
const store = collapseStore()
//获取用户的store
const ustore = userStore()
//获取菜单数据
const menuList = computed(()=>{
  return ustore.getMenuList
})
//菜单搜索的属性
const isCollapse = computed(()=>{
  return store.getCollapse
})
const route = useRoute()
//当前激活的路由,就是当前路由的path
const defaultActive = computed(()=>{
  return route.path
})
</script>

<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 230px;
  min-height: 400px;
}
.el-menu {
  border-right: none!important;
}
.el-menu .el-menu-item {
  color: #bfcbd9;
  font-size: 15px;
  font-weight: bold;
}
.el-menu-item.is-active {
  color: #f07810 !important;
  background-color: #1f2d3d !important;
}
/* 鼠标移动菜单的颜色 */

:deep(.el-menu-item:hover) {
  background-color: #001528 !important;
}
</style>
