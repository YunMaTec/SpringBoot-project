<template>
    <el-main>
        <!-- 搜索栏 -->
        <el-form :model="parm"  :inline="true" size="default">
            <el-form-item >
                <el-input placeholder="请输入关键字" v-model="parm.content"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="searchBtn" icon="Search">搜索</el-button>
                <el-button @click="resetBtn" type="danger" plain icon="Close">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :height="tableHeight" :data="tableList" border stripe>
            <el-table-column prop="content" label="反馈内容"></el-table-column>
            <el-table-column prop="createTime" label="反馈时间"></el-table-column>
            <el-table-column  label="操作" width="120px" align="center">
                <template #default="scope">
                    <el-button type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="parm.currentPage"
            :page-sizes="[10,20, 40, 80, 100]"
            :page-size="parm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="parm.total" background>
        </el-pagination>
        
    </el-main>
    
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import {getListApi,deleteApi} from '@/api/suggestion/index'
import useInstance from '@/hooks/useInstance';
import { ElMessage } from 'element-plus';
const {global} = useInstance()
//搜索表单绑定对象
const parm = reactive({
    currentPage:1,
    pageSize:10,
    content:'',
    total:0
})
//表格数据
const tableList = ref([])
//表格高度
const tableHeight = ref(0)
//获取表格数据
const getList = async()=>{
    let res = await getListApi(parm)
    if(res && res.code == 200){
        console.log(res)
        tableList.value = res.data.records;
        parm.total = res.data.total;
    }
}
//删除
const deleteBtn = async(id:string)=>{
    console.log(id)
    const confirm = await global.$myconfirm('确定删除该数据吗?')
    if(confirm){
        let res = await deleteApi(id)
        if(res && res.code == 200){
            ElMessage.success(res.msg)
            getList()
        }
    }
}
//搜索
const searchBtn = ()=>{
    getList()
}
//重置
const resetBtn = ()=>{
    parm.content = ''
    getList()
}
//页容量改变时触发
const sizeChange = (size:number)=>{
    parm.pageSize = size;
    getList()
}
//页数改变时触发
const currentChange = (page:number)=>{
    parm.currentPage = page;
    getList()
}
onMounted(()=>{
    nextTick(()=>{
        tableHeight.value = window.innerHeight - 200
    })
    getList()
})
</script>

<style scoped>

</style>