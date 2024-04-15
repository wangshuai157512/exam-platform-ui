import request from "@/utils/request.js";
// import req from "@/utils/auth-request.js";

// function request(handle) {
//   const pathname = window.location.pathname;
//   return pathname == "/system/dict" ? authReq(handle) : req(handle);
// }

// 查询字典数据列表
export function listData(data) {
  return request({
    url: "/dict/data/list",
    method: "post",
    data: data,
  });
}

// 查询字典数据详细
export function getData(data) {
  return request({
    url: "/dict/data/info",
    method: "post",
    data: data,
  });
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: "/system/dict/data/type/" + dictType,
    method: "get",
  });
}

// 新增字典数据
export function addData(data) {
  return request({
    url: "/dict/data/add",
    method: "post",
    data: data,
  });
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: "/dict/data/update",
    method: "post",
    data: data,
  });
}

// 删除字典数据
export function delData(data) {
  return request({
    url: "/dict/data/remove",
    method: "post",
    data: data,
  });
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: "/system/dict/data/export",
    method: "get",
    params: query,
  });
}
