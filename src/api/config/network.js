import initRequest from "@/utils/init-request.js";

// 获取服务ip
export function configGetIp() {
    return initRequest({
        url: "/config/get-ip",
        method: "get",
    });
}

// 查询配置
export function configGetInfo() {
    return initRequest({
        url: "/config/info",
        method: "get",
    });
}

// 测试数据库连接
export function testDb(data) {
    return initRequest({
        url: "/config/test/db",
        method: "post",
        data: data,
    });
}

// 测试redis连接
export function testRedis(data) {
    return initRequest({
        url: "/config/test/redis",
        method: "post",
        data: data,
    });
}

// 保存配置
export function configAdd(data) {
    return initRequest({
        url: "/config/add",
        method: "post",
        data: data,
    });
}

// 启动服务
export function serverStart(data) {
    return initRequest({
            url: "/server/start",
            method: "post",
            data: data,
            isLoading: false
        },
        120000);
}