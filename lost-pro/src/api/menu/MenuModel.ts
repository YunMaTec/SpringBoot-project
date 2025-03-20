//菜单数据类型
export type Menu = {
    menuId: string,
    parentId: string,
    title: string,
    code: string,
    type: string,
    icon: string,
    path: string,
    parentName: string,
    orderNum: string,
}
export type AssignParm = {
    assId:string,
    userId:string
}
//保存权限的数据类型
export type SaveAssignParm = {
    assId:string,
    list:Array<string>
}