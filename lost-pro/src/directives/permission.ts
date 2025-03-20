import { Directive } from "vue";
import { userStore } from "@/store/user";
export const permission: Directive = {
    mounted(el, binding) {
        //获取store
        console.log('1111')
        console.log(el)
        console.log(binding)
        const store = userStore()
        //获取用户所有的权限
        const permissions = store.codeList;
        //获取到按钮上的权限
        const { value } = binding;
        if (value && value instanceof Array && value.length > 0) {
            const permissionRoles = value;
            //判断按钮上的权限是否包含在用户的权限里面
            const hasPermisson = permissions.some((role) => {
                return permissionRoles.includes(role)
            })
            //如果按钮权限不存在，影藏按钮
            if (!hasPermisson) {
                el.style.display = 'none'
            }
        } else {
            throw new Error('need roles! Like v-permission="[\'add\',\'edit\']"')
        }
    }
}