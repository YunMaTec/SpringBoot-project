//分类数据类型
export type Category = {
    categoryId:string,
    categoryName:string,
    orderNum:string
}
//列表据类型
export type CategoryList = {
    currentPage:number,
    pageSize:number,
    categoryName:string
}