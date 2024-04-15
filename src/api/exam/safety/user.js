import request from "@/utils/auth-request.js";

// 用户列表
export function userList(data) {
    return request({
        url: '/system/user/list',
        method: 'post',
        data
    })
}

// 用户增加
export function userAdd(data) {
    return request({
        url: '/system/user/add',
        method: 'post',
        data
    })
}

// 用户修改
export function userEdit(data) {
    return request({
        url: '/system/user/update',
        method: 'post',
        data
    })
}

// 用户重置密码
export function userResetPwd(data) {
    return request({
        url: '/system/user/resetPwd',
        method: 'post',
        data
    })
}

// 用户详情
export function userInfo(data) {
    return request({
        url: '/system/user/info',
        method: 'post',
        data
    })
}

// 用户分配计算机列表
export function computerList(data) {
    return request({
        url: '/system/user/computerList',
        method: 'post',
        data
    })
}

// 用户提交选择的计算机
export function upComputer(data) {
    return request({
        url: '/system/user/grant/computer',
        method: 'post',
        data
    })
}

// 用户解锁
export function userLock(data) {
    return request({
        url: '/system/user/lock',
        method: 'post',
        data
    })
}