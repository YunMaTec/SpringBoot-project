//定义用户的数据类型:interface 和 type 
export type User = {
    userId:string,
    username:string,
    password:string,
    nickName:string,
    phone:string,
    sex:string,
    status:string
}
//定义列表查询的参数
export type ListParm = {
    currentPage:number,
    pageSize:number,
    nickName:string,
    total?:number
}
export type WxUser = {
    userId:string,
    nickName:string,
    name:string,
    picture:string,
    phone:string,
    username:string,
    password:string
    status:string
}
//定义列表查询的参数
export type WxListParm = {
    currentPage:number,
    pageSize:number,
    phone:string,
    total?:number
}
//登录参数
export type LoginParm = {
    username:string,
    password:string,
    code:string
}
//修改密码参数
export type UpdateParm = {
    userId:string,
    password:string,
    oldPassword:string
}