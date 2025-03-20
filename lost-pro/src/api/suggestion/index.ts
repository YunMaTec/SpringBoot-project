import http from "@/http";
import {ListParm} from './SuggesionModel'
//列表
export const getListApi = (parm:ListParm)=>{
    return http.get("/api/suggestion/getList",parm)
}
//删除
export const deleteApi = (id:string)=>{
    return http.delete(`/api/suggestion/${id}`)
}