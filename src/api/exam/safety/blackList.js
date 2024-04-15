import request from "@/utils/auth-request.js";

// 用户黑名单列表
export function userBlackList(data) {
    return request({
        url: '/user-black/list',
        method: 'post',
        data
    })
}

// 计算机黑名单列表
export function computerBlackList(data) {
    return request({
        url: '/computer-black/list',
        method: 'post',
        data
    })
}