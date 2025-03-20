<template>
  <el-main>
    <!-- 统计 
    el-row:代表的是一行，一行分为24等分
    -->
    <el-row :gutter="20">
      <el-col :span="6" :offset="0">
        <div class="show-header" style="background: rgb(45, 183, 245)">
          <div class="show-num">{{ total.userCount }}</div>
          <div class="bottom-text">会员总数</div>
        </div>
      </el-col>
      <el-col :span="6" :offset="0">
        <div class="show-header" style="background: rgb(237, 64, 20)">
          <div class="show-num">{{total.suggestionCount}}</div>
          <div class="bottom-text">反馈总数</div>
        </div>
      </el-col>
      <el-col :span="6" :offset="0">
        <div class="show-header">
          <div class="show-num">{{total.lostCount}}</div>
          <div class="bottom-text">失物总数</div>
        </div>
      </el-col>
      <el-col :span="6" :offset="0">
        <div class="show-header" style="background: rgb(255, 153, 0)">
          <div class="show-num">{{total.claimCount}}</div>
          <div class="bottom-text">招领总数</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="12" :offset="0">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span style="font-weight: 600;">最近反馈</span>
            </div>
          </template>
          <div v-for="item in list" class="text item">
            <span style="font-weight: 600;font-size: 14px;">{{ item.content }}</span>
            <span style="font-size: 14px;margin-left: 30px;">{{ item.createTime }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :offset="0">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span style="font-weight: 600;">日历</span>
            </div>
          </template>
          <el-calendar v-model="value" />
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {getListApi,getTotalApi} from '@/api/home/index'
const value = ref(new Date())
//统计
const total = reactive({
  userCount:0,
  lostCount:0,
  claimCount:0,
  suggestionCount:0
})
//查询统计
const getTotal = async()=>{
  let res = await getTotalApi()
  if(res && res.code == 200){
    console.log(res)
    Object.assign(total,res.data)
  }
}
//反馈数据类型
interface Suggestion {
  id:number,
  userId:number,
  content:string,
  createTime:string
}
//反馈数据
const list = ref<Suggestion[]>([])
//反馈列表
const getList = async()=>{
  let res = await getListApi()
  if(res && res.code == 200){
    console.log(res)
    list.value = res.data;
  }
}
onMounted(()=>{
  getTotal()
  getList()
})
</script>

<style scoped>
.bottom-text {
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  height: 25px;
  line-height: 25px;
  text-align: center;
  position: absolute;
  font-weight: 600;
}
.show-header {
  background: #00c0ef;
  color: #fff;
  height: 80px;
  border-radius: 5px;
  position: relative;
}
.show-num {
  font-size: 38px;
  font-weight: 600;
  padding: 5px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin: 30px 10px;
}
:deep(.el-card__body){
  padding: 0px 20px;
}
</style>
