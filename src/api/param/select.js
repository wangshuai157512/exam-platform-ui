import request from "@/utils/request.js";
import authRequest from "@/utils/auth-request.js";

// 发证机关下拉查询
export function getOrganSelect() {
    return request({
        url: "/sys-fzjg/simple",
        method: "post",
    });
}

// 部门下拉查询
export function getDeptSelect() {
    return request({
        url: "/glbm/simple",
        method: "post",
    });
}

// 考场下拉查询
export function getExamRoomSelect(kcjc) {
    return request({
        url: "/examroom/simple",
        method: "post",
        data: { kcjc: kcjc || "" },
    });
}

// 监控设备下拉列表
export function getMonitorSelect(kcxh) {
    return request({
        url: "/videquipment/simple",
        method: "post",
        data: { kcxh: kcxh || "" },
    });
}

// 考试员下拉查询
export function getExamStaffSelect() {
    return request({
        url: "/drvexaminer/simple",
        method: "post",
    });
}

// 设备下拉查询
export function getExamToolSelect() {
    return request({
        url: "/equipment/simple",
        method: "post",
    });
}

// 考车下拉查询
export function getExamCarSelect(kcxh) {
    return request({
        url: "/drvcar/simple",
        method: "post",
        data: { kcxh: kcxh || "" },
    });
}
// 其他下拉查询
export function getOtherSelect(type) {
    return request({
        url: "/dict/data/simple?dictType=" + type,
        method: "get",
    });
}

// 考试项目下拉查询
export function getDrvSelect(data) {
    return request({
        url: "/drv-code-exam/simple",
        method: "POST",
        data: data || { kcxh: "", kskm: "" },
    });
}

// 考试项目下拉查询
export function getSchoolSelect() {
    return request({
        url: "/drvschool/simple",
        method: "POST",
    });
}

// 登录相关

// 部门下拉查询
export function getuserDeptSelect() {
    return authRequest({
        url: "/system/dept/simple",
        method: "GET",
    });
}

// 角色下拉查询
export function getuserRoleSelect(userType) {
    if (userType === null) {
        userType = ''
    }
    return authRequest({
        url: `/system/role/simple?examinerFlag=${userType}`,
        method: "GET",
    });
}

// 考试线路查询
export function getLineSelect() {
    return request({
        url: "/examline/simple",
        method: "POST",
    });
}