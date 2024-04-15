import request from "@/utils/request.js";

// 人工评判表分页列表
export function getDrvExamJudgePageList(data) {
  return request({
    url: "/drvexamjudge/list",
    method: "post",
    data,
  });
}

// 人工评判表详情
export function getDrvExamJudgeInfo(data) {
  return request({
    url: "/drvexamjudge/info",
    method: "post",
    data,
  });
}

// 人工评判审核
export function getDrvExamJudgeAuditExam(data) {
  return request({
    url: "/drvexamjudge/auditexam",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });
}

// 人工评判表新增
export function getDrvExamJudgeAdd(data) {
  return request({
    url: "/drvexamjudge/add",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  });
}
