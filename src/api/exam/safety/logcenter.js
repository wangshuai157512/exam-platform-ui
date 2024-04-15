import request from "@/utils/auth-request.js";

// 操作日志查询
export function loginlist(data) {
  return request({
    url: "/monitor/operlog/list",
    method: "POST",
    data: data
  });
}
// 操作日志详情
export function detailslist(data) {
  return request({
    url: "/monitor/operlog/info",
    method: "POST",
    data: data
  });
}
// 操作日志业务类型图表数据
export function typestatistics(data) {
  return request({
    url: "/monitor/operlog/statistics/by/type",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: data
  });
}
// 操作日志业务操作图表数据
export function operationstatistics(data) {
  return request({
    url: "/monitor/operlog/statistics/by/item",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: data
  });
}
// 安全日志列表
export function securitylist(data) {
  return request({
    url: "/monitor/safety-log/list",
    method: "POST",
    data: data
  });
}
// 安全日志详情
export function safetydetailslist(data) {
  return request({
    url: "/monitor/safety-log/info",
    method: "POST",
    data: data
  });
}
// 安全日志业务类型图表数据
export function securitytype(data) {
  return request({
    url: "/monitor/safety-log/statistics/by/type",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: data
  });
}
// 安全日志操作类型图表数据
export function safeoperation(data) {
  return request({
    url: "/monitor/safety-log/statistics/by/item",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: data
  });
}
// 数据库日志列表
export function databaselist(data) {
  return request(
    {
      url: "/db-audit-log/list",
      method: "POST",
      data: data
    },
    300000
  );
}
// 数据库日志详情
export function databasedetails(data) {
  return request({
    url: "/monitor/sys-log/info",
    method: "POST",
    data: data
  });
}
// 数据库日志业务类型图表数据
export function databasetype(data) {
  return request({
    url: "/monitor/sys-log/statistics/by/type",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: data
  });
}
// 数据库日志操作类型图表数据
export function databaseoperation(data) {
  return request({
    url: "/monitor/sys-log/statistics/by/title",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: data
  });
}
//审计日志分页列表
export function auditlogList(data) {
  return request({
    url: "/sys-audit-log/list",
    method: "POST",
    data: data
  });
}
//审计日志详情列表
export function auditlogInfo(data) {
  return request({
    url: "/sys-audit-log/info",
    method: "POST",
    data: data
  });
}
// 审计日志业务类型图表数据
export function auditTypeChart(data) {
  return request({
    url: "/sys-audit-log/statistics/by/type",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: data
  });
}
// 审计日志业务模块图表数据
export function auditOperationChart(data) {
  return request({
    url: "/sys-audit-log/statistics/by/item",
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    data: data
  });
}
// 模块下拉列表
export function moduleList(data) {
  return request({
    url: "/monitor/sys-module/simple",
    method: "POST",
    data: data,
    isHideMsg: true
  });
}
