import request from "@/utils/request.js";

// 科目考试结果信息表分页列表
export function getExamResultPageList(data) {
  return request({
    url: "/examresult/list",
    method: "post",
    data
  });
}

// 科目考试结果信息表分页列表
export function getExamResultExport(data) {
  return request({
    url: "/examresult/export",
    method: "post",
    data
  });
}

// 科目考试结果信息表详情
export function getExamResultInfo(data) {
  return request({
    url: "/examresult/info",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data
  });
}

// 成绩单预览
export function getExamView(ksxh) {
  return request({
    url: "/examresult/preview/" + ksxh,
    method: "get"
  });
}

// 视频回放
export function getExamVideoPlay(ksxh) {
  return request({
    url: "/examresult/videoViewPlay/" + ksxh,
    method: "get"
  });
}

// 项目视频回放
export function getExamXVideoPlay(xmksxh) {
  return request({
    url: "/examresult/videoXMViewPlay/" + xmksxh,
    method: "get"
  });
}

// 考试截图预览
export function getExamViewPhoto(ksxh) {
  return request({
    url: "/examresult/viewPhoto/" + ksxh,
    method: "get"
  });
}

// 项目考试截图预览
export function getExamXViewPhoto(xmksxh) {
  return request({
    url: "/examresult/viewXmPhoto/" + xmksxh,
    method: "get"
  });
}
//异常申请
export function abnormalApply(data) {
  return request({
    url: "/drvexrecord/apply",
    method: "POST",
    data: data
  });
}

//单个轨迹下载/保存xml文件
export function singleDownloadGps(data) {
  return request({
    url: "/examresult/singleDownloadGps",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

//批量轨迹下载
export function batchDownloadGps(data) {
  return request(
    {
      url: "/examresult/batchDownloadGps",
      method: "POST",
      responseType: "blob",
      data: data
    },
    false,
    600000
  );
}
