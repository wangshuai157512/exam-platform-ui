import request from "@/utils/request.js";

// 发证机关分页列表
export function getPageList(data) {
  return request({
    url: "/sys-fzjg/list",
    method: "post",
    data: data
  });
}

// 发证机关新增
export function authorNewAdd(data) {
  return request({
    url: "/sys-fzjg/add",
    method: "post",
    data: data
  });
}

// 机关下拉查询
export function getStatus() {
  return request({
    url: "/sys-fzjg/simple",
    method: "post"
  });
}

// 发证机关修改
export function authorUpdate(data) {
  return request({
    url: "/sys-fzjg/update",
    method: "post",
    data: data
  });
}

// 考场信息新增
export function examRoomNewAdd(data) {
  return request({
    url: "/examroom/add",
    method: "post",
    data: data
  });
}

// 考场信息下载
export function examRoomDownLoad(data) {
  return request({
    url: "/examroom/downLoad",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 考场信息详情
export function examRoomInfo(data) {
  return request({
    url: "/examroom/info",
    method: "post",
    data: data
  });
}

// 考场信息列表
export function examRoomPageList(data) {
  return request({
    url: "/examroom/list",
    method: "post",
    data: data
  });
}

// 考场信息修改
export function examRoomUpdate(data) {
  return request({
    url: "/examroom/update",
    method: "post",
    data: data
  });
}

// 考试员信息新增
export function examStaffNewAdd(data) {
  return request({
    url: "/drvexaminer/add",
    method: "post",
    data: data
  });
}

// 考试员信息分页列表
export function examStaffPageList(data) {
  return request({
    url: "/drvexaminer/list",
    method: "post",
    data: data
  });
}

// 考试员信息修改
export function examStaffUpdate(data) {
  return request({
    url: "/drvexaminer/update",
    method: "post",
    data: data
  });
}

// 考试员信息详情
export function examStaffInfo(data) {
  return request({
    url: "/drvexaminer/info",
    method: "post",
    data: data
  });
}

// 考试员信息下载
export function examStaffDown(data) {
  return request({
    url: "/drvexaminer/download",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 管理部门表分页列表
export function deptPageList(data) {
  return request({
    url: "/glbm/list",
    method: "post",
    data: data
  });
}

// 管理部门表分页列表
export function deptNewAdd(data) {
  return request({
    url: "/glbm/add",
    method: "post",
    data: data
  });
}

// 管理部门表分页列表
export function deptUpdate(data) {
  return request({
    url: "/glbm/update",
    method: "post",
    data: data
  });
}

// 部门下拉树列表
export function deptTreeSelect() {
  return request({
    url: "/glbm/treeselect",
    method: "GET"
  });
}

// 管理部门表删除
export function deptRemove(data) {
  return request({
    url: "/glbm/remove",
    method: "post",
    data: data
  });
}

// 驾校信息列表
export function examSchoolPageList(data) {
  return request({
    url: "/drvschool/list",
    method: "post",
    data: data
  });
}

// 驾校信息新增
export function examSchoolNewAdd(data) {
  return request({
    url: "/drvschool/add",
    method: "post",
    data: data
  });
}

// 驾校信息详情
export function examSchoolInfo(data) {
  return request({
    url: "/drvschool/info",
    method: "post",
    data: data
  });
}

// 驾校信息修改
export function examSchoolUpdate(data) {
  return request({
    url: "/drvschool/update",
    method: "post",
    data: data
  });
}

// 驾校备案下载
export function drvSchoolDownLoad(data) {
  return request({
    url: "/drvschool/download",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 考车信息列表
export function examCarPageList(data) {
  return request({
    url: "/drvcar/list",
    method: "post",
    data: data
  });
}

// 考车信息列表导出
export function examCarExport(data) {
  return request({
    url: "/drvcar/export/list",
    method: "post",
    data: data
  });
}

// 考车信息新增
export function examCarNewAdd(data) {
  return request({
    url: "/drvcar/add",
    method: "post",
    data: data
  });
}

// 考车信息修改
export function examCarUpdate(data) {
  return request({
    url: "/drvcar/update",
    method: "post",
    data: data
  });
}

// 考车信息详情
export function examCarInfo(data) {
  return request({
    url: "/drvcar/info",
    method: "post",
    data: data
  });
}

// 考车信息下载
export function examCarDownLoad(data) {
  return request({
    url: "/drvcar/download",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 考试设备分页列表
export function examToolPageList(data) {
  return request({
    url: "/equipment/list",
    method: "post",
    data: data
  });
}

// 考试设备新增
export function examToolNewAdd(data) {
  return request({
    url: "/equipment/add",
    method: "post",
    data: data
  });
}

// 考试设备详情
export function examToolInfo(data) {
  return request({
    url: "/equipment/info",
    method: "post",
    data: data
  });
}

// 考试设备修改
export function examToolUpdate(data) {
  return request({
    url: "/equipment/update",
    method: "post",
    data: data
  });
}

// 考试设备下载
export function examToolDown(data) {
  return request({
    url: "/equipment/download",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 考试线路新增
export function examLineNewAdd(data) {
  return request({
    url: "/examline/add",
    method: "post",
    data: data
  });
}

// 考试线路分页列表
export function examLinePageList(data) {
  return request({
    url: "/examline/list",
    method: "post",
    data: data
  });
}

// 考试线路修改
export function examLineUpdate(data) {
  return request({
    url: "/examline/update",
    method: "post",
    data: data
  });
}

// 考试线路详情
export function examLineInfo(data) {
  return request({
    url: "/examline/info",
    method: "post",
    data: data
  });
}
// 考试线路下载
export function examLineDown(kcxh) {
  return request({
    url: "/examline/download",
    method: "post",
    data: kcxh
  });
}
// 配置车辆视频信息
export function vehicleInfo(data) {
  return request({
    url: "/vidchannel/setvideoinfo",
    method: "post",
    data: data
  });
}
// 获取车辆视频配置信息
export function getVideoInfo(clxh) {
  return request({
    url: "/vidchannel/videoinfo/" + clxh,
    method: "post"
  });
}
// 获取版本管理数据
export function getSversion(data) {
  return request({
    url: "/sversion/list",
    method: "post",
    data
  });
}
