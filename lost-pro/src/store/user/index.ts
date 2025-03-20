import { defineStore } from "pinia";
//定义store:第一个参数是唯一的
export const userStore = defineStore('userStore',{
    state:()=>{
        return{
            userId:'',
            menuList:[],
            codeList:[],
            token:''
        }
    },
    getters:{
        getUserId(state){
            return state.userId
        },
        getMenuList(state){
            return state.menuList
        },
        getCodeList(state){
            return state.codeList
        },
        getToken(state){
            return state.token
        }
    },
    actions:{
        setUserId(userId:string){
            this.userId = userId;
        },
        setMenuList(menuList:any){
            this.menuList = menuList;
        },
        setCodeList(codeList:any){
            this.codeList = codeList;
        },
        setToken(token:string){
            this.token = token;
        }
    },
    persist: {
        enabled: true,
        strategies: [
            { storage: sessionStorage, paths: ['userId','menuList','codeList','token'] }
        ]
    }
})