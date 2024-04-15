import request from "@/utils/request.js";

// 门禁分页列表
export function getAccessPageList(data) {
    return request({
        url: "/drvmjzj/list",
        method: "post",
        isLoading: false,
        data
    });
}

// 门禁详情
export function getAccessInfo(data) {
    return request({
        url: "/drvmjzj/info",
        method: "post",
        data
    });
}