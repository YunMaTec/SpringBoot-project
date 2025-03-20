import http from "@/http";
import { ListParm,Goods } from './GoodsModel'
//列表
export const getListApi = (parm:ListParm)=>{
    return http.get("/api/goods/list",parm)
}

//删除
export const deleteApi = (parm:Goods)=>{
    return http.post("/api/goods/delete",parm)
}
//上下架
export const upandownApi = (parm:Goods)=>{
    return http.post("/api/goods/upandown",parm)
}
//设置热推
export const setIndexApi = (parm:Goods)=>{
    return http.post("/api/goods/setIndex",parm)
}