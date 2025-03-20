import { defineStore } from "pinia";
//定义store:第一个参数是唯一的
export const collapseStore = defineStore('collapseStore',{
    state:()=>{
        return{
            collapse:false
        }
    },
    getters:{
        getCollapse(state){
            return state.collapse
        }
    },
    actions:{
        setCollapse(collapse:boolean){
            this.collapse = collapse;
        }
    }
})