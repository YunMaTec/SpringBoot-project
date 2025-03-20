import http from "@/http";
import { AssignParm, Menu ,SaveAssignParm} from "./MenuModel";
//获取上级菜单
export const getParentApi = ()=>{
    return http.get("/api/menu/getParent")
}
//新增
export const addApi = (parm:Menu)=>{
    return http.post("/api/menu",parm)
}
//菜单列表
export const listApi = ()=>{
    return http.get("/api/menu/list")
}
//编辑
export const editApi = (parm:Menu)=>{
    return http.put("/api/menu",parm)
}
//删除
export const deleteApi = (parm:Menu)=>{
    return http.delete(`/api/menu/${parm.menuId}`)
}
//分配菜单数据查询
export const getAssignTreeApi = (parm:AssignParm)=>{
    return http.get("/api/menu/getAssignTree",parm)
}
//分配菜单保存
export const assignSaveApi = (parm:SaveAssignParm)=>{
    return http.post("/api/menu/assignSave",parm)
}