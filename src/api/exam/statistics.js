import request from "@/utils/request.js";

// 考试场合格率查询统计
export function getExamRoomQualifiedPage(data) {
    return request({
        url: "/statistics/examroom/qualified",
        method: "post",
        data
    });
}

// 考试场合格率按天查询统计
export function getExamRoomDayQualifiedPage(data) {
    return request({
        url: "/statistics/examroom/days/qualified",
        method: "post",
        data
    });
}

// 培训驾校合格率查询统计
export function getDrvSchoolQualifiedPage(data) {
    return request({
        url: "/statistics/drvschool/qualified",
        method: "post",
        data
    });
}

// 考试车合格率查询统计
export function getExamCarQualifiedPage(data) {
    return request({
        url: "/statistics/car/qualified",
        method: "post",
        data
    });
}

// 考试车合格率查询统计
export function getExamCarTypeQualifiedPage(data) {
    return request({
        url: "/statistics/exam/cartype/qualified",
        method: "post",
        data
    });
}

// 考试员合格率查询统计
export function getExamInerQualifiedPage(data) {
    return request({
        url: "/statistics/examiner/qualified",
        method: "post",
        data
    });
}

// 考试线路合格率查询统计
export function getExamLineQualifiedPage(data) {
    return request({
        url: "/statistics/examline/qualified",
        method: "post",
        data
    });
}

// 人工评判查询统计
export function getManualQualifiedPage(data) {
    return request({
        url: "/statistics/manual/point",
        method: "post",
        data
    });
}

// 考试项目合格率查询统计
export function getExamItemQualifiedPage(data) {
    return request({
        url: "/statistics/exam/project/qualified",
        method: "post",
        data
    });
}

// 扣分项目查询统计
export function getExamPointQualifiedPage(data) {
    return request({
        url: "/statistics/exam/point",
        method: "post",
        data
    });
}

// 考试员扣分查询统计
export function getExamInerPointQualifiedPage(data) {
    return request({
        url: "/statistics/examiner/point",
        method: "post",
        data
    });
}

// 考试员扣分项目查询统计
export function getExamInerProjectQualifiedPage(data) {
    return request({
        url: "/statistics/examiner/point/project",
        method: "post",
        data
    });
}

// 人工评判查询统计
export function getManualQualifiedPages(data) {
    return request({
        url: "/statistics/examroom/days/deputybrake",
        method: "post",
        data
    });
}