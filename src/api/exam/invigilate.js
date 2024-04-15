import request from "@/utils/request.js";

// 查询考试考场
export function getTodayExamRoom() {
  return request({
    url: "/jgcontrol/getTodayExamRoom",
    method: "post"
  });
}

// 查询考试考场对应的考试车
export function getExamCar(data) {
  return request({
    url: "/jgcontrol/getExamCar",
    method: "post",
    data
  });
}

// 查询考试考场对应考试车型
export function getExamCarType(data) {
  return request({
    url: "/jgcontrol/getExamCarType",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data
  });
}

// 查询当前考场预警信息
export function getWaringInfo(kcxh) {
  return request({
    url: "/jgcontrol/getWaringInfo",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: { kcxh: kcxh },
    isLoading: false
  });
}

// 查询考试车当前考生基本信息
export function getExamInfo(data) {
  return request({
    url: "/jgcontrol/getExamInfo",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data,
    isLoading: false
  });
}

// 查询考试车截图
export function getExamPhoto(ksxh) {
  return request({
    url: "/jgcontrol/getExamLastPhoto",
    method: "post",
    data: { ksxh: ksxh }
  });
}

// 考试车考试过程信息
export function getExamProcInfo(ksxh) {
  return request({
    url: "/jgcontrol/getExamProcInfo",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: { ksxh },
    isLoading: false
  });
}

// 查询考试车视频配置信息
export function getVideoInfo(kchp) {
  return request({
    url: "/jgcontrol/getVideoInfo",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: { kchp: kchp }
  });
}

// 查询考试车音频配置信息
export function getAudioInfo(kchp) {
  return request({
    url: "/jgcontrol/getAudioInfo",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: { kchp: kchp }
  });
}

// 手动开始考试
export function beginExam(kskm, sfzmhm) {
  return request({
    url: "/jgcontrol/beginExam",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: { kskm, sfzmhm }
  });
}

// 查询考场当天统计信息
export function getStatisticsInfo(kcxh) {
  return request({
    url: "/jgcontrol/getStatisticsInfo",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: { kcxh: kcxh },
    isLoading: false
  });
}

// 查询科目考试项目
export function getExamItem(data) {
  return request({
    url: "/jgcontrol/getExamItem",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 查询科目专项评判扣分项目
export function getExamPointItem(data) {
  return request({
    url: "/jgcontrol/getExamPointItem",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 查询考试考场对应的考试车
export function getTodayExamCarList(data) {
  return request({
    url: "/jgcontrol/getTodayExamCarList",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 查询科目通用评判扣分项目
export function getCommExamPointItem(data) {
  return request({
    url: "/jgcontrol/getCommExamPointItem",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 人工评判扣分(添加人工评判)
export function addJuge(data) {
  return request({
    url: "/jgcontrol/addJuge",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data
  });
}

// 人工评判扣分(添加人工评判)
export function addWaring(data) {
  return request({
    url: "/jgcontrol/addWaring",
    method: "post",
    data: data
  });
}

// 获取语音对讲列表
export function getVoice() {
  return request({
    url: "/drvexamvoice/getVoice",
    method: "post",
    data: {},
    isLoading: false
  });
}

// 处理语音对讲请求
export function handleVoice(data) {
  return request({
    url: "/drvexamvoice/handleVoice",
    method: "post",
    data: data
  });
}

// 轮询获取接口后语音对讲状态
export function getVoiceStaus(data) {
  return request({
    url: "/drvexamvoice/getVoiceStaus",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data,
    isLoading: false
  });
}

// 预警信息处理
export function handleWaing(data) {
  return request({
    url: "/drvwarning/handleWaing",
    method: "post",
    data
  });
}
