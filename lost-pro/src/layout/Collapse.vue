<template>
    <el-icon :size="30" @click="iconClick" style="cursor: pointer;">
        <!-- 动态组件：需要动态切换组件 -->
        <component :is="status ? Expand : Fold"></component>
    </el-icon>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { collapseStore } from "@/store/collapse/index";
import  {Expand,Fold} from '@element-plus/icons-vue'
//获取store
const store = collapseStore()
//定义切换的状态
const status = computed(()=>{
    return store.getCollapse
})
//切换按钮点击事件
const iconClick = ()=>{
    store.setCollapse(!store.collapse)
}
</script>

<style scoped>

</style>