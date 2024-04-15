import request from "@/utils/auth-request.js";

// 计算机列表
export function computerList(data) {
    return request({
        url: '/computer/list',
        method: 'post',
        data
    })
}

//计算机新增
export function computerAdd(data) {
    return request({
        url: '/computer/add',
        method: 'post',
        data
    })
}

//计算机编辑
export function computerEdit(data) {
    return request({
        url: '/computer/update',
        method: 'post',
        data
    })
}

//计算机锁定，解锁
export function computerLock(data) {
    return request({
        url: '/computer/lock',
        method: 'post',
        data
    })
}

//计算机获取本机ip
export function computerGetIp(data) {
    return request({
        url: '/system/user/profile/get-ip',
        method: 'get'
    })
}