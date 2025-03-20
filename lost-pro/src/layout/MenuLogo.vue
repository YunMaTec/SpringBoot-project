<template>
    <div class="logo">
        <img :src="MenuLogo"/>
        <span v-if="show" class="logo-title">{{ title }}</span>
    </div>
</template>

<script setup lang="ts">
import MenuLogo from '@/assets/MenuLogo.png'
import { watch, ref } from 'vue';
import { collapseStore } from '@/store/collapse';
//获取store
const store = collapseStore()
const title = ref('失物招领平台')
//控制标题显示和影藏
// const show = computed(()=>{
//     return store.getCollapse
// })
const show = ref(true)
watch(
    ()=>store.getCollapse,
    (collapsed:boolean)=>{
        if(!collapsed){
            setTimeout(() => {
                show.value = !collapsed;
            }, 300);
        }else{
            show.value = !collapsed;
        }
    }
)
</script>

<style scoped lang="scss">
.logo{
    display: flex;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #2b2f3a;
    align-items: center;
    // border-bottom: 1px solid #dcdfe6;
    img{
        width: 40px;
        height: 40px;
        margin-left: 5px;
        margin-right: 2px;
    }
    .logo-title{
        color: #FFF;
        font-weight: 600;
        font-size: 22px;
        font-family: FangSong;
    }
}
</style>