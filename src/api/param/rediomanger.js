import request from "@/utils/request.js";
//监控新增
export function monitorAdd(data) {
    return request({
      url: "/videquipment/add",
      method: "POST",
      data: data,
    });
  }
  //监控详情
  export function monitormation(data) {
    return request({
      url: "/videquipment/info",
      method: "POST",
      data: data,
    });
  }
  //分页列表
  export function monitorlist(data) {
    return request({
      url: "/videquipment/list",
      method: "POST",
      data: data,
    });
  }
  //监控删除
  export function monitordel(data) {
    return request({
      url: "/videquipment/remove",
      method: "POST",
      data: data,
    });
  }
  //监控修改
  export function monitorupdate(data) {
    return request({
      url: "/videquipment/update",
      method: "POST",
      data: data,
    });
  }

  //视频新增
  export function videoadd(data) {
    return request({
      url: "/vidchannel/add",
      method: "POST",
      data: data,
    });
  }
  //视频表详情
  export function videomation(data) {
    return request({
      url: "/vidchannel/info",
      method: "POST",
      data: data,
    });
  }
  //视频表分页列表
  export function videolist(data) {
    return request({
      url: "/vidchannel/list",
      method: "POST",
      data: data,
    });
  }
  //视频表删除多个
  export function videodel(data) {
    return request({
      url: "/vidchannel/remove",
      method: "POST",
      data: data,
    });
  }

  //视频表修改
  export function videoup(data) {
    return request({
      url: "/vidchannel/update",
      method: "POST",
      data: data,
    });
  }
  //视频表关联
  export function videoguanlian(data) {
    return request({
      url: "/vidchannel/connectionvideo",
      method: "POST",
      data: data,
    });
  }
  //获取监控设备下拉列表
  export function jkselect(data) {
    return request({
      url: "/videquipment/simple",
      method: "POST",
      data: data,
    });
  }
  //视频设备中考试项目接口
  export function spksxmselect(data) {
    return request({
      url: "/equipment/simple",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      data: data,
    });
  }
  //除了考试项目的其他接口
  export function lxselect(data) {
    return request({
      url: "/drvcar/simple",
      method: "POST",
      data: data,
    });
  }
  //车型
  export function cxselect(query) {
    return request({
      url: "/drvcar/groupList",
      method: "GET",
      params: query,
    });
  }
  //取消关联
  export function cancelconnectionvideo(data) {
    return request({
      url: "/vidchannel/cancelconnectionvideo/spxh",
      method: "POST",
      data: data,
    });
  }

