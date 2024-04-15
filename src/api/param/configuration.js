import request from "@/utils/request.js";

// 新增车辆配置
export function addVehicleFile(data) {
    return request({
        url: "/s-car-file-config/edit",
        method: "post",
        data: data,
    });
}

// 车辆配置列表
export function vehicleList(data) {
    return request({
        url: "/s-car-file-config/list",
        method: "post",
        data: data,
    });
}

// 新增车型配置
export function addModelFile(data) {
    return request({
        url: "/s-cartype-file-config/edit",
        method: "post",
        data: data,
    });
}

// 车型配置列表
export function modelList(data) {
    return request({
        url: "/s-cartype-file-config/list",
        method: "post",
        data: data,
    });
}

// 车型文件页面下载文件
export function modelDownLoad(data) {
    return request({
        url: "/s-cartype-file-config/download",
        method: "post",
        data: data,
    });
}

// 车辆文件页面下载文件
export function vehicleDownLoad(data) {
    return request({
        url: "/s-car-file-config/download",
        method: "post",
        data: data,
    });
}

// 车载配置列表
export function vehicleConfigList(data) {
    return request({
        url: "/s-car-config/list",
        method: "post",
        data: data,
    });
}
// 车型
export function examroomData(data) {
    return request({
        url: "/examroom/info",
        method: "post",
        data: data,
    });
}
// 车载配置列表导出
export function vehicleConfigExport(data) {
    return request({
        url: "/s-car-config/export",
        method: "post",
        data: data,
    });
}

// 上传车载配置文件
export function vehicleUploadConfig(data) {
    return request({
        url: "/s-car-config/upload",
        method: "post",
        data: data,
        },
        false,
        300000
    );
}

// 编辑车载配置文件
export function vehicleConfigEdit(data) {
    return request({
        url: "/s-car-config/edit",
        method: "post",
        data: data,
    });
}

// 考场考试列表
export function examRoomExamList(data) {
    return request({
        url: "/s-examroom-exam-config/list",
        method: "post",
        data: data,
    });
}

// 编辑考场考试
export function examRoomExamEdit(data) {
    return request({
        url: "/s-examroom-exam-config/edit",
        method: "post",
        data: data,
    });
}

//考试场次列表
export function examSessionList(data) {
    return request({
        url: "/s-examroom-session/list",
        method: "post",
        data: data,
    });
}

//编辑考试场次
export function examSessionEdit(data) {
    return request({
        url: "/s-examroom-session/edit",
        method: "post",
        data: data,
    });
}

//考场考试项目列表
export function examProjectList(data) {
    return request({
        url: "/s-examroom-project-config/list",
        method: "post",
        data: data,
    });
}

//考场考试项目编辑
export function examProjectEdit(data) {
    return request({
        url: "/s-examroom-project-config/edit",
        method: "post",
        data: data,
    });
}

//考场考试代码数据
// export function examProjectCode(data) {
//     return request({
//         url: "/drv-code-exam/simple",
//         method: "post",
//         data: data,
//     });
// }
// export function examProjectCode(data) {
//     return request({
//         url: "/s-examroom-project-config/examitem",
//         method: "post",
//         data: data,
//     });
// }
export function examProjectCode(data) {
    return request({
        url: "/s-examroom-project-config/exam-project-list",
        method: "post",
        data: data,
    });
}


//接口配置列表
export function interfaceList(data) {
    return request({
        url: "/syssoftware/list",
        method: "post",
        data: data,
    });
}

//接口配置列表
export function interfaceEdit(data) {
    return request({
        url: "/syssoftware/edit",
        method: "post",
        data: data,
    });
}

//接口配置列表
export function interfaceDownLoad(data) {
    return request({
        url: "/syssoftware/download",
        responseType: "blob",
        method: "post",
        data: data,
    });
}

//系统检测配置列表
export function detectionConfigList(data) {
    return request({
        url: "/syscheckconfig/list",
        method: "post",
        data: data,
    });
}

//系统检测配置获取添加检测项目
export function detectionConfigAddItem(data) {
    return request({
        url: "/syscheckconfig/getAddCheckItem",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "post",
        data: data,
    });
}

//系统检测配置获取添加
export function detectionConfigAdd(data) {
    return request({
        url: "/syscheckconfig/add",
        method: "post",
        data: data,
    });
}

//系统检测配置获取修改检测项目
export function detectionConfigEditItem(data) {
    return request({
        url: "/syscheckconfig/getEditeCheckItem",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "post",
        data: data,
    });
}

//系统检测配置获取修改
export function detectionConfigEdit(data) {
    return request({
        url: "/syscheckconfig/update",
        method: "post",
        data: data,
    });
}

//下载电子考试车型文件
export function downLoadCarType(data) {
    return request({
        url: "/s-cartype-file-config/download",
        method: "post",
        data: data,
    });
}

//考场配置管理列表
export function examRoomConfigList(data) {
    return request({
        url: "/s-examroom-config/list",
        method: "post",
        data: data,
    });
}

//考场配置管理编辑
export function examRoomConfigEdit(data) {
    return request({
        url: "/s-examroom-config/edit",
        method: "post",
        data: data,
    });
}

//考场配置管理同步
export function examRoomConfigSync(data) {
    return request({
        url: "/s-examroom-config/sync",
        method: "post",
        data: data,
    });
}

//评判参数设置列表
export function evaluationParametersList(data) {
    return request({
        url: "/drv-code-exam/list",
        method: "post",
        data: data,
    });
}

//评判参数设置列表导出
export function evaluationParametersExport(data) {
    return request({
        url: "/drv-code-exam/export",
        method: "post",
        data: data,
    });
}