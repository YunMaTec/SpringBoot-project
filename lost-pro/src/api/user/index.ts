import http from "@/http";
import {UpdateParm,User,ListParm,WxListParm, WxUser,LoginParm} from './UserModel'
//新增
export const addApi = (parm:User)=>{
    return http.post("/api/sysUser",parm)
}
//列表
export const getListApi = (parm:ListParm)=>{
    return http.get("/api/sysUser/getList",parm)
}
//编辑
export const editApi = (parm:User)=>{
    return http.put("/api/sysUser",parm)
}
//删除
export const deleteApi = (userId:string)=>{
    return http.delete(`/api/sysUser/${userId}`)
}
//列表
export const wxListApi = (parm:WxListParm)=>{
    return http.get("/api/wxUser/wxList",parm)
}
//停用启用
export const stopStatusApi = (parm:WxUser)=>{
    return http.post("/api/wxUser/stopStatus",parm)
}
//删除
export const deleteWxApi = (userId:string)=>{
    return http.delete(`/api/wxUser/${userId}`)
}
//后台管理员重置密码
export const resetPasswordAdminApi = (parm:User)=>{
    return http.post("/api/sysUser/resetPassword",parm)
}
//小程序用户重置密码
export const resetPasswordApi = (parm:WxUser)=>{
    return http.post("/api/wxUser/resetPassword",parm)
}
//获取图片验证码
export const imageCodeApi = ()=>{
    return http.post("/api/sysUser/imageCode")
}
//登录
export const loginApi = (parm:LoginParm)=>{
    return http.post("/api/sysUser/login",parm)
}
//密码修改
export const updatePasswordApi = (parm:UpdateParm)=>{
    return http.post("/api/sysUser/updatePassword",parm)
}