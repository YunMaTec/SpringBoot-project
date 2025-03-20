<template>
  <h1>{{ msg }}</h1>
  <div>666777</div>
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button icon="Plus" @click="addBtn" type="primary">新增</el-button>
    <el-button icon="EditPen" type="success">编辑</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>
  <el-icon>
      <Edit />
    </el-icon>
    <el-icon class="is-loading">
    <Loading />
  </el-icon>
  {{ count }}
</template>
<script setup lang="ts">
import { testStore } from "@/store/test/index";
import { computed } from "vue";
defineProps<{ msg: string }>()
//获取sotre
const store = testStore()
//获取count值
const count = computed(()=>{
  return store.getCount
})
//按钮点击事件
const addBtn = ()=>{
  store.setCount(++store.conunt)
}
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
