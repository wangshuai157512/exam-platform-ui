import request from "@/utils/request.js";
//列表
export function abnormalList(data) {
    return request({
      url: "/drvexrecord/list",
      method: "POST",
      data: data,
    });
  }
  //异常处理
  export function exceptionHandling(data) {
    return request({
      url: "/drvexrecord/handle",
      method: "POST",
      data: data,
    });
  }

