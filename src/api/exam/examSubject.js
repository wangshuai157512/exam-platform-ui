import request from "@/utils/request.js";

// 考试名单列表
export function rosterList(data) {
  return request({
    url: "/drvpreasign/list",
    method: "post",
    data: data
  });
}

// 考试名单列表导出
export function rosterExport(data) {
  return request({
    url: "/drvpreasign/export",
    method: "post",
    data: data
  });
}

// 培训驾校下拉
export function drvSchool(data) {
  return request({
    url: "/drvschool/simple",
    method: "post",
    data: data
  });
}

// 考试场次下拉
export function examRoomSelect(data) {
  return request({
    url: "/s-examroom-session/simple",
    method: "post",
    data: data
  });
}

// 考试车下拉
export function drvcarSelect(data) {
  return request({
    url: "/drvcar/simple",
    method: "post",
    data: data
  });
}

// 车辆品牌下拉
export function brandSelect(data) {
  return request({
    url: "/s-cartype-file-config/simple",
    method: "post",
    data: data
  });
}

// 考试名单添加
export function rosterAdd(data) {
  return request({
    url: "/drvpreasign/add",
    method: "post",
    data: data
  });
}

// 考试名单详情
export function rosterDetail(data) {
  return request({
    url: "/drvpreasign/info",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data: data
  });
}

// 获取报名照片
export function applyPhoto(sfzmhm) {
  return request({
    url: "/drvpreasign/getBmZp/" + sfzmhm,
    method: "get",
    isLoading: false
  });
}

// 获取门禁照片
export function entrancePhoto(query) {
  return request({
    url: "/drvpreasign/getMjZp/" + query,
    method: "get",
    isLoading: false
  });
}

// 考试名单认证
export function rosterApprove(data) {
  return request({
    url: "/drvpreasign/verificationPreasign",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data: data
  });
}

// 考试名单下载
export function rosterDownLoad(data) {
  return request(
    {
      url: "/drvpreasign/download",
      method: "post",
      data: data
    },
    false,
    300000
  );
}

// 开考控制列表
export function controlList(data) {
  return request({
    url: "/drvexamroomauth/list",
    method: "post",
    data: data
  });
}

// 开始/停止考试
export function controlExamStatus(data) {
  return request({
    url: "/drvexamroomauth/authExamroom",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 考生排考列表
export function arrangeList(data) {
  return request({
    url: "/drvexamrooorder/list",
    method: "post",
    data
  });
}

// 考生排考暂停考试
export function arrangePause(data) {
  return request({
    url: "/drvexamrooorder/pauseexam",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 考生排考恢复考试
export function arrangeRecover(data) {
  return request({
    url: "/drvexamrooorder/recoverexam",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 考生排考停止考试
export function arrangeStop(data) {
  return request({
    url: "/drvexamrooorder/terminateexam",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 考生排考取消考试
export function arrangeCancel(data) {
  return request({
    url: "/drvexamrooorder/cancanleexam",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 考生排考详情
export function arrangeDetail(data) {
  return request({
    url: "/drvexamrooorder/info",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 人脸认证列表
export function faceList(data) {
  return request({
    url: "/drvverifyvideo/list",
    method: "post",
    data
  });
}

// 人脸人工认证
export function faceVerify(data) {
  return request({
    url: "/drvverifyvideo/verify",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 单个报到
export function preasignReport(data) {
  return request({
    url: "/drvpreasign/preasignReport",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 人脸认证详情
export function faceDeatil(data) {
  return request({
    url: "/drvverifyvideo/info",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 人脸认证获取车载照片
export function vehiclePhoto(id) {
  return request({
    url: "/drvverifyvideo/getVideoImage/" + id,
    method: "get"
  });
}

// 信号检测列表
export function detectionList(data) {
  return request({
    url: "/syscheck/list",
    method: "post",
    data
  });
}

// 信号检测详情
export function detectionDetail(data) {
  return request({
    url: "/syscheck/info",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 考官签名列表
export function signatureList(data) {
  return request({
    url: "/examinersign/list",
    method: "post",
    data
  });
}

// 考官签名上传签名
export function signaturePhoto(data) {
  return request({
    url: "/examinersign/sign",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 考官签名图片上传
export function signatureUpload(data) {
  return request({
    url: "/usersignature/uploadSignature",
    method: "post",
    data
  });
}

// 获取用户编辑签名
export function signatureUser(data) {
  return request({
    url: "/usersignature/getUserSigature",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 考官签名获取签名照片
export function signatureGetKsySign(data) {
  return request({
    url: "/examinersign/getKsySign",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}

// 设置考试原因
export function setExamCause(data) {
  return request({
    url: "/drvexamrooorder/set-exam-cause",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    data
  });
}
// 重新检测
export function retest(data) {
  return request({
    url: "/syscheck/retest",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data
  });
}
// 编辑
export function examineeupdate(data) {
  return request({
    url: "/drvpreasign/examinee/update",
    method: "post",
    data
  });
}