//banner数据类型
export type Banner = {
    banId: string,
    goodsId: string,
    title: string,
    images: string,
    status: string,
    orderNum: string
}
//列表据类型
export type BannerList = {
    currentPage:number,
    pageSize:number,
    title:string
}