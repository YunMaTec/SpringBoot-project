import http from "@/http";
import { Category,CategoryList } from "./CategoryModel";
//新增
export const addApi = (parm:Category)=>{
    return http.post("/api/category",parm)
}
//列表
export const listApi = (parm:CategoryList)=>{
    return http.get("/api/category/list",parm)
}
//编辑
export const editApi = (parm:Category)=>{
    return http.put("/api/category",parm)
}
//删除
export const deleteApi = (parm:Category)=>{
    return http.delete(`/api/category/${parm.categoryId}`)
}