import request from "@/utils/auth-request.js";

// 角色列表
export function roleList(data) {
    return request({
        url: '/system/role/list',
        method: 'post',
        data
    })
}

// 新增列表
export function roleAdd(data) {
    return request({
        url: '/system/role/add',
        method: 'post',
        data
    })
}

// 新增列表
export function roleEdit(data) {
    return request({
        url: '/system/role/update',
        method: 'post',
        data
    })
}

// 权限列表
export function roleMenuTreeselect(data) {
    return request({
        url: '/system/menu/roleMenuTreeselected',
        method: 'post',
        data
    })
}