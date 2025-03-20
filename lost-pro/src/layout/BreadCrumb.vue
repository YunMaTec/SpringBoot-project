<template>
  <el-breadcrumb class="bred" separator="/">
    <el-breadcrumb-item v-for="item in tabs">{{ item.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, watch } from 'vue';
import { useRoute,RouteLocationMatched } from 'vue-router';
//获取当前路由
const route = useRoute()
//定义面包屑导航数据类型
const tabs : Ref<RouteLocationMatched[]> = ref([])
//获取面包屑数据
const getBreadcrumb = ()=>{
  // console.log(route)
  // console.log(tabs)
  let mached = route.matched.filter((item)=>item.meta && item.meta.title)
  // console.log(mached)
  const first = mached[0]
  if(first.path !='/home'){
    mached = [{path:'/home',meta:{title:'首页'}} as any].concat(mached)
  }
  tabs.value = mached;
}
watch(
  ()=>route.path,
  ()=>getBreadcrumb()
)
onMounted(()=>{
  getBreadcrumb()
})
</script>

<style scoped lang="scss">
//修改字体颜色
:deep(.el-breadcrumb__inner) {
  color: #fff !important;
}
.bred {
  margin-left: 20px;
}
// 修改字体大小
:deep(.el-breadcrumb__item) {
  font-size: 15px !important;
}
</style>
