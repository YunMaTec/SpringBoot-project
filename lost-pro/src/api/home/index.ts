import http from "@/http";
//最近反馈列表
export const getListApi = ()=>{
    return http.get("/api/home/getList")
}
//统计
export const getTotalApi = ()=>{
    return http.get("/api/home/getTotal")
}