import request from "@/utils/request.js";
//参数设置新增
export function parameterAdd(data) {
  return request({
    url: "/sys-config/add",
    method: "POST",
    data: data,
  });
}
//列表
export function parameterlist(data) {
  return request({
    url: "/sys-config/list",
    method: "POST",
    data: data,
  });
}
//修改
export function parameterupdate(data) {
  return request({
    url: "/sys-config/update",
    method: "POST",
    data: data,
  });
}

// 参数详情
export function sysConfigInfo(configKey) {
  return request(
    {
      url: "/sys-config/info",
      method: "POST",
      data: { configKey },
    },
    true
  );
}
