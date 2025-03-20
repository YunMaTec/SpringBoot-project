import { defineStore } from "pinia";
//定义store:第一个参数是唯一的
export const testStore = defineStore('testStore',{
    state:()=>{
        return{
            conunt:0
        }
    },
    getters:{
        getCount(state){
            return state.conunt
        }
    },
    actions:{
        setCount(count:number){
            this.conunt = count;
        }
    }
})