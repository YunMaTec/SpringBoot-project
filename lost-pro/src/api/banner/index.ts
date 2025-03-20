import http from "@/http";
import {Banner,BannerList} from './BannerModel'
//查询物品
export const getGoodsListApi = ()=>{
    return http.get("/api/banner/selectGoods")
}
//新增
export const addApi = (parm:Banner)=>{
    return http.post("/api/banner",parm)
}
//列表
export const listApi = (parm:BannerList)=>{
    return http.get("/api/banner/list",parm)
}
//上下架
export const upandownApi = (parm:Banner)=>{
    return http.post("/api/banner/upandown",parm)
}
//编辑
export const editApi = (parm:Banner)=>{
    return http.put("/api/banner",parm)
}
//删除
export const deleteApi = (parm:Banner)=>{
    return http.delete(`/api/banner/${parm.banId}`)
}