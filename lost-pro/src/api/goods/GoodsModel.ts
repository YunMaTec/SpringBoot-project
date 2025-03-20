//定义列表查询的参数
export type ListParm = {
    currentPage:number,
    pageSize:number,
    title:string,
    type:string,
    userName:string,
    total?:number
}
//物品的数据类型
export type Goods = {
    goodsId:string;
    categoryId:string;
    type:string;
    title:string;
    categoryName:string;
    introduce:string;
    address:string;
    userName:string;
    phone:string;
    image:string;
    createTime:string;
    status:string;
    deleteStatus:string;
    sellStatus:string;
}